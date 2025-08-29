
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, KeyRound, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SETUP_USERNAME = 'sagar';
const SETUP_PASSWORD = '16-01';

export default function VerifyDeviceScreen({ onVerified }: { onVerified: () => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { toast } = useToast();

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
                onVerified(); // Signal success to the parent component
            } catch (error) {
                setError("Could not save settings. Please ensure local storage is enabled.");
            }
        } else {
            setError('Incorrect username or password.');
        }
    };

    return (
        <Card className="w-full max-w-sm animate-in fade-in-50 zoom-in-95 duration-500">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <GraduationCap className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="mt-4 text-2xl">Device Verification</CardTitle>
                <CardDescription>Please enter your credentials to set up this device.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleFirstTimeSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                id="username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                placeholder="e.g., sagar"
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
            </CardContent>
        </Card>
    );
}
