import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckCircle, Loader2 } from "lucide-react";
import WebsiteLayout from "./WebsiteLayout";

const trialSignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  organization: z.string().optional(),
  reason: z.string().min(20, { message: "Please provide at least 20 characters explaining why you'd like to join" }),
});

type TrialSignupFormValues = z.infer<typeof trialSignupSchema>;

export default function TrialSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TrialSignupFormValues>({
    resolver: zodResolver(trialSignupSchema),
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      reason: "",
    },
  });

  const onSubmit = async (values: TrialSignupFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch("/api/trial/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit application");
      }
      
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WebsiteLayout>
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-xl">
            {isSubmitted ? (
              <div className="text-center py-10">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Application Received!</h2>
                <p className="text-gray-300 mb-6">
                  Thank you for your interest in joining the Blockchain Justice Movement. We've received your application and will review it shortly.
                </p>
                <p className="text-gray-300 mb-4">
                  If approved, you'll receive a verification email with instructions to access your 24-hour free trial. 
                </p>
                <p className="text-gray-300 mb-4">
                  During your trial, you'll be able to cash out 25% of your mining earnings after sharing our platform on social media.
                </p>
                <p className="text-gray-300 mb-8">
                  This sharing requirement helps spread our movement while allowing you to experience real value before committing to a subscription.
                </p>
                <Button 
                  onClick={() => window.location.href = '/'} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Return to Homepage
                </Button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-500" style={{ 
                  textShadow: '0 0 20px rgba(148, 85, 255, 0.8)',
                  fontFamily: "'Orbitron', sans-serif" 
                }}>
                  FREE TRIAL APPLICATION
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 mx-auto rounded-full opacity-60 animate-pulse mb-6"></div>
                <p className="text-gray-300 mb-6 text-center">
                  Complete this form to request access to our 24-hour free trial. We'll review your application and send you access details if approved. Once approved, you'll be able to cash out 25% of your earnings after sharing our platform on social media!
                </p>
                
                {error && (
                  <div className="bg-red-900/50 border border-red-800 text-red-200 px-4 py-3 rounded mb-6">
                    {error}
                  </div>
                )}
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Your Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name" 
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white"
                            />
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
                          <FormLabel className="text-white">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your email address" 
                              type="email"
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Organization (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Company or organization name" 
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Why would you like to join the Blockchain Justice Movement?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please explain your interest and how you'd like to contribute to our mission..." 
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Submitting...
                          </span>
                        ) : (
                          "Submit Application"
                        )}
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-400 text-center pt-2">
                      By submitting this form, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </form>
                </Form>
              </>
            )}
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
}