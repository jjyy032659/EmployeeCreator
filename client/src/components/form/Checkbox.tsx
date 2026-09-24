import { useFormContext } from 'react-hook-form';

type CheckboxProps = {
  name: string;
  label: string;
};

function Checkbox({ name, label }: CheckboxProps) {
  const { register } = useFormContext();

  return (
    <label className="mt-3 flex items-center gap-3">
      <input type="checkbox" {...register(name)} className="h-4 w-4" />
      <span>{label}</span>
    </label>
  );
}

export default Checkbox;