import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AuthLayout from '../components/layout/AuthLayout';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const response = await apiClient.post('/auth/login', data);
      const token = response.data.accessToken || response.data.token;
      if (!token) throw new Error('No token received');
      login(token);
      setSuccess(true);
      setTimeout(() => navigate(from), 1000);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitleText="Or"
      subtitleLinkText="create a new account"
      subtitleLinkTo="/register"
      serverError={serverError}
      setServerError={setServerError}
      successMessage={success ? "Login successful! Redirecting..." : null}
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Input label="Email address" id="email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Password" id="password" type="password" {...register('password')} error={errors.password?.message} />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
