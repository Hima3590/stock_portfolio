import { useState } from 'react';
import { registerUser } from '../api/authApi';

const Register = ({ onSwitch }) => {
  const [form, setForm] = useState({});
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerUser(form);
      onSwitch(); // Automatically switch to login page
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={submit} className="flex flex-col gap-4">
        <input 
          placeholder="Name" 
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          className="border px-3 py-2 rounded"
        />
        <input 
          type="email"
          placeholder="Email" 
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
          className="border px-3 py-2 rounded"
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
          className="border px-3 py-2 rounded"
        />
        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Register
        </button>
      </form>

      {/* Switch to Login */}
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <button
          onClick={onSwitch}
          className="text-blue-600 underline hover:text-blue-800"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;
