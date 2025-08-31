import { Button } from '../ui/button';
import { Link } from 'react-router';
import { useAuth } from '@/modules/auth';

const Navbar = () => {
    const { isAuthenticated } = useAuth();

    return (
        <section className="container flex justify-between items-center px-4 h-20 bg-transparent">
            <div className="flex items-center gap-6">
                <h1 className="text-3xl font-bold tracking-tight">
                    🌃Event Hive
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
