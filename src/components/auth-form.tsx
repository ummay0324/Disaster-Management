'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { HeartHandshake, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { UserRole, User } from '@/lib/types';
import { useFirebaseApp, useUser } from '@/firebase';
import { 
  initiateEmailSignIn, 
  initiateEmailSignUp,
} from '@/firebase/non-blocking-login';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc, getFirestore, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
  role: z.enum(['victim', 'volunteer', 'admin'], {
    required_error: 'You need to select a role.',
  }),
});

interface AuthFormProps {
  isLoginPage?: boolean;
}

export function AuthForm({ isLoginPage = false }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const { user: currentUser, isUserLoading } = useUser();
  const firestore = getFirestore(app);
  
  const getUserRole = async (uid: string): Promise<UserRole> => {
      const adminDoc = await getDoc(doc(firestore, "admins", uid));
      if (adminDoc.exists()) return 'admin';
      
      const volunteerDoc = await getDoc(doc(firestore, "volunteers", uid));
      if (volunteerDoc.exists()) return 'volunteer';
      
      return 'victim';
  };

  // Redirect logged-in users
  useEffect(() => {
    if (!isUserLoading && currentUser) {
       const redirect = async () => {
         const role = await getUserRole(currentUser.uid);
         router.push(`/${role}/dashboard`);
       }
       redirect();
    }
  }, [currentUser, isUserLoading, router]);


  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', role: 'victim' },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    initiateEmailSignIn(auth, values.email, values.password);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            unsubscribe();
            const role = await getUserRole(user.uid);
            toast({
                title: 'Login Successful',
                description: `Redirecting to your ${role} dashboard...`,
            });
            router.push(`/${role}/dashboard`);
        }
    });
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    
    initiateEmailSignUp(auth, values.email, values.password);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            unsubscribe();
            const { role, name, email } = values;
            
            let collectionPath: string;
            let userProfileData: Partial<User>;

            if(role === 'victim') {
                collectionPath = 'victims';
                userProfileData = { id: user.uid, name, email, phoneNumber: user.phoneNumber || '', location: '', role: 'victim' };
            } else if (role === 'volunteer') {
                collectionPath = 'volunteers';
                userProfileData = { id: user.uid, name, email, phoneNumber: user.phoneNumber || '', availability: true, role: 'volunteer' };
            } else { // admin
                collectionPath = 'admins';
                userProfileData = { id: user.uid, name, email, role: 'admin' };
            }

            const userDocRef = doc(firestore, collectionPath, user.uid);
            setDocumentNonBlocking(userDocRef, userProfileData, { merge: true });

            toast({
                title: 'Signup Successful',
                description: `Welcome, ${values.name}! Redirecting to your ${values.role} dashboard...`,
            });
            router.push(`/${values.role}/dashboard`);
        }
    });

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
       <Card className="w-full max-w-md mx-auto shadow-2xl">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                <HeartHandshake className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">DisasterAid</h1>
            </div>
          <CardTitle className="text-2xl font-headline">Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={isLoginPage ? "signin" : "signup"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(handleLogin)}
                  className="space-y-6 mt-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="user@example.com"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="signup">
              <Form {...signupForm}>
                <form
                  onSubmit={signupForm.handleSubmit(handleSignup)}
                  className="space-y-6 mt-4"
                >
                  <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="user@example.com"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>I am a...</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            disabled={isLoading}
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="victim" />
                              </FormControl>
                              <FormLabel className="font-normal">Victim</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="volunteer" />
                              </FormControl>
                              <FormLabel className="font-normal">Volunteer</FormLabel>
                            </FormItem>
                             <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="admin" />
                              </FormControl>
                              <FormLabel className="font-normal">Admin / NGO</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                     {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
