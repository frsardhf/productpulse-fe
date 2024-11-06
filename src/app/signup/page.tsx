'use client';
import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);

  const handleSignupSuccess = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-purple-600 hover:text-purple-300"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignupForm onSignupSuccess={handleSignupSuccess}/>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          By signing up, you agree to our{' '}
          <Dialog open={openTerms} onOpenChange={setOpenTerms}>
            <DialogTrigger className="font-medium text-purple-600 hover:text-purple-300">
              Terms of Service
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Terms of Service</DialogTitle>
                <DialogDescription>
                  Last updated: {new Date().toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">1. Acceptance of Terms</h3>
                  <p>
                    By accessing and using this website, you accept and agree to be bound by the terms
                    and provision of this agreement.
                  </p>

                  <h3 className="text-lg font-semibold">2. Use License</h3>
                  <p>
                    Permission is granted to temporarily download one copy of the materials (information
                    or software) on ProductPulse&apos;s website for personal, non-commercial transitory
                    viewing only.
                  </p>

                  <h3 className="text-lg font-semibold">3. Lorem Ipsum</h3>
                  <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et lectus ligula. 
                  Fusce ut commodo elit. Phasellus ultricies, nisl vel tempus facilisis, eros 
                  felis interdum enim, vel condimentum lacus risus eu lacus. Nulla eu consectetur 
                  dolor. Vivamus sed iaculis nunc. Vivamus laoreet lorem eu lectus rutrum finibus. 
                  Pellentesque facilisis ornare neque.
                  </p>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          {' '}and{' '}
          <Dialog open={openPrivacy} onOpenChange={setOpenPrivacy}>
            <DialogTrigger className="font-medium text-purple-600 hover:text-purple-300">
              Privacy Policy
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Privacy Policy</DialogTitle>
                <DialogDescription>
                  Last updated: {new Date().toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">1. Information We Collect</h3>
                  <p>
                    We collect information you provide directly to us when you create an account,
                    make a purchase, or communicate with us. This may include:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>Name and contact information</li>
                    <li>Payment information</li>
                    <li>Shipping address</li>
                    <li>Purchase history</li>
                  </ul>

                  <h3 className="text-lg font-semibold">2. How We Use Your Information</h3>
                  <p>
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>Process your orders and payments</li>
                    <li>Send you order confirmations and updates</li>
                    <li>Respond to your questions and requests</li>
                    <li>Improve our services</li>
                  </ul>

                  <h3 className="text-lg font-semibold">3. Lorem Ipsum</h3>
                  <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et lectus ligula. 
                  Fusce ut commodo elit. Phasellus ultricies, nisl vel tempus facilisis, eros 
                  felis interdum enim, vel condimentum lacus risus eu lacus. Nulla eu consectetur 
                  dolor. Vivamus sed iaculis nunc. Vivamus laoreet lorem eu lectus rutrum finibus. 
                  Pellentesque facilisis ornare neque.
                  </p>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;