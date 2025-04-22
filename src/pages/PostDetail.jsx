import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import CommentNode from '../components/CommentNode';
import CommentForm from '../components/CommentForm';
import { useAuth } from '../AuthContext';

export default function PostDetail() {
  const { id } = useParams();              // Post ID
  const navigate = useNavigate();
  const { user }  = useAuth();

  const [post, setPost] = useState(null);
  const [cmts, setCmts] = useState([]);

  /** fetch comment tree(nested) */
  const fetchCmts = () =>
    api.get(`/comments/post/${id}`).then(res => setCmts(res.data));

  useEffect(() => {
    api.get(`/posts/${id}`).then(res => setPost(res.data));
    fetchCmts();                           
  }, [id]);

  if (!post) return <p className="text-center mt-10">loading…</p>;

  /* delete post */
  const handleDelete = async () => {
    if (!window.confirm('are you sure to delete？')) return;
    await api.delete(`/posts/${id}`);
    navigate('/my-posts');
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      {/* return to post page */}
      <Link to="/posts" className="text-blue-600 hover:underline">
        &larr; Return Post page
      </Link>

      {/* title and author actions */}
      <div className="flex justify-between items-start mt-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>

        {user?.id === post.userId && (
          <div className="space-x-2">
            <button
              onClick={() => navigate(`/posts/${id}/edit`)}
              className="px-3 py-1 bg-yellow-500 text-white rounded">
              edit
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-600 text-white rounded">
              delete
            </button>
          </div>
        )}
      </div>

      {/* details */}
      <p className="mt-2">
        <span className="font-semibold">created at：</span>
        {new Date(post.createdAt).toLocaleString()}
      </p>
      <p className="mt-1">
        <span className="font-semibold">category：</span>
        {post.category || '未分类'}
      </p>
      <p className="mt-4 whitespace-pre-line">
        <span className="font-semibold">content：</span>
        {post.description}
      </p>

      {post.imageUrl && (
        <div className="mt-4">
          <span className="font-semibold">imgae：</span><br/>
          <img src={post.imageUrl} alt="" className="mt-2 max-w-full rounded" />
        </div>
      )}

      {/* comment */}
      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">post list</h2>

      {/* loading comment */}
      <CommentForm postId={id} onSuccess={fetchCmts} />

      {cmts.length === 0 && <p className="mt-2">No more post</p>}
      {cmts.map(c => (
        <CommentNode key={c.id}
                     cmt={c}
                     postId={id}
                     onRefresh={fetchCmts} />
      ))}
    </div>
  );
}
