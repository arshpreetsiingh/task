import React, { useState } from 'react';
import axios from 'axios';

const ProfileSummary = ({ formData, prevStep, resetForm }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const formatDate = date =>
        date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
    const renderPhoto = () => {
        if (!formData.profilePhoto) return null;

        try {
            const src = typeof formData.profilePhoto === 'string'
                ? formData.profilePhoto
                : URL.createObjectURL(formData.profilePhoto);

            return (
                <div className="photo-container">
                    <img
                        src={src}
                        alt="Profile"
                        className="photo-preview"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'default-placeholder.png'; // Fallback image
                        }}
                    />
                </div>
            );
        } catch (error) {
            console.error('Error rendering profile photo:', error);
            return <div className="photo-error">Unable to display photo</div>;
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError('');
        try {
            const profileData = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'profilePhoto') {

                    profileData.append(key, value || '');
                }
            });


            if (formData.profilePhoto) profileData.append('profilePhoto', formData.profilePhoto);


            await axios.post('http://localhost:5000/api/profile', profileData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSubmitSuccess(true);
            setTimeout(resetForm, 3000);
        } catch (err) {
            console.error('Submit error:', err);
            setSubmitError(err.response?.data?.message || 'Error submitting profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="step-container success-container">
                <h2>Profile Updated Successfully!</h2>
                <p>Your profile has been saved to our database.</p>
                <button onClick={resetForm} className="start-over-button">Start Over</button>
            </div>
        );
    }

    const SummaryItem = ({ label, value }) => (
        <p><strong>{label}:</strong> {value || 'Not provided'}</p>
    );

    return (
        <div className="step-container summary-container">
            <h2>Review Your Information</h2>
            {submitError && <div className="error-message"><p>{submitError}</p></div>}

            <div className="summary-content">
                <div className="summary-section">
                    <h3>Personal Information</h3>
                    {renderPhoto()}
                    <div className="summary-details">
                        <SummaryItem label="Full Name" value={formData.fullName} />
                        <SummaryItem label="Username" value={formData.username} />
                        <SummaryItem label="Date of Birth" value={formatDate(formData.dateOfBirth)} />
                        <SummaryItem label="Gender" value={
                            formData.gender === 'Other' && formData.customGender
                                ? `Other (${formData.customGender})`
                                : formData.gender
                        } />
                        <SummaryItem label="Password" value={formData.newPassword ? '••••••••' : 'Not changed'} />
                    </div>
                </div>

                <div className="summary-section">
                    <h3>Professional Details</h3>
                    <div className="summary-details">
                        <SummaryItem label="Profession" value={formData.profession} />
                        {formData.profession === 'Entrepreneur' && (
                            <>
                                <SummaryItem label="Company Name" value={formData.companyName} />
                                <SummaryItem label="Company Size" value={formData.companySize} />
                                <SummaryItem label="Industry" value={formData.industry} />
                            </>
                        )}
                        <SummaryItem label="Address" value={formData.addressLine1} />
                        {formData.addressLine2 && <SummaryItem label="Address Line 2" value={formData.addressLine2} />}
                    </div>
                </div>

                <div className="summary-section">
                    <h3>Location & Preferences</h3>
                    <div className="summary-details">
                        {/* Use the direct country value instead of countryName */}
                        <SummaryItem label="Country" value={formData.country} />
                        <SummaryItem label="State" value={formData.state} />
                        <SummaryItem label="City" value={formData.city} />
                        <SummaryItem label="Subscription Plan" value={formData.subscriptionPlan} />
                        <SummaryItem label="Newsletter" value={formData.newsletter === false ? 'No' : 'Yes'} />
                    </div>
                </div>
            </div>

            <div className="button-group">
                <button onClick={prevStep} className="prev-button" disabled={isSubmitting}>Previous</button>
                <button onClick={handleSubmit} className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Profile'}
                </button>
            </div>
        </div>
    );
};

export default ProfileSummary;