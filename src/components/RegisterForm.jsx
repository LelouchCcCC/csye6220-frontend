import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function RegisterForm() {
  const nav = useNavigate();
  const [f, setF] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', f);
      nav('/login', { state: { registered: true } });
    } catch (e) {
      setMsg(e.response?.data?.message || 'Register failed');
    }
  };

  return (
    <form onSubmit={submit} className="form">
      <h1>Register</h1>
      <input
        placeholder="Username"
        value={f.username}
        onChange={e => setF({ ...f, username: e.target.value })}
        required
      />
      <input
        placeholder="Email"
        value={f.email}
        onChange={e => setF({ ...f, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={f.password}
        onChange={e => setF({ ...f, password: e.target.value })}
        required
      />
      <button>Register</button>
      {msg && <p style={{ color: 'red' }}>{msg}</p>}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}
