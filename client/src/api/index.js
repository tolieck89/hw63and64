const API_BASE = 'http://localhost:3000'; 

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const getItems = async () => {
  const res = await fetch(`${API_BASE}/items`, {
    credentials: 'include', 
  });
  return res.json();
};
