import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AuthLayout from '../components/layout/AuthLayout';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const RegisterPage = () => {
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await apiClient.post('/auth/register', data);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitleText="Already have an account?"
      subtitleLinkText="Sign in"
      subtitleLinkTo="/login"
      serverError={serverError}
      setServerError={setServerError}
      successMessage={success ? "Registration successful! Redirecting..." : null}
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Input label="Name" id="name" {...register('name')} error={errors.name?.message} />
          <Input label="Email address" id="email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Password" id="password" type="password" {...register('password')} error={errors.password?.message} />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
