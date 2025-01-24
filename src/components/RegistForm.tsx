import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterInput>();
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    setIsLoading(true);
    setServerMessage(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setServerMessage("Registration successful!");
      } else {
        const errorData = await res.json();
        setServerMessage(errorData.message || "Registration failed!");
      }
    } catch (error) {
      setServerMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Watch para verificar o valor do campo "password" para validar "confirmPassword"
  const password = watch("password");

  return (
    <form
      className="flex flex-col w-[380px] gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Nome completo */}
      <div>
        <input
          type="text"
          placeholder="Enter your full name"
          className={`w-full px-3 py-4 rounded-lg placeholder:text-[#000] placeholder:text-[13px] font-poppins ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* E-mail */}
      <div>
        <input
          type="email"
          placeholder="Enter your email"
          className={`w-full px-3 py-4 rounded-lg placeholder:text-[#000] placeholder:text-[13px] font-poppins ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Invalid email format",
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
          placeholder="Enter password"
          className={`w-full px-3 py-4 rounded-lg placeholder:text-[#000] placeholder:text-[13px] font-poppins ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirmar senha */}
      <div>
        <input
          type="password"
          placeholder="Confirm password"
          className={`w-full px-3 py-4 rounded-lg placeholder:text-[#000] placeholder:text-[13px] font-poppins ${
            errors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
          {...register("confirmPassword", {
            required: "Confirm Password is required",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Mensagem do servidor */}
      {serverMessage && (
        <p
          className={`text-center text-sm mt-2 ${
            serverMessage.includes("success")
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {serverMessage}
        </p>
      )}

      {/* Botão de registro */}
      <button
        type="submit"
        className={`w-full bg-[#50C2C9] text-white px-3 py-4 rounded-lg font-poppins hover:bg-[#4db3bd] transition-colors ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};
