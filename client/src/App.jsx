import { useState, useEffect } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      setIsLoggedIn(true);
    } else {
      alert('Логін невдалий');
    }
  };

  const handleLogout = async () => {
    await fetch('http://localhost:3000/logout', {
      credentials: 'include',
    });
    setIsLoggedIn(false);
    setItems([]);
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchItems = async () => {
      const res = await fetch('http://localhost:3000/items', {
        credentials: 'include',
      });
      const data = await res.json();
      setItems(data);
    };

    fetchItems();
  }, [isLoggedIn]);

  return (
    <div style={{ padding: '2rem' }}>
      {isLoggedIn ? (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <h2>Items</h2>
          <ul>
            {items.map((item) => (
              <li key={item._id}>{item.title}</li>
            ))}
          </ul>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br />
          <input
            type="password"
            placeholder="пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
}

export default App;
