
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, KeyRound, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Pre-defined credentials
const SETUP_USERNAME = 'pranjal';
const SETUP_PASSWORD = '15-11';
const SECRET_KEY = 'p';

export default function LoginScreen() {
    const { login } = useAuth();
    const [isFirstTime, setIsFirstTime] = useState(true); // Assume first time until checked
    const [isLoading, setIsLoading] = useState(true);
    
    // State for first-time setup
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // State for subsequent logins
    const [keyInput, setKeyInput] = useState('');

    const [error, setError] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        // This check determines which login screen to show.
        try {
            const isVerified = localStorage.getItem('study-buddy-device-verified');
            if (isVerified === 'true') {
                setIsFirstTime(false);
            } else {
                setIsFirstTime(true);
            }
        } catch (error) {
            console.error("Could not access local storage", error);
            setError("Local storage is disabled. Please enable it to use the app.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleFirstTimeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (username.toLowerCase() === SETUP_USERNAME && password === SETUP_PASSWORD) {
             try {
                localStorage.setItem('study-buddy-device-verified', 'true');
                toast({
                    title: `Welcome, ${username}!`,
                    description: "Your device is now verified. You'll use your secret key next time.",
                });
                login();
            } catch (error) {
                setError("Could not save settings. Please ensure local storage is enabled.");
            }
        } else {
            setError('Incorrect username or password.');
        }
    };

    const handleSubsequentLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (keyInput === SECRET_KEY) {
            toast({
              title: `Welcome back, ${SETUP_USERNAME}!`,
            });
            login();
        } else {
            setError('The key is incorrect. Try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
            <Card className="w-full max-w-sm animate-in fade-in-50 zoom-in-95 duration-500">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <GraduationCap className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="mt-4 text-2xl">
                        {isFirstTime ? 'Device Verification' : `Welcome Back, ${SETUP_USERNAME}`}
                    </CardTitle>
                    <CardDescription>
                        {isFirstTime ? 'Please enter your credentials to set up this device.' : 'Please enter your password to unlock.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isFirstTime ? (
                        <form onSubmit={handleFirstTimeSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                     <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                     <Input 
                                        id="username" 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)} 
                                        placeholder="e.g., pranjal"
                                        className="pl-9"
                                        required 
                                     />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                 <div className="relative">
                                     <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        id="password" 
                                        type="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="pl-9"
                                        required 
                                    />
                                 </div>
                            </div>
                             {error && <p className="text-sm text-destructive text-center">{error}</p>}
                             <Button type="submit" className="w-full">Verify & Continue</Button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubsequentLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="key-input">Password</Label>
                                 <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="key-input"
                                        type="password"
                                        value={keyInput}
                                        onChange={(e) => setKeyInput(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-9"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            {error && <p className="text-sm text-destructive text-center">{error}</p>}
                            <Button type="submit" className="w-full">Unlock</Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
