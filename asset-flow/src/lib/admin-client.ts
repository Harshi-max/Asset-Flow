export async function adminAction(action: string, id?: string, payload?: any) {
  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, id, payload }),
    credentials: 'include',
  });
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch('/api/auth/me', { credentials: 'include' });
  return res.json();
}
