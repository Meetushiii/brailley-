
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAudioContext } from '@/context/AudioContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';
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
    playSound('success');
    toast({
      title: "Login successful!",
      description: "Welcome back to BrailleMathVerse.",
    });
    speak("Login successful. Welcome back to Braille Math Verse.");
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-braille-blue mb-6">Log In to BrailleMathVerse</h1>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Welcome back to BrailleMathVerse</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
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
                      <div className="relative">
                        <Input 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="Enter your password" 
                          {...field} 
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
                  className="p-0 h-auto" 
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot password?
                </Button>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Button type="submit" className="w-full">
                  <LogIn size={16} className="mr-2" />
                  Log in
                </Button>
                
                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto" 
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
