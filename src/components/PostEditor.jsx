import { useState, useEffect } from 'react';
import { api } from '../api';
import { useNavigate, useParams } from 'react-router-dom';

export default function PostEditor({ isEdit = false }) {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: '', imageUrl: ''
  });

  /* Fetch existing data in edit mode */
  useEffect(() => {
    if (isEdit) {
      api.get(`/posts/${id}`).then(res => setForm(res.data));
    }
  }, [id, isEdit]);

  const save = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await api.put(`/posts/${id}`, form);
    } else {
      await api.post('/posts', form);
    }
    nav(isEdit ? `/posts/${id}` : '/my-posts');
  };

  return (
    <form onSubmit={save} className="max-w-xl mx-auto py-6 space-y-4">
      <h1 className="text-2xl font-bold">
        {isEdit ? 'Edit Post' : 'New Post'}
      </h1>

      <input
        className="w-full border p-2 rounded"
        placeholder="Title *"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        required
      />

      <textarea
        className="w-full border p-2 h-40 rounded"
        placeholder="Content *"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        required
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Category, e.g.: Travel / Tech"
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Image URL (optional)"
        value={form.imageUrl}
        onChange={e => setForm({ ...form, imageUrl: e.target.value })}
      />

      <button className="px-4 py-2 bg-blue-600 text-white rounded">
        {isEdit ? 'Save Changes' : 'Publish'}
      </button>
    </form>
  );
}
