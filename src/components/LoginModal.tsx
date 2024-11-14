import { useState } from 'react';
import { motion } from 'framer-motion';
import { ApiService } from '@/services/api';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { user, token } = await ApiService.login(email, password);
      localStorage.setItem('auth_token', token);
      onSuccess();
    } catch (err) {
      setError('登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-white text-2xl font-bold mb-6">登录</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/60 block mb-2">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#06b6d4]"
              required
            />
          </div>
          
          <div>
            <label className="text-white/60 block mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#06b6d4]"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
          
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-[#06b6d4] text-white hover:bg-[#06b6d4]/80 transition-colors disabled:opacity-50"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
} 