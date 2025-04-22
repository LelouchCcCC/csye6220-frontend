import { Link } from 'react-router-dom';

/**
 * @param {object} props
 * @param {object} props.post Post object
 * @param {number} props.no   Sequence number (starting from 1)
 */
export default function PostCard({ post, no }) {
  return (
    <div className="border rounded p-4 mb-3 shadow-sm">
      <h3 className="text-xl font-semibold">
        <span className="text-gray-400 mr-2">#{no} </span>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>

      <p className="text-sm text-gray-500">
        Created at: {new Date(post.createdAt).toLocaleString()}
      </p>

      <p className="text-sm text-gray-500">
        Category: {post.category || 'Uncategorized'}
      </p>

      <p className="mt-2 line-clamp-3">Content: {post.description}</p>
    </div>
  );
}
