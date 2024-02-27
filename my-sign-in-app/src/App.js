import React, { useState } from 'react';

function SignUpForm() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({}); 

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
    setErrors({ ...errors, [event.target.name]: '' }); 
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log("Submit form data:", formData); 
      alert("Thank you for signing up!");
    }
  }

  const validateForm = () => {
    const errors = {};

    if (!formData.email || !/^.+@.+\..+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    } 
    if (!formData.username) {
      errors.username = "Username is required";
    }
    if (!formData.password || formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    return errors;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      <div>
        <label htmlFor='username'>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange}/>
        {errors.username && <div className="error-message">{errors.username}</div>}
      </div>

      <div>
        <label htmlFor='password'>Password:</label>
        <input type="text" name="password" value={formData.password} onChange={handleChange}/>
        {errors.password && <div className="error-message"> {errors.password}</div>}
      </div>

      {/* ... input fields for username and password */}
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default function MyApp() { 
  return (
    <div>
      <h1>Hello World!</h1>
      <SignUpForm />
    </div>
  );
}
