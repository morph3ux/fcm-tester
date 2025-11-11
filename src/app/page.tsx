'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [serviceAccount, setServiceAccount] = useState('');
  const [token, setToken] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setServiceAccount(localStorage.getItem('fcm-serviceAccount') || '');
    setToken(localStorage.getItem('fcm-token') || '');
    setTitle(localStorage.getItem('fcm-title') || '');
    setBody(localStorage.getItem('fcm-body') || '');
    setIconUrl(localStorage.getItem('fcm-iconUrl') || '');
    setData(localStorage.getItem('fcm-data') || '');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    localStorage.setItem('fcm-serviceAccount', serviceAccount);
    localStorage.setItem('fcm-token', token);
    localStorage.setItem('fcm-title', title);
    localStorage.setItem('fcm-body', body);
    localStorage.setItem('fcm-iconUrl', iconUrl);
    localStorage.setItem('fcm-data', data);

    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceAccount: JSON.parse(serviceAccount),
          token,
          title,
          body,
          iconUrl: iconUrl || undefined,
          data: data ? JSON.parse(data) : undefined,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Notification sent successfully!');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="w-full max-w-md bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">FCM Push Notification Tester</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Service Account JSON</label>
            <textarea
              value={serviceAccount}
              onChange={(e) => setServiceAccount(e.target.value)}
              className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
              rows={6}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Device Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Body</label>
            <input
              type="text"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Icon URL (optional)</label>
            <input
              type="url"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data (JSON, optional)</label>
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </main>
    </div>
  );
}
