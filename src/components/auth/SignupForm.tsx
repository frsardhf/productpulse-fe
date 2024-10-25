import { useState } from 'react';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import api from '@/lib/axios';
import { useAuth } from '@/hooks/useAuth';

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name is required and must be at least 2 characters long." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

interface SignupFormProps {
  onSignupSuccess: () => void;
}

export default function SignupForm({ onSignupSuccess }: SignupFormProps) {
  const [error, setError] = useState('');
  const { setAuth } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    console.log("Form submitted with data:", data);
    try {
      const requestData = { ...data, role: 'USER' };
      const response = await api.post('/users/signup', requestData);
      const { token, user } = response.data;
      console.log("Signup successful, user data:", user);
      setAuth(user, token, 'USER');
      onSignupSuccess(); // Call the prop function to redirect
    } catch (error) {
      if ((error as AxiosError).response?.status === 409) {
        setError('Email already exists');
      } else {
        setError('An error occurred during signup');
      }
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Reset the error state when the email field changes
    setError('');
    // Call the register function to update the value
    register('email').onChange(event);
  };

  const renderInput = (name: keyof z.infer<typeof signupSchema>, type: string, placeholder: string, label: string) => (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Input
        {...register(name)}
        id={name}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onChange={name === 'email' ? handleEmailChange : undefined}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {renderInput('name', 'text', 'Enter your name', 'Name')}
      {renderInput('email', 'email', 'Enter your email', 'Email')}
      {renderInput('password', 'password', 'Choose a password', 'Password')}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
      >
        Create Account
      </Button>
    </form>
  );
}