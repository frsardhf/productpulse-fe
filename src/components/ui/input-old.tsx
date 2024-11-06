import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Optional label for the input
  error?: string; // Optional error message
}

// Use forwardRef to allow refs to be passed to the input element
const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, ...props }, ref) => {
  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <input 
        ref={ref} // Forward the ref to the input element
        className={`input-field ${error ? 'input-error' : ''}`} 
        {...props} 
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
});

// Set a display name for debugging purposes
Input.displayName = 'Input';

export default Input;