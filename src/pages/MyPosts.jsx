import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import PostCard from '../components/PostCard';

export default function MyPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/posts/my').then(res => setPosts(res.data));
  }, []);

  return (
    <div className="max-w-xl mx-auto py-6">
      {/* TopBar: fetch all the posts */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <Link to="/posts" className="text-blue-600 hover:underline">
          ← All Posts
        </Link>
      </div>

      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((p, i) => <PostCard key={p.id} post={p} no={i + 1} />)}
    </div>
  );
}
