import { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';

/**
 * Generic comment form
 * @param postId           Post ID
 * @param parentId         Parent comment ID (for replies)
 * @param onSuccess        Callback on success (usually to reload the comment tree)
 * @param onCancel         Callback on cancel (only in reply scenarios)
 */
export default function CommentForm({ postId, parentId, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;  // Do not display if not logged in

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    const body = { postId, content, parentCommentId: parentId || null };
    await api.post('/comments', body);       // JSON DTO
    onSuccess && onSuccess();
    setContent('');
    setLoading(false);
    onCancel && onCancel();
  };

  return (
    <form onSubmit={submit} className="mt-2 space-y-2">
      <textarea
        className="w-full border rounded p-2"
        placeholder="Write your comment..."
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={3}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1 bg-blue-600 text-white rounded">
          {loading ? 'Sending…' : 'Send'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-gray-300 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
