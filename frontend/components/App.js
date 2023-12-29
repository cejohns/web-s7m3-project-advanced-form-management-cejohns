import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';

const e = {
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti, or pizza',
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
};

const initialFormState = {
  username: '',
  favLanguage: '',
  favFood: '',
  agreement: false,
};

const schema = Yup.object().shape({
  username: Yup.string()
    .required(e.usernameRequired)
    .min(3, e.usernameMin)
    .max(20, e.usernameMax),
  favLanguage: Yup.string().required(e.favLanguageRequired).oneOf(['javascript', 'rust'], e.favLanguageOptions),
  favFood: Yup.string().required(e.favFoodRequired).oneOf(['broccoli', 'spaghetti', 'pizza'], e.favFoodOptions),
  agreement: Yup.boolean().oneOf([true], e.agreementOptions),
});

export default function App() {
  const [form, setForm] = useState(initialFormState);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      setValidationErrors({});
    } catch (error) {
      const errors = error.inner.reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      setValidationErrors(errors);
    }
  };

  useEffect(() => {
    validateForm();
  }, [form]);

  const onChange = (evt) => {
    const { name, value, type, checked } = evt.target;
    const updatedForm = type === 'checkbox' ? { ...form, [name]: checked } : { ...form, [name]: value };
    setForm(updatedForm);
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate server request
      // Replace the following with an actual API call to submit the form data
      // For demonstration purposes, it just shows a success message after 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setValidationErrors({});
      setForm(initialFormState);
      alert('Success! Welcome, new user!');
    } catch (error) {
      alert('Sorry! Username is taken');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Type Username"
            value={form.username}
            onChange={onChange}
          />
          <div className="validation">{validationErrors.username}</div>
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input
                type="radio"
                name="favLanguage"
                value="javascript"
                checked={form.favLanguage === 'javascript'}
                onChange={onChange}
              />
              JavaScript
            </label>
            <label>
              <input
                type="radio"
                name="favLanguage"
                value="rust"
                checked={form.favLanguage === 'rust'}
                onChange={onChange}
              />
              Rust
            </label>
          </fieldset>
          <div className="validation">{validationErrors.favLanguage}</div>
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" value={form.favFood} onChange={onChange}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          <div className="validation">{validationErrors.favFood}</div>
        </div>

        <div className="inputGroup">
          <label>
            <input
              id="agreement"
              type="checkbox"
              name="agreement"
              checked={form.agreement}
              onChange={onChange}
            />
            Agree to our terms
          </label>
          <div className="validation">{validationErrors.agreement}</div>
        </div>

        <div>
          <button type="submit" disabled={Object.keys(validationErrors).length > 0 || isSubmitting}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
