import { useFormContext } from 'react-hook-form';

type DateFieldProps = {
  name: string;
  label: string;
  disabled?: boolean;
};

const labelClass = 'block text-sm font-semibold text-gray-900';
const inputClass =
  'mt-1 w-full rounded border border-gray-400 px-3 py-2 ' +
  'focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand ' +
  'disabled:cursor-not-allowed disabled:bg-gray-100';
const errorClass = 'mt-1 text-sm text-red-600';

function DateField({ name, label, disabled = false }: DateFieldProps) {
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
      <input
        id={name}
        type="date"
        disabled={disabled}
        {...register(name)}
        className={inputClass}
      />
      {error && <p className={errorClass}>{error.message as string}</p>}
    </div>
  );
}

export default DateField;