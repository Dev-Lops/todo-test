import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpData } from '../../schemas/auth.schema';
import { Form } from '../../components/ui/Form/Form';
import { FormField } from '../../components/ui/Form/FormField';
import { Button } from '../../components/ui/Button/Button';
import { Toast } from '../../components/ui/Toast/Toast';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { AuthService } from '../../services/authService';
import { useRouter } from 'next/router';

export default function SignUp() {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const router = useRouter();
  const authService = AuthService.getInstance();

  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (data: SignUpData) => {
    try {
      await authService.signUp(data);
      setToast({
        message: 'Conta criada com sucesso!',
        type: 'success'
      });
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Erro ao criar conta',
        type: 'error'
      });
      form.setValue('password', '');
    }
  };

  return (
    <>
      <Head>
        <title>Cadastro | Todo App</title>
      </Head>
      <div className="min-h-screen bg-[#F0F4F3] flex flex-col items-center justify-center mx-auto">
        <div className="w-full max-w-md p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-6">
              Criar Conta
            </h1>
            <Form form={form} onSubmit={handleSubmit}>
              <div className="space-y-4">
                <FormField
                  name="name"
                  label="Nome"
                  type="text"
                  placeholder="Seu nome"
                />
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
                  {form.formState.isSubmitting ? 'Criando conta...' : 'Criar conta'}
                </Button>
              </div>
            </Form>
            <div className="mt-4 text-center">
              <Link
                href="/signin"
                className="text-[#50C2C9] hover:text-[#3DA6AC] transition-colors"
              >
                Já tem uma conta? Faça login
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