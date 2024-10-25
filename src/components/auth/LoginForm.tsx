import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import api from '@/lib/axios';
import { AxiosError } from 'axios';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setError('');
    console.log("Form submitted with data:", data);
    try {
      const response = await api.post('/auth/login', data);
      const { access_token, user } = response.data;

      console.log("User with data:", user)
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      onLoginSuccess();
    } catch (error) {
      if ((error as AxiosError).response?.status === 401) {
        setError('Invalid email or password');
      } else if ((error as AxiosError).response?.status === 400) {
        setError('An unexpected error occurred. Please try again.');
      } else {
        setError('A network error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>, 
    fieldName: keyof z.infer<typeof loginSchema>
  ) => {
    setError('');
    register(fieldName).onChange(event);
  };

  const renderInput = (
    name: keyof z.infer<typeof loginSchema>, 
    type: string, 
    placeholder: string,
    label: string
  ) => (
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
        onChange={(event) => handleFieldChange(event, name)}
        disabled={isLoading}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {renderInput('email', 'email', 'Enter your email', 'Email')}
      {renderInput('password', 'password', 'Enter your password', 'Password')}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}