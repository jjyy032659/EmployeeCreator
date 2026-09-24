import TextField from '../form/TextField';

function ContactFields() {
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Contact details</h2>

      <TextField name="email" label="Email address" type="email" />
      <TextField
        name="mobileNumber"
        label="Mobile number"
        hint="Must be an Australian number"
        placeholder="0412345678"
      />
      <TextField name="address" label="Residential address" />
    </section>
  );
}

export default ContactFields;