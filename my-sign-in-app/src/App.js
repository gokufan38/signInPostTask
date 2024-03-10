import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm(); 
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); 
      return; 
    }

    try {
      const response = await axios.post('http://localhost:3001/signup', formData);
      console.log(response.data);
      alert("Thank you for signing up!");
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

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
  };

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
        <input type="password" name="password" value={formData.password} onChange={handleChange}/> 
        {errors.password && <div className="error-message">{errors.password}</div>}
      </div>

      <button type="submit">Sign Up</button>
    </form>
  );
}

function MyApp() {
  const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false); 
  

    
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:3001/users');
          setUsers(response.data);
        } catch (err) {
          console.error('Error fetching users:', err);
        }
      };
      fetchUsers(); 
    }, []);
  
    const handleDelete = async (userId) => {
      try {
        await axios.delete(`http://localhost:3001/users/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    };
  
    const handleView = (user) => {
      setSelectedUser(user);
    };
  
    const handleEdit = (user) => {
      setSelectedUser(user);
      setIsEditing(true); 
    };
  
    const handleEditSubmit = async (event) => {
      event.preventDefault();
  
      try {
        await axios.put(`http://localhost:3001/users/${selectedUser.id}`, selectedUser);
        const updatedUsers = users.map((user) =>
          user.id === selectedUser.id ? selectedUser : user
        );
        setUsers(updatedUsers);
        setIsEditing(false); 
      } catch (err) {
        console.error('Error updating user:', err);
      }
    };
  
    const handleEditChange = (event) => {
      setSelectedUser({
        ...selectedUser,
        [event.target.name]: event.target.value,
      });
    };
  
    return (
      <div>
        <h1>Hello World!</h1>
        <SignUpForm />
  
        <h2>Existing Users</h2>
        {users.map((user) => (
          <div key={user.id}> 
            <p>Email: {user.email}</p>
            <p>Username: {user.username}</p>
            <button onClick={() => handleView(user)}>View</button>
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </div>
        ))}
  
        {selectedUser && !isEditing && (
          <div>
            <h2>View User</h2>
            <p>Email: {selectedUser.email}</p>
            <p>Username: {selectedUser.username}</p> 
          </div>
        )}
  
        {isEditing && (
          <form onSubmit={handleEditSubmit}>
            <h2>Edit User</h2>
            <input 
              type="email" 
              name="email" 
              value={selectedUser.email} 
              onChange={handleEditChange} 
            />
            {/* ... other input fields for editing */}
            <button type="submit">Save Changes</button>
          </form>
        )}
      </div>
    );
  
  }
export default MyApp; 
