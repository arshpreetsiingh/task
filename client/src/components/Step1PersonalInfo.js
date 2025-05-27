import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Step1PersonalInfo = ({ formData, setFormData, nextStep }) => {
  const [errors, setErrors] = useState({});
  const [isChecking, setIsChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const genderOptions = ['Male', 'Female', 'Other'];
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const today = new Date().toISOString().split('T')[0];

  // Generate preview URL when file is selected
  useEffect(() => {
    if (formData.profilePhoto && formData.profilePhoto instanceof File) {
      const objectUrl = URL.createObjectURL(formData.profilePhoto);
      setPhotoPreview(objectUrl);

      // Clean up URL when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof formData.profilePhoto === 'string' && formData.profilePhoto) {
      setPhotoPreview(formData.profilePhoto);
    }
  }, [formData.profilePhoto]);

  const handleChange = ({ target: { name, value, type, files } }) => {
    if (type === 'file') {
      // Handle file input separately
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'username' && value.length >= 4) {
      setIsChecking(true);
      const timer = setTimeout(() => checkUsernameAvailability(value), 500);
      return () => clearTimeout(timer);
    }

    if (name === 'newPassword') calculatePasswordStrength(value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          profilePhoto: 'Please select an image file (JPEG, PNG, or GIF)'
        }));
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profilePhoto: 'Image size should be less than 5MB'
        }));
        return;
      }

      // Clear error and set file to form data
      setErrors(prev => ({ ...prev, profilePhoto: '' }));
      setFormData(prev => ({ ...prev, profilePhoto: file }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, profilePhoto: null }));
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const { data } = await axios.get(`https://task-dd4s.onrender.com/api/check-username?username=${username}`);
      setUsernameAvailable(data.available);
      if (!data.available) setErrors(prev => ({ ...prev, username: 'Username is already taken' }));
    } catch {
      setErrors(prev => ({ ...prev, username: 'Error checking availability' }));
    } finally {
      setIsChecking(false);
    }
  };

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const e = {};
    const { fullName, username, gender, customGender, dateOfBirth, currentPassword, newPassword } = formData;

    if (!fullName) e.fullName = 'Full name is required';
    if (!username) e.username = 'Username is required';
    else if (username.length < 4 || username.length > 20 || /\s/.test(username)) e.username = 'Invalid username';
    else if (!usernameAvailable) e.username = 'Username is already taken';

    if (!dateOfBirth) e.dateOfBirth = 'Date of birth is required';
    if (!gender) e.gender = 'Gender is required';
    if (gender === 'Other' && !customGender) e.customGender = 'Please specify gender';

    if (newPassword) {
      if (!currentPassword) e.currentPassword = 'Current password required';
      if (newPassword.length < 8) e.newPassword = 'Min 8 characters';
      if (!/[0-9]/.test(newPassword)) e.newPassword = 'At least one number';
      if (!/[!@#$%^&*]/.test(newPassword)) e.newPassword = 'At least one special character';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) nextStep();
  };

  return (
    <div className="step-container">
      {/* Company Header */}
      
      
      <h2>Step 1: Personal Information</h2>
      <form onSubmit={handleSubmit}>
        {/* Photo Upload Section */}
        <div className="photo-upload-section">
          <div 
            className={`photo-upload ${photoPreview ? 'has-photo' : ''}`}
            onClick={triggerFileInput}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Profile Preview" className="photo-preview" />
            ) : (
              <div className="upload-placeholder">
                <i className="upload-icon">📷</i>
                <span>Upload Photo</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            id="profilePhoto"
            name="profilePhoto"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          
          {photoPreview && (
            <button 
              type="button" 
              className="remove-photo-btn"
              onClick={removePhoto}
            >
              Remove Photo
            </button>
          )}
          {errors.profilePhoto && <span className="error-text">{errors.profilePhoto}</span>}
        </div>

        {/* Full Name */}
        <InputField label="Full Name*" name="fullName" value={formData.fullName} error={errors.fullName} onChange={handleChange} />

        {/* Username */}
        <InputField label="Username*" name="username" value={formData.username} error={errors.username} onChange={handleChange} />
        {isChecking && <span>Checking availability...</span>}
        {!isChecking && usernameAvailable && formData.username && <span className="success-text">✓ Available</span>}

        {/* Date of Birth */}
        <InputField type="date" label="Date of Birth*" name="dateOfBirth" max={today} value={formData.dateOfBirth} error={errors.dateOfBirth} onChange={handleChange} />

        {/* Gender */}
        <div className="form-group">
          <label>Gender*</label>
          <select name="gender" value={formData.gender || ''} onChange={handleChange}>
            <option value="">Select</option>
            {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          {errors.gender && <span className="error-text">{errors.gender}</span>}
        </div>

        {/* Custom Gender */}
        {formData.gender === 'Other' && (
          <InputField label="Specify Gender" name="customGender" value={formData.customGender} error={errors.customGender} onChange={handleChange} />
        )}

        {/* Password Update */}
        <h3>Update Password (Optional)</h3>
        <InputField type="password" label="Current Password" name="currentPassword" value={formData.currentPassword} error={errors.currentPassword} onChange={handleChange} />
        <InputField type="password" label="New Password" name="newPassword" value={formData.newPassword} error={errors.newPassword} onChange={handleChange} />

        {formData.newPassword && (
          <div className="password-strength">
            <span>Strength:</span>
            <div className="strength-bar" style={{ width: `${25 * passwordStrength}%`, background: ['#ccc', 'red', 'orange', 'yellowgreen', 'green'][passwordStrength] }} />
            <span className="strength-text">
              {['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'][passwordStrength]}
            </span>
          </div>
        )}

        <button type="submit">Next</button>
      </form>
    </div>
  );
};

const InputField = ({ type = "text", label, name, value, onChange, error, ...rest }) => (
  <div className="form-group">
    <label>{label}</label>
    <input type={type} name={name} value={value || ''} onChange={onChange} {...rest} />
    {error && <span className="error-text">{error}</span>}
  </div>
);

export default Step1PersonalInfo;