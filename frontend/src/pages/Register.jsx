import { useState } from 'react';
import { registerUser } from '../api/authApi';

const Register = ({ onSwitch }) => {
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(form);
      onSwitch();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl border-2 border-gray-300 shadow-2xl p-10 relative">
          {/* Icon at top */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full border-4 border-gray-300 p-4 shadow-lg">
            <span className="text-4xl">📊</span>
          </div>

          {/* Header spacing */}
          <div className="mt-8 mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {/* Name Field */}
            <div className="flex items-center border-b-2 border-gray-300 pb-1 focus-within:border-blue-500 transition">
              <span className="text-2xl mr-3 text-gray-600">👤</span>
              <input
                type="text"
                placeholder="Full name"
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="w-full bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-base"
              />
            </div>

            {/* Email Field */}
            <div className="flex items-center border-b-2 border-gray-300 pb-1 focus-within:border-blue-500 transition mt-6">
              <span className="text-2xl mr-3 text-gray-600">✉️</span>
              <input
                type="email"
                placeholder="Email address"
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-base"
              />
            </div>

            {/* Password Field */}
            <div className="flex items-center border-b-2 border-gray-300 pb-1 focus-within:border-blue-500 transition mt-6">
              <span className="text-2xl mr-3 text-gray-600">🔒</span>
              <input
                type="password"
                placeholder="Password"
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                className="w-full bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-base"
              />
            </div>

            <p className="text-xs text-gray-500 mt-4">At least 6 characters for security</p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-3 rounded-lg mt-8 hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Creating...' : 'CREATE ACCOUNT'}
            </button>

            {/* Login Link */}
            <div className="text-center mt-6 border-t-2 border-gray-200 pt-6">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <button
                  onClick={onSwitch}
                  className="text-gray-600 font-bold hover:text-gray-700 transition"
                >
                  SIGN IN
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
