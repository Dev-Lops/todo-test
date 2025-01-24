import { useFormContext } from "react-hook-form";
import { Input } from "../Input/Input";

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
}

export function FormField({
  name,
  label,
  type = "text",
  placeholder,
}: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1">
      <Input
        label={label}
        type={type}
        error={error}
        placeholder={placeholder}
        {...register(name)}
      />
    </div>
  );
}
