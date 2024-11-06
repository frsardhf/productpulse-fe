'use client'
import React, { useEffect } from 'react';
import Button from "@/components/ui/button-old";
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HomePage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-b from-purple-50 to-white min-h-screen py-40">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Discover Amazing Products at<span className="text-purple-600"> Incredible Prices</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your one-stop destination for quality products and exceptional service.
              Join thousands of satisfied customers who trust us for their shopping needs.
            </p>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-lg text-lg font-semibold inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => router.push('/products')}
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>
    </div>
  );
};

export default HomePage;