
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAudioContext } from '@/context/AudioContext';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
});

type FormValues = z.infer<typeof formSchema>;

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { speak, playSound } = useAudioContext();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Reset password for:', data.email);
      
      // Show success message
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions.",
      });
      
      playSound('success');
      speak("Password reset link sent to your email.");
      
      setIsSubmitting(false);
      
      // Navigate back to login
      setTimeout(() => navigate('/login'), 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-100 p-4">
      <Card className="w-full max-w-md overflow-hidden border-none shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 to-cyan-400" />
        
        <CardHeader className="space-y-1 bg-white pb-4">
          <CardTitle className="text-2xl font-bold text-center text-gray-800 font-sans">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        
        <CardContent className="bg-white pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          {...field} 
                          className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-2 space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
                
                <div className="text-center text-sm text-gray-600">
                  Remember your password?{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-teal-600 hover:text-teal-800 font-medium" 
                    onClick={() => navigate('/login')}
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
