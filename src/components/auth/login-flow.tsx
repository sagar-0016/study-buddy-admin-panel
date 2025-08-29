
"use client";

import { useState, useEffect } from 'react';
import VerifyDeviceScreen from './verify-device';
import UnlockScreen from './unlock-screen';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function LoginFlow() {
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { login } = useAuth();

    useEffect(() => {
        try {
            const storedVerification = localStorage.getItem('study-buddy-device-verified');
            if (storedVerification === 'true') {
                setIsVerified(true);
            }
        } catch (error) {
            console.error("Could not access local storage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleDeviceVerified = () => {
        setIsVerified(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
            {isVerified ? (
                <UnlockScreen onUnlock={login} />
            ) : (
                <VerifyDeviceScreen onVerified={handleDeviceVerified} />
            )}
        </div>
    );
}
