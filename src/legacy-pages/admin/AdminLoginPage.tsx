import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice.ts';
import { api } from '../../services/api.ts';
import { Lock, Mail } from 'lucide-react';
import { Input, Button } from 'antd';
import { useLanguage } from '../../hooks/useLanguage.tsx';
import { useToaster } from '../../hooks/useToaster.ts';
import { LanguageSelector } from '../../components/common/LanguageSelector.tsx';
import { useSiteSettings } from '../../hooks/useSiteSettings.tsx';
import { SiteLogo } from '../../components/common/SiteLogo.tsx';

export const AdminLoginPage: React.FC = () => {
  const toaster = useToaster();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const { settings } = useSiteSettings();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.loginAdmin(email.trim(), password);
      dispatch(setCredentials(res));
      toaster.success(t('adminLogin.welcome', { name: res.user.name }));
      navigate('/admin/dashboard');
    } catch (err: any) {
      toaster.error(err instanceof Error ? err.message : t('adminLogin.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#210D10] flex items-center justify-center p-4">
      <LanguageSelector color='black' borderColor='black'  className="absolute right-4 top-4 text-amber-100" />
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-900/40">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7A1C24] to-[#551016] p-6 text-center text-white space-y-2">
          <SiteLogo
            className="mx-auto flex-col text-amber-100"
            markClassName="h-12 w-12 rounded-xl bg-amber-500/20 text-amber-300 shadow"
          />
          <h1 className="font-serif-title text-2xl font-bold text-amber-100">
            {settings.websiteName || settings.businessName}
          </h1>
          <p className="text-xs text-stone-300">
            {settings.websiteSubtitle || t('adminLogin.description')}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t('adminLogin.email')}
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
                {t('adminLogin.password')}
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
                {t('adminLogin.submit')}
              </Button>
            </div>
          </form>

          <p className="text-xs text-stone-500 text-center">
            {t('adminLogin.accessNote')}
          </p>
        </div>
      </div>
    </div>
  );
};
