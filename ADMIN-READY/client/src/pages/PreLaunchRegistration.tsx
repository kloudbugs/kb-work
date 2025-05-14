import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Schema for pre-launch registration
const preLaunchRegistrationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  fullName: z.string().min(3, 'Please enter your full name'),
  reason: z.string().min(10, 'Please tell us why you want to join').max(500, 'Your message is too long'),
  phoneNumber: z.string().optional(),
});

type PreLaunchRegistrationFormData = z.infer<typeof preLaunchRegistrationSchema>;

const PreLaunchRegistration = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<PreLaunchRegistrationFormData>({
    resolver: zodResolver(preLaunchRegistrationSchema),
    defaultValues: {
      email: '',
      fullName: '',
      reason: '',
      phoneNumber: '',
    },
  });

  const onSubmit = async (data: PreLaunchRegistrationFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/pre-launch-register', data);
      
      if (response.data.success) {
        setIsSuccess(true);
        toast({
          title: "Registration Request Received",
          description: "Thank you for your interest! We'll notify you when we launch.",
          variant: "default",
        });
        form.reset();
      } else {
        toast({
          title: "Submission Error",
          description: response.data.message || "There was a problem submitting your request.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Submission Error",
        description: error.response?.data?.message || "There was a problem submitting your request.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-8 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Join Satoshi Beans Mining</CardTitle>
          <CardDescription className="text-center">
            Request early access to our AI-powered mining platform
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isSuccess ? (
            <div className="text-center space-y-4 py-6">
              <div className="text-6xl">✅</div>
              <h3 className="text-xl font-medium">Registration Request Received!</h3>
              <p className="text-muted-foreground">
                Thank you for your interest in Satoshi Beans Mining. We've received your registration request and will notify you when we launch or if you're selected for early access.
              </p>
              <Button 
                className="mt-4" 
                variant="outline" 
                onClick={() => setIsSuccess(false)}
              >
                Submit Another Request
              </Button>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  {...form.register('fullName')}
                />
                {form.formState.errors.fullName && (
                  <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...form.register('phoneNumber')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Why are you interested in joining?</Label>
                <Textarea
                  id="reason"
                  placeholder="Tell us about your interest in cryptocurrency mining and what you hope to achieve..."
                  rows={4}
                  {...form.register('reason')}
                />
                {form.formState.errors.reason && (
                  <p className="text-sm text-red-500">{form.formState.errors.reason.message}</p>
                )}
              </div>
            </form>
          )}
        </CardContent>
        
        {!isSuccess && (
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Registration Request"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default PreLaunchRegistration;