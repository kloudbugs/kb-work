import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Link } from 'wouter';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { ReferralSource } from '../../shared/schema';

// Registration form schema
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Please enter a valid email address'),
  age: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(18, 'You must be at least 18 years old').max(120)
  ),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State/Province is required').max(100),
  country: z.string().min(1, 'Country is required').max(100),
  socialMediaLink: z.string().min(5, 'Social media profile is required for verification').max(200),
  referralSource: z.nativeEnum(ReferralSource),
  referralDetails: z.string().max(500).optional(),
  joinReason: z.string().min(10, 'Please tell us why you want to join').max(1000),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms and conditions' }),
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Registration = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      city: '',
      state: '',
      country: '',
      socialMediaLink: '',
      referralSource: undefined,
      referralDetails: '',
      joinReason: '',
      agreedToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/auth/register', data);
      
      if (response.data.success) {
        setRegistrationSuccess(true);
        toast({
          title: "Registration submitted successfully",
          description: "Your application is pending approval by our administrators.",
          variant: "default",
        });
        form.reset();
      } else {
        toast({
          title: "Registration Error",
          description: response.data.message || "There was a problem with your registration.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Error",
        description: error.response?.data?.message || "There was a problem with your registration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Apply to Join Satoshi Beans Mining</CardTitle>
            <CardDescription className="text-center">
              Complete this form to request access to our platform. All applications are reviewed by our administrators.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {registrationSuccess ? (
              <div className="text-center space-y-4 py-6">
                <div className="text-6xl">✅</div>
                <h3 className="text-xl font-medium">Application Submitted!</h3>
                <p className="text-muted-foreground">
                  Thank you for your interest in Satoshi Beans Mining. We've received your application and will review it shortly.
                  If approved, you'll receive your login credentials via email.
                </p>
                <Button 
                  className="mt-4" 
                  variant="outline" 
                  onClick={() => setRegistrationSuccess(false)}
                >
                  Submit Another Application
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Information */}
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormDescription>
                            This will be your login username if approved
                          </FormDescription>
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
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            We'll send your account details to this email
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" min="18" max="120" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="San Francisco" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="California" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="United States" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="socialMediaLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Media Profile Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://twitter.com/yourusername" {...field} />
                        </FormControl>
                        <FormDescription>
                          Required for verification. We'll use this to verify your identity.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="referralSource"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How did you hear about us?</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={ReferralSource.FRIEND}>Friend or colleague</SelectItem>
                              <SelectItem value={ReferralSource.SOCIAL_MEDIA}>Social media</SelectItem>
                              <SelectItem value={ReferralSource.SEARCH_ENGINE}>Search engine</SelectItem>
                              <SelectItem value={ReferralSource.ADVERTISEMENT}>Advertisement</SelectItem>
                              <SelectItem value={ReferralSource.CONFERENCE}>Conference or event</SelectItem>
                              <SelectItem value={ReferralSource.BLOG}>Blog or article</SelectItem>
                              <SelectItem value={ReferralSource.OTHER}>Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="referralDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Details (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Please specify..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="joinReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Why would you like to join our platform?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your interest in cryptocurrency mining and what you hope to achieve..." 
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          This helps us understand your goals and expectations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="agreedToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Terms and Conditions
                          </FormLabel>
                          <FormDescription>
                            I agree to the <Link href="/terms" className="text-primary underline">terms of service</Link> and <Link href="/privacy" className="text-primary underline">privacy policy</Link>, including the processing of my personal data. I understand that if approved, my account is subject to platform rules and can be terminated for violations.
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting Application..." : "Submit Application"}
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Already have an account? <Link href="/login" className="text-primary underline">Log in</Link>
                  </p>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registration;