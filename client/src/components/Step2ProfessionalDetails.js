import React, { useState } from 'react';

const Step2ProfessionalInfo = ({ formData, setFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});
  const professionOptions = ["Student", "Developer", "Entrepreneur"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.profession?.trim()) {
      newErrors.profession = 'Please select a profession';
    }

    if (formData.profession === 'Entrepreneur' && !formData.companyName?.trim()) {
      newErrors.companyName = 'Company name is required for entrepreneurs';
    }

    if (!formData.addressLine1?.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) nextStep();
  };

  return (
    <div className="step-container">
      <h2>Professional Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="profession">Profession*</label>
          <select
            id="profession"
            name="profession"
            value={formData.profession || ''}
            onChange={handleChange}
            className={errors.profession ? 'error' : ''}
          >
            <option value="" disabled>Select Profession</option>
            {professionOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.profession && <span className="error-text">{errors.profession}</span>}
        </div>

        {formData.profession === 'Entrepreneur' && (
          <div className="company-details">
            <h3>Company Details</h3>
            <div className="form-group">
              <label htmlFor="companyName">Company Name*</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
                className={errors.companyName ? 'error' : ''}
              />
              {errors.companyName && <span className="error-text">{errors.companyName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="companySize">Company Size</label>
              <select
                id="companySize"
                name="companySize"
                value={formData.companySize || ''}
                onChange={handleChange}
              >
                <option value="">Select Company Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="industry">Industry</label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={formData.industry || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="addressLine1">Address Line 1*</label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={formData.addressLine1 || ''}
            onChange={handleChange}
            className={errors.addressLine1 ? 'error' : ''}
          />
          {errors.addressLine1 && <span className="error-text">{errors.addressLine1}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="addressLine2">Address Line 2</label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={formData.addressLine2 || ''}
            onChange={handleChange}
          />
        </div>

        <div className="button-group">
          <button type="button" onClick={prevStep} className="prev-button">Previous</button>
          <button type="submit" className="next-button">Next Step</button>
        </div>
      </form>
    </div>
  );
};

export default Step2ProfessionalInfo;
