import { useAuth } from '../AuthContext';

export default function Home() {
  const { user, logout } = useAuth();
  return (
    <div style={{padding:'2rem'}}>
      <h2>Hi, {user.username} 👋</h2>
      <p>Protected Home(test)</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
