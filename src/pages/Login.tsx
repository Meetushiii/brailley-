
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAudioContext } from '@/context/AudioContext';
import { useAuth } from '@/App';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { speak, playSound } = useAudioContext();
  const { login } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    // In a real app, you would handle login with backend
    console.log('Login data:', data);
    
    try {
      // Call the login function from the auth context to update authentication state
      login();
      
      // Play success sound and show toast notification
      playSound('success');
      toast({
        title: "Login successful!",
        description: "Welcome back to Braillely.",
      });
      
      speak("Login successful. Welcome back to Braillely.");
      
      // Navigate to the home page after successful login
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-100 p-4">
      <Card className="w-full max-w-md overflow-hidden border-none shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 to-cyan-400" />
        
        <CardHeader className="space-y-1 bg-white pb-4">
          <CardTitle className="text-2xl font-bold text-center text-gray-800 font-sans">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Sign in to continue to Braillely
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
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="Enter your password" 
                          {...field} 
                          className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 pl-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-teal-600 hover:text-teal-800" 
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot password?
                </Button>
              </div>
              
              <div className="pt-2 space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                >
                  <LogIn size={16} className="mr-2" />
                  Sign in
                </Button>
                
                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-teal-600 hover:text-teal-800 font-medium" 
                    onClick={() => navigate('/register')}
                  >
                    Register
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

export default Login;
