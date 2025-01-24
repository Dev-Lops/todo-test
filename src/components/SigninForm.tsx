import { useForm, type SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

type SigninInput = {
  email: string;
  password: string;
};

export const SigninForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninInput>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit: SubmitHandler<SigninInput> = async (data) => {
    setIsLoading(true);
    setErrorMessage(null);

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    setIsLoading(false);

    if (result?.ok) {
      router.push(result.url || "/dashboard");
    } else {
      setErrorMessage(
        result?.error || "Falha no login. Verifique suas credenciais."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-[380px] gap-6"
    >
      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Email"
          className={`w-full px-3 py-4 rounded-lg placeholder:text-[#000] placeholder:text-[13px] font-poppins ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          {...register("email", {
            required: "O email é obrigatório.",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Insira um email válido.",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Senha */}
      <div>
        <input
          type="password"
          placeholder="Password"
          className={`w-full px-3 py-4 rounded-lg placeholder:text-[#000] placeholder:text-[13px] font-poppins ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          {...register("password", {
            required: "A senha é obrigatória.",
            minLength: {
              value: 6,
              message: "A senha deve ter pelo menos 6 caracteres.",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Mensagem de erro */}
      {errorMessage && (
        <p className="text-red-500 text-center mt-2">{errorMessage}</p>
      )}

      {/* Botão de Login */}
      <button
        type="submit"
        className={`w-full bg-[#50C2C9] text-white px-3 py-4 rounded-lg font-poppins hover:bg-[#4db3bd] transition-colors ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Login"}
      </button>
    </form>
  );
};
