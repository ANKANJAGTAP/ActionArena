import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    city: "",
    gender: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError(new Error('No token found. Please log in.'));
      setLoading(false);
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      setError(new Error('Invalid token.'));
      setLoading(false);
      return;
    }

    fetch('http://localhost:5000/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        return response.json();
      })
      .then(data => {
        setUser(data);
        setFormData(data);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const navigate = useNavigate();

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    console.log(token);
    try {
      const response = await fetch('http://localhost:5000/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Error updating profile');
      }
      const updatedUser = await response.json();
      setUser(updatedUser);
      setFormData(updatedUser);
      setEditing(false);
      toast.success('Profile updated successfully');
      localStorage.removeItem('token');  // Clear token
        navigate('/login');

    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer />
      <div className="max-w-lg w-full bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Profile</h2>

        <div className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              disabled={!editing}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full p-3 border rounded-lg bg-gray-100"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              disabled={!editing}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              disabled={!editing}
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-700 font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              disabled={!editing}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              disabled={!editing}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            {editing ? (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition"
                onClick={handleSave}
              >
                Save
              </button>
            ) : (
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md transition"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
