import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import PostCard from '../components/PostCard';
import { useAuth } from '../AuthContext';

const LIMIT = 10;

export default function Posts() {
  const { user } = useAuth();
  const [posts, setPosts]   = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [input, setInput]   = useState('');

  /** get post based on conditions */
  const load = useCallback(async (reset = false) => {
    if (loading || (noMore && !reset)) return;
    setLoading(true);

    const url = keyword
      ? `/posts/category/${encodeURIComponent(keyword)}`
      : '/posts/latest';

    const { data } = await api.get(url, {
      params: { offset: reset ? 0 : offset, limit: LIMIT }
    });

    setPosts(prev => reset ? data : [...prev, ...data]);
    setOffset(prev => reset ? LIMIT : prev + LIMIT);
    setNoMore(data.length < LIMIT);
    setLoading(false);
  }, [loading, noMore, offset, keyword]);

  useEffect(() => { load(true); }, [keyword]);

  const search = (e) => {
    e.preventDefault();
    setKeyword(input.trim());
  };

  /** clear cearch */
  const clear = () => {
    setInput(''); setKeyword(''); setNoMore(false); setPosts([]); setOffset(0);
  };

  return (
    <div className="max-w-xl mx-auto py-6">
      {/* top bar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {keyword ? `category：${keyword}` : 'newest post'}
        </h1>
        <div className="space-x-3">
          {user && (
            <Link to="/my-posts" className="text-blue-600 hover:underline">
              My Posts
            </Link>
          )}
          <br />
          <Link to="/posts/new"
                className="px-3 py-1 bg-green-600 text-white rounded">
            + post!
          </Link>
        </div>
      </div>

      {/* search bar */}
      <form onSubmit={search} className="mb-4 flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="category"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="px-4 bg-blue-600 text-white rounded">search</button>
        {keyword && (
          <button type="button"
                  onClick={clear}
                  className="px-3 bg-gray-300 rounded">
            clear
          </button>
        )}
      </form>

      {/* post list */}
      {posts.map((p, idx) => (
        <PostCard key={p.id} post={p} no={idx + 1} />
      ))}

      {/* load more */}
      {!noMore && (
        <button
          onClick={() => load()}
          className="block mx-auto mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? 'loading…' : '10 more post'}
        </button>
      )}

      {noMore && <p className="text-center mt-4 text-gray-500">no more post~</p>}
    </div>
  );
}
