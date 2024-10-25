import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'; // Optional variant for styling
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  const baseStyle = 'px-4 py-2 rounded focus:outline-none';
  const variantStyle = variant === 'primary' 
    ? 'bg-blue-500 text-white hover:bg-blue-600' 
    : 'bg-gray-300 text-black hover:bg-gray-400';

  return (
    <button className={`${baseStyle} ${variantStyle}`} {...props}>
      {children}
    </button>
  );
};

export default Button;