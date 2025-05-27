import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Step3LocationInfo = ({ formData, setFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState({ countries: [], states: [], cities: [] });
  const [loading, setLoading] = useState({ countries: false, states: false, cities: false });

  const subscriptionOptions = ["Basic", "Pro", "Enterprise"];

  // Generic fetch function
  const fetchData = async (type, url) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      const res = await axios.get(url);
      setOptions(prev => ({ ...prev, [type]: res.data }));
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  // Remove spaces in URLs and update to match backend routes
useEffect(() => { 
  fetchData('countries', 'http://localhost:5000/api/countries'); 
}, [setFormData]);

// When country changes, fetch states and reset state/city
useEffect(() => {
  if (formData.country) {
    fetchData('states', `http://localhost:5000/api/states/${formData.country}`);
    setFormData(prev => ({ ...prev, state: '', city: '' }));
  }
}, [formData.country, setFormData]);

// When state changes, fetch cities and reset city
useEffect(() => {
  if (formData.state) {
    fetchData('cities', `http://localhost:5000/api/cities/${formData.state}`);
    setFormData(prev => ({ ...prev, city: '' }));
  }
}, [formData.state, setFormData]);

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.country) newErrors.country = 'Please select a country';
    if (!formData.state && options.states.length > 0) newErrors.state = 'Please select a state';
    if (!formData.city && options.cities.length > 0) newErrors.city = 'Please select a city';
    if (!formData.subscriptionPlan) newErrors.subscriptionPlan = 'Please select a subscription plan';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) nextStep();
  };

  const renderSelect = (name, label, list, disabled) => (
    <div className="form-group">
      <label htmlFor={name}>{label}*</label>
      <select
        id={name}
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        disabled={disabled}
        className={errors[name] ? 'error' : ''}
      >
        <option value="">Select {label}</option>
        {list.map((item, index) => {
          const itemValue = typeof item === 'object' ? (item._id || item.id || item.name) : item;
          const itemDisplay = typeof item === 'object' ? item.name : item;
          const itemKey = typeof item === 'object' ? (item._id || item.id || item.name || index) : item;
          
          return (
            <option key={itemKey} value={itemValue}>
              {itemDisplay}
            </option>
          );
        })}
      </select>
      {loading[name] && <span className="info-text">Loading {label.toLowerCase()}...</span>}
      {errors[name] && <span className="error-text">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="step-container">
      <h2>Location & Preferences</h2>
      <form onSubmit={handleSubmit}>
        {renderSelect('country', 'Country', options.countries, loading.countries)}
        {renderSelect('state', 'State', options.states, !formData.country || loading.states)}
        {renderSelect('city', 'City', options.cities, !formData.state || loading.cities)}

        <div className="form-group">
          <label>Subscription Plan*</label>
          <div className="radio-group">
            {subscriptionOptions.map(option => (
              <label key={option} className="radio-item">
                <input
                  type="radio"
                  name="subscriptionPlan"
                  value={option}
                  checked={formData.subscriptionPlan === option}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>
          {errors.subscriptionPlan && <span className="error-text">{errors.subscriptionPlan}</span>}
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="newsletter"
            name="newsletter"
            checked={formData.newsletter ?? true}
            onChange={handleChange}
          />
          <label htmlFor="newsletter">Subscribe to our newsletter</label>
        </div>

        <div className="button-group">
          <button type="button" onClick={prevStep} className="prev-button">Previous</button>
          <button type="submit" className="next-button">Next Step</button>
        </div>
      </form>
    </div>
  );
};

export default Step3LocationInfo;