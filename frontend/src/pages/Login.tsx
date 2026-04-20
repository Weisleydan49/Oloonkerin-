import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginApi(email, password);
      login(response.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="glass p-8 rounded-2xl w-full max-w-md shadow-2xl relative z-10 border border-border/50">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary/10 text-primary flex items-center justify-center rounded-xl mb-4 shadow-inner border border-primary/20">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Oloonkerin Admin</h1>
          <p className="text-muted-foreground text-sm mt-2 text-center">Enter your credentials to access the management portal</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm rounded-md text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">Email Address</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground" 
              placeholder="admin@oloonkerin.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">Password</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-sm shadow-md hover:shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
