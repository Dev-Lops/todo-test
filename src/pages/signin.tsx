'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInData } from '../schemas/auth.schema';
import { useAuth } from '../contexts/AuthContext';
import { Form } from '../components/ui/Form/Form';
import { FormField } from '../components/ui/Form/FormField';
import { Button } from '../components/ui/Button/Button';
import { Toast } from '../components/ui/Toast/Toast';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function SignIn() {
  const { signIn } = useAuth();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (data: SignInData) => {
    try {
      await signIn(data);
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Erro ao fazer login',
        type: 'error'
      });
      form.setValue('password', '');
    }
  };

  return (
    <>
      <Head>
        <title>Login | Todo App</title>
      </Head>
      <div className="min-h-screen bg-[#F0F4F3] flex flex-col items-center justify-center mx-auto">
        <div className="w-full max-w-md p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-6">
              Entrar
            </h1>
            <Form form={form} onSubmit={handleSubmit}>
              <div className="space-y-4">
                <FormField
                  name="email"
                  label="E-mail"
                  type="email"
                  placeholder="seu@email.com"
                />
                <FormField
                  name="password"
                  label="Senha"
                  type="password"
                  placeholder="Sua senha"
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
              </div>
            </Form>
            <div className="mt-4 text-center">
              <Link
                href="/signup"
                className="text-[#50C2C9] hover:text-[#3DA6AC] transition-colors"
              >
                Não tem uma conta? Cadastre-se
              </Link>
            </div>
          </div>
        </div>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </>
  );
} 