import { useFormContext } from 'react-hook-form';

type TextFieldProps = {
  name: string;
  label: string;
  hint?: string;
  type?: 'text' | 'email' | 'date' | 'number';
  placeholder?: string;
};

const labelClass = 'block text-sm font-semibold text-gray-900';
const inputClass =
  'mt-1 w-full rounded border border-gray-400 px-3 py-2 ' +
  'focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand ' +
  'disabled:cursor-not-allowed disabled:bg-gray-100';
const errorClass = 'mt-1 text-sm text-red-600';

function TextField({ name, label, hint, type = 'text', placeholder }: TextFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      {hint && <p className="mb-1 text-sm text-gray-500">{hint}</p>}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, type === 'number' ? { valueAsNumber: true } : {})}
        className={inputClass}
      />
      {error && <p className={errorClass}>{error.message as string}</p>}
    </div>
  );
}

export default TextField;