import { useFormContext } from 'react-hook-form';

type Option = {
  value: string;
  label: string;
};

type RadioGroupProps = {
  name: string;
  legend: string;
  options: Option[];
};

const labelClass = 'block text-sm font-semibold text-gray-900';
const errorClass = 'mt-1 text-sm text-red-600';

function RadioGroup({ name, legend, options }: RadioGroupProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <fieldset>
      <legend className={labelClass}>{legend}</legend>
      <div className="mt-2 space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-3">
            <input
              type="radio"
              value={option.value}
              {...register(name)}
              className="h-4 w-4"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className={errorClass}>{error.message as string}</p>}
    </fieldset>
  );
}

export default RadioGroup;