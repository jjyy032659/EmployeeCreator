import TextField from '../form/TextField';

function PersonalInfoFields() {
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Personal information</h2>

      <TextField name="firstName" label="First name" />
      <TextField name="middleName" label="Middle name (if applicable)" />
      <TextField name="lastName" label="Last name" />
    </section>
  );
}

export default PersonalInfoFields;