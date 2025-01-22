import { useForm, type SubmitHandler } from "react-hook-form";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>();

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert('Register Success');
    } else {
      alert('Register Failed');
    }
  };

  return (
    <form className="flex flex-col w-[380px] gap-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Nome completo */}
      <div>
        <input
          type="text"
          placeholder="Enter your full name"
          className="w-full px-3 py-4 rounded-lg placeholder:text-[#000] placeholder:text-[13px] font-poppins"
          {...register('name', { required: "Name is required" })}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* E-mail */}
      <div>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-3 py-4 rounded-lg placeholder:text-[#000] placeholder:text-[13px] font-poppins"
          {...register('email', {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" }
          })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* Senha */}
      <div>
        <input
          type="password"
          placeholder="Enter password"
          className="w-full px-3 py-4 rounded-lg placeholder:text-[#000] placeholder:text-[13px] font-poppins"
          {...register('password', {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters long" }
          })}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {/* Confirmar senha */}
      <div>
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full px-3 py-4 rounded-lg placeholder:text-[#000] placeholder:text-[13px] font-poppins"
          {...register('confirmPassword', {
            required: "Confirm Password is required",
            validate: (value, context) => value === context.password || "Passwords do not match"
          })}
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
      </div>

      {/* Botão de registro */}
      <button
        type="submit"
        className="w-full bg-[#50C2C9] text-white px-3 py-4 rounded-lg font-poppins hover:bg-[#4db3bd] transition-colors"
      >
        Register
      </button>
    </form>
  );
};
