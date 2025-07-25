import { useEffect, useState } from 'react';
import { getItems } from '../api';

export default function Items() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getItems().then(data => {
      if (Array.isArray(data)) setItems(data);
      else setError(data.error || 'Помилка');
    });
  }, []);

  return (
    <div>
      <h2>Айтемчики</h2>
      {error && <p>{error}</p>}
      <ul>
        {items.map(item => (
          <li key={item._id}>
            {item.title} — 💰 {item.price} грн
          </li>
        ))}
      </ul>
    </div>
  );
}
