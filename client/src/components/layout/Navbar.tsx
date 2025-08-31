import { Button } from '../ui/button';
import { Link } from 'react-router';
import { useAuth } from '@/modules/auth';
import React, { useEffect, useState } from 'react';

const Navbar = () => {
    const { isAuthenticated } = useAuth();

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <section
            className={`container flex justify-between items-center px-4 h-20 bg-transparent transition-all duration-700 ease-out will-change-transform ${
                mounted
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-4'
            }`}
        >
            <div className="flex items-center gap-6">
                <h1 className="text-3xl font-bold tracking-tight playfair-display">
                    Event Hive
                </h1>
            </div>
            {isAuthenticated ? (
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link to="/dashboard">Dashboard</Link>
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link to="/auth/register">Sign Up</Link>
                    </Button>
                    <Button asChild>
                        <Link to="/auth/login">Login</Link>
                    </Button>
                </div>
            )}
        </section>
    );
};

export default Navbar;
