import { useState, useContext } from 'react';
import { loginUser } from '../api/authApi';
import { AuthContext } from '../context/AuthContext';

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      login(data.token);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl border-2 border-gray-300 shadow-2xl p-10 relative">
          {/* Icon at top */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full border-4 border-gray-300 p-4 shadow-lg">
            <span className="text-4xl">📊</span>
          </div>

          {/* Header spacing */}
          <div className="mt-8 mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="flex items-center border-b-2 border-gray-300 pb-1 focus-within:border-blue-500 transition">
              <span className="text-2xl mr-3 text-gray-600">✉️</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-base"
                placeholder="Email address"
              />
            </div>

            {/* Password Field */}
            <div className="flex items-center border-b-2 border-gray-300 pb-1 focus-within:border-blue-500 transition mt-6">
              <span className="text-2xl mr-3 text-gray-600">🔒</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-base"
                placeholder="Password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-3 rounded-lg mt-8 hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>

            {/* Register Link */}
            <div className="text-center mt-6 border-t-2 border-gray-200 pt-6">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={onSwitch}
                  className="text-gray-600 font-bold hover:text-gray-700 transition"
                >
                  CREATE ONE
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
