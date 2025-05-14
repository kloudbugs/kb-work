import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Form,
  FormControl,
  FormField,
  FormItem
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

export function Newsletter() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { toast } = useToast();
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest('POST', '/api/subscribe', data);
      const result = await response.json();
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter!",
        variant: "default",
      });
      form.reset();
    },
    onError: (error: any) => {
      if (error.message && error.message.includes("409")) {
        toast({
          title: "Already subscribed",
          description: "This email is already subscribed to our newsletter.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Subscription failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  return (
    <section className="py-16 md:py-20 bg-primary/10" id="newsletter">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4 text-dark">
            Stay Updated with MoonMeme
          </h2>
          <p className="text-lightgray mb-8">
            Subscribe to our newsletter for the latest news, updates, and exclusive offers
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input 
                        placeholder="Your email address" 
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="bg-primary text-white px-6 py-3 rounded-lg font-heading font-semibold hover:bg-opacity-90 transition"
                disabled={isPending}
              >
                {isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </Form>
          
          <p className="text-xs text-lightgray mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from MoonMeme.
          </p>
        </div>
      </div>
    </section>
  );
}
