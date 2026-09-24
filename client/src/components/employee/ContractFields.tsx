import { useFormContext } from 'react-hook-form';

import Checkbox from '../form/Checkbox';
import DateField from '../form/DateField';
import RadioGroup from '../form/RadioGroup';
import TextField from '../form/TextField';

function ContractFields() {
  const { watch } = useFormContext();
  const isOngoing = watch('ongoing');

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Contract details</h2>

      <TextField name="position" label="Position" placeholder="Mid Developer" />
      <TextField name="department" label="Department" placeholder="Technology" />

      <RadioGroup
        name="contractType"
        legend="What is contract type?"
        options={[
          { value: 'PERMANENT', label: 'Permanent' },
          { value: 'CONTRACT', label: 'Contract' },
        ]}
      />

      <DateField name="startDate" label="Start date" />

      <div>
        <DateField name="finishDate" label="Finish date" disabled={isOngoing} />
        <Checkbox name="ongoing" label="On going" />
      </div>

      <RadioGroup
        name="employmentBasis"
        legend="Is this on a full-time or part-time basis?"
        options={[
          { value: 'FULL_TIME', label: 'Full-time' },
          { value: 'PART_TIME', label: 'Part-time' },
        ]}
      />

      <TextField name="hoursPerWeek" label="Hours per week" type="number" />
    </section>
  );
}

export default ContractFields;