import { useState } from 'react';
import { loginUser } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser(email, password);
    if (data.user) {
      setMsg('Успішний вхід!');
    } else {
      setMsg(data.error || 'Помилка входу');
    }
  };

  return (
    <div>
      <h2>Вхід</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Увійти</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
