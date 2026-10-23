import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice.ts';
import { api } from '../../services/api.ts';
import { Flame, Lock, Mail } from 'lucide-react';
import { Input, Button, message } from 'antd';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.loginAdmin(email.trim(), password);
      dispatch(setCredentials(res));
      message.success(`Welcome back, ${res.user.name}`);
      navigate('/admin/dashboard');
    } catch (err: any) {
      message.error(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#210D10] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-900/40">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7A1C24] to-[#551016] p-6 text-center text-white space-y-2">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto shadow">
            <Flame className="w-7 h-7 fill-amber-400" />
          </div>
          <h1 className="font-serif-title text-2xl font-bold text-amber-100">
            BookMyPooja Operations
          </h1>
          <p className="text-xs text-stone-300">
            Administrative Management & Priest Coordination Console
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Admin Email Address
              </label>
              <Input
                prefix={<Mail className="w-4 h-4 text-stone-400 mr-1" />}
                type="email"
                size="large"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Security Password
              </label>
              <Input.Password
                prefix={<Lock className="w-4 h-4 text-stone-400 mr-1" />}
                size="large"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            <div className="pt-2">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                className="font-bold text-sm h-11"
              >
                Sign In to Dashboard
              </Button>
            </div>
          </form>

          <p className="text-xs text-stone-500 text-center">
            Admin access is provisioned by your system administrator. No demo credentials are enabled.
          </p>
        </div>
      </div>
    </div>
  );
};
