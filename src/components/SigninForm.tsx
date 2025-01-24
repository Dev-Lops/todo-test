"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../contexts/AuthContext";
import { signInSchema, type SignInData } from "@/schemas/auth/signInSchema";
import { toast } from "react-toastify";

export default function SignIn() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInData) => {
    setIsLoading(true);
    try {
      await signIn(data); // Delegamos o erro para o `AuthContext`
    } catch {
      // Aqui não é necessário lançar um erro ou exibir outro toast,
      // porque o `AuthContext` já cuidou disso.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold text-center text-teal-600">Entrar</h1>
        <input
          type="email"
          placeholder="Digite seu email"
          {...register("email")}
          className="w-full px-4 py-2 border rounded-lg"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Digite sua senha"
          {...register("password")}
          className="w-full px-4 py-2 border rounded-lg"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 bg-teal-600 text-white rounded-lg ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
