import { useState } from 'react';
import {supabase} from "../lib/supabaseClient";

const Testing = () => {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleLogin = async () => {
    setError(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'markies@pos.ph', // yung admin account na ginawa mo sa dashboard
      password: '1234'           // yung password na sinet mo sa Supabase
    });

    if (error) {
      console.error('Login error:', error.message);
      setError(error.message);
      return;
    }

    console.log('Full session:', data.session);
    console.log('User email:', data.session?.user.email);
    
    // I-decode natin yung JWT payload para makita yung role
    const token = data.session?.access_token;
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded JWT payload:', payload);
      setResult(payload);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Test Supabase Login</h2>
      <button onClick={handleLogin} className='px-8 py-2 bg-[green]'>Sign In</button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {result && (
        <pre style={{ background: '#eee', padding: '10px', marginTop: '10px' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Testing;
