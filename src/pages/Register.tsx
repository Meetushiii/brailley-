import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAudioContext } from '@/context/AudioContext';
import { Eye, EyeOff, ArrowRight, Phone, Send, Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'details' | 'email-verification' | 'phone-verification'>('details');
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { speak, playSound } = useAudioContext();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const sendEmailOTP = async () => {
    const email = form.getValues('email');
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter your email address first.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In real application, this would call an API to send OTP
    setTimeout(() => {
      toast({
        title: "Email OTP Sent!",
        description: `Verification code sent to ${email}`,
      });
      
      playSound('notification');
      setStep('email-verification');
      setIsSubmitting(false);
    }, 1000);
  };

  const sendPhoneOTP = async () => {
    const phone = form.getValues('phone');
    if (!phone || phone.length < 10) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid phone number first.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In real application, this would call an API to send OTP
    setTimeout(() => {
      toast({
        title: "Phone OTP Sent!",
        description: `Verification code sent to ${phone}`,
      });
      
      playSound('notification');
      setStep('phone-verification');
      setIsSubmitting(false);
    }, 1000);
  };

  const verifyEmailOTP = () => {
    if (emailOtp.length === 6) {
      // Mock successful verification
      toast({
        title: "Email verified!",
        description: "Your email has been verified successfully.",
      });
      playSound('success');
      
      // Move to phone verification
      sendPhoneOTP();
    } else {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit verification code.",
      });
      playSound('error');
    }
  };

  const verifyPhoneOTP = () => {
    if (phoneOtp.length === 6) {
      // Mock successful verification
      toast({
        title: "Phone verified!",
        description: "Your phone number has been verified successfully.",
      });
      playSound('success');
      
      // Register the user
      onSubmit(form.getValues());
    } else {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit verification code.",
      });
      playSound('error');
    }
  };

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // In a real app, you would handle registration with backend
    setTimeout(() => {
      console.log('Registration data:', data);
      playSound('success');
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
      });
      speak("Registration successful. Your account has been created.");
      navigate('/');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-100 p-4">
      <Card className="w-full max-w-md overflow-hidden border-none shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 to-cyan-400" />
        
        <CardHeader className="space-y-1 bg-white pb-4">
          <CardTitle className="text-2xl font-bold text-center text-gray-800 font-sans">
            {step === 'details' ? 'Create Your Account' : 
             step === 'email-verification' ? 'Verify Your Email' : 
             'Verify Your Phone'}
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            {step === 'details' ? 'Join our community of Braille learners' : 
             step === 'email-verification' ? 'Enter the 6-digit code sent to your email' :
             'Enter the 6-digit code sent to your phone'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="bg-white pt-2">
          {step === 'details' ? (
            <Form {...form}>
              <form className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your name" 
                          {...field} 
                          className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input 
                            type="tel" 
                            placeholder="Enter your phone number" 
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
                            placeholder="Create a password" 
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
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input 
                            type={showConfirmPassword ? 'text' : 'password'} 
                            placeholder="Confirm your password" 
                            {...field} 
                            className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 pl-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <Button 
                    type="button" 
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                    onClick={sendEmailOTP}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Continue"}
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </form>
            </Form>
          ) : step === 'email-verification' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm text-gray-700 mb-2">Enter the 6-digit verification code sent to your email:</div>
                <div className="flex justify-center">
                  <InputOTP 
                    maxLength={6} 
                    value={emailOtp} 
                    onChange={(value) => setEmailOtp(value)}
                    className="gap-2"
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 6 }, (_, i) => (
                        <InputOTPSlot 
                          key={i} 
                          index={i} 
                          className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="link" 
                  className="text-teal-600 hover:text-teal-800"
                  onClick={sendEmailOTP}
                  disabled={isSubmitting}
                >
                  Didn't receive a code? Resend
                </Button>
              </div>
              
              <div className="space-y-2">
                <Button 
                  type="button" 
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                  onClick={verifyEmailOTP}
                  disabled={emailOtp.length !== 6 || isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Verify Email"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
                  onClick={() => setStep('details')}
                  disabled={isSubmitting}
                >
                  Back to Registration
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm text-gray-700 mb-2">Enter the 6-digit verification code sent to your phone:</div>
                <div className="flex justify-center">
                  <InputOTP 
                    maxLength={6} 
                    value={phoneOtp} 
                    onChange={(value) => setPhoneOtp(value)}
                    className="gap-2"
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 6 }, (_, i) => (
                        <InputOTPSlot 
                          key={i} 
                          index={i} 
                          className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="link" 
                  className="text-teal-600 hover:text-teal-800"
                  onClick={sendPhoneOTP}
                  disabled={isSubmitting}
                >
                  Didn't receive a code? Resend
                </Button>
              </div>
              
              <div className="space-y-2">
                <Button 
                  type="button" 
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                  onClick={verifyPhoneOTP}
                  disabled={phoneOtp.length !== 6 || isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Verify & Register"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
                  onClick={() => setStep('email-verification')}
                  disabled={isSubmitting}
                >
                  Back to Email Verification
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-teal-600 hover:text-teal-800 font-medium" 
              onClick={() => navigate('/login')}
            >
              Log in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
