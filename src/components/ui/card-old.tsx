import React from 'react';

interface CardProps {
  children: React.ReactNode; 
  footer?: React.ReactNode; 
  className?: string; 
}

const Card: React.FC<CardProps> = ({ children, footer, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      <div className="flex-1">{children}</div>
      {footer && <div className="mt-4 border-t pt-2">{footer}</div>}
    </div>
  );
};

export default Card;