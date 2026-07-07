import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Testing2 = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCashier = async () => {
    setError(null);
    setResult(null);

    if (!username || !password) {
      setError('Username at password ay kailangan.');
      return;
    }

    setLoading(true);

    try {
      // Kunin muna ang kasalukuyang session (dapat admin ang naka-login)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Wala kang active session. Mag-login muna.');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_PROJECT_URL}/functions/v1/admin_create_cashier`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Create cashier error:', data.error);
        setError(data.error || 'May naganap na error.');
        setLoading(false);
        return;
      }

      console.log('Cashier created:', data);
      setResult(data);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('May naganap na unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>Create Cashier Account</h2>

      <div style={{ marginBottom: '10px' }}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="cashier1"
          style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>

      <button
        onClick={handleCreateCashier}
        disabled={loading}
        className="px-8 py-2 bg-[green]"
        style={{ color: 'white', opacity: loading ? 0.6 : 1 }}
      >
        {loading ? 'Creating...' : 'Create Account'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {result && (
        <pre style={{ background: '#eee', padding: '10px', marginTop: '10px' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Testing2;