import React, { useState } from 'react';
import Step1PersonalInfo from './components/Step1PersonalInfo';
import Step2ProfessionalInfo from './components/Step2ProfessionalDetails';
import Step3LocationInfo from './components/Step3';
import ProfileSummary from './components/ProfileSummary';
import './styles/styles.css';

const steps = [
  { component: Step1PersonalInfo, label: 'Personal Info' },
  { component: Step2ProfessionalInfo, label: 'Professional' },
  { component: Step3LocationInfo, label: 'Preferences' },
  { component: ProfileSummary, label: 'Summary' },
];

const App = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ newsletter: true });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const resetForm = () => {
    setFormData({ newsletter: true });
    setStep(0);
  };

  const StepComponent = steps[step].component;
  const progress = (step / (steps.length - 1)) * 100;

  return (
    <div className="app-container">
      <div className="form-container">
        <div className="company-header">
        <img 
          src="./unnamed.jpg" 
          alt="Frequent Research Logo" 
          className="company-logo"
        />
        <h3 className="company-name">Frequent Research Fieldwork Solutions Pvt. Ltd</h3>
      </div>
        <div className="form-progress">
          <div className="progress-bar">
            <div className="progress-value" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-steps">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`step-indicator ${step >= idx ? 'active' : ''}`}
              >
                {idx === steps.length - 1 ? '✓' : idx + 1}
              </div>
            ))}
          </div>
          <div className="progress-labels">
            {steps.map(({ label }, idx) => (
              <div key={idx} className="step-label">{label}</div>
            ))}
          </div>
        </div>

        <StepComponent
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          resetForm={resetForm}
        />
      </div>
    </div>
  );
};

export default App;
