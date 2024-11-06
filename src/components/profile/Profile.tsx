'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from '@/lib/axios';
import { useAuth } from '@/contexts/auth-context';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User } from '@/types/auth';

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ErrorResponse {
  message: string;
}

const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS = 1;

const Profile: React.FC = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<ProfileFormValues | null>(null);
  const [requestCount, setRequestCount] = useState<number>(0);
  const [lastRequestTime, setLastRequestTime] = useState<number>(Date.now());

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const getAuthUserString = useCallback(() => {
    return user;
  }, [user]);

  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return token;
  }, []);

  const checkRateLimit = () => {
    const now = Date.now();
    if (now - lastRequestTime > RATE_LIMIT_WINDOW) {
      setRequestCount(1);
      setLastRequestTime(now);
      return true;
    }
    if (requestCount >= MAX_REQUESTS) {
      return false;
    }
    setRequestCount(prev => prev + 1);
    return true;
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login?returnUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    const user = getAuthUserString();
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        password: '',
      });
    }
    setIsLoading(false);
  }, [router, getAuthToken, getAuthUserString, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    const user = getAuthUserString();
    const hasEmailChanged = data.email !== user?.email;
    const hasPasswordChanged = data.password && data.password.length > 0;

    if (hasEmailChanged || hasPasswordChanged) {
      setPendingChanges(data);
      setShowConfirmDialog(true);
      return;
    }

    await updateProfile(data);
  };

  const updateProfile = async (data: ProfileFormValues) => {
    if (!checkRateLimit()) {
      setError("Too many requests. Please try again later.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSaving(true);
    
    const currentUser = getAuthUserString();
    
    if (!currentUser) {
      setError("No user found. Please log in again.");
      setIsSaving(false);
      router.push('/login');
      return;
    }

    const originalData = { ...currentUser };

    try {
      const updatedUser: User = {
        id: currentUser .id,        
        role: currentUser.role,    
        name: data.name,           
        email: data.email,         
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      const response = await api.put(`/users/${currentUser?.id}`, {
        name: data.name,
        email: data.email,
        ...(data.password && { password: data.password }),
      },{
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
      });

      if (response.status === 200) {
        setSuccess('Profile updated successfully!');
        form.reset(data);
      }
    } catch (err) {
      localStorage.setItem('user', JSON.stringify(originalData));
      setUser(originalData as User);

      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message ?? 
        'An error occurred while updating the profile.';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
      setShowConfirmDialog(false);
      setPendingChanges(null);
    }
  };

  const handleReset = () => {
    const user = getAuthUserString();
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        password: '',
      });
    }
    setError(null);
    setSuccess(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Update your personal information and account settings
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Leave blank to keep current password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSaving}
              >
                {isSaving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                )}
                {isSaving ? "Saving..." : "Update Profile"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to make sensitive changes to your profile
              {pendingChanges?.email !== form.getValues().email && " (email)"}
              {pendingChanges?.password && " (password)"}
              . Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingChanges && updateProfile(pendingChanges)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;