import { useState } from 'react';
import CommentForm from './CommentForm';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function CommentNode({ cmt, level = 0, postId, onRefresh }) {
  const { user } = useAuth();
  const [showReply, setShowReply] = useState(false);

  const del = async () => {
    if (!window.confirm('Are you sure you want to delete this comment and all its replies?')) return;
    await api.delete(`/comments/${cmt.id}`);
    onRefresh();
  };

  return (
    <div style={{ marginLeft: level * 20 }} className="mt-3">
      <div className="bg-gray-100 rounded p-2">
        <p>{cmt.content}</p>
        <small>{new Date(cmt.createdAt).toLocaleString()}</small>

        <div className="text-sm space-x-3 mt-1">
          {user && (
            <button
              onClick={() => setShowReply(!showReply)}
              className="text-blue-600">
              Reply
            </button>
          )}
          {user?.id === cmt.userId && (
            <button onClick={del} className="text-red-600">Delete</button>
          )}
        </div>

        {showReply && (
          <CommentForm
            postId={postId}
            parentId={cmt.id}
            onSuccess={onRefresh}
            onCancel={() => setShowReply(false)}
          />
        )}
      </div>

      {/* Recursive child comments */}
      {cmt.replies?.map(r => (
        <CommentNode
          key={r.id}
          cmt={r}
          level={level + 1}
          postId={postId}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}
