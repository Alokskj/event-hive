import { Button } from '../ui/button';
import { Link } from 'react-router';
import { useAuth, useLogout } from '@/modules/auth';

const Navbar = () => {
    const { user, isAuthenticated } = useAuth();
    const {mutateAsync: logout, isPending} = useLogout()

    return (
        <section className="container flex justify-between items-center px-4 h-20 ">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    🌃Event Hive
                </h1>
            </div>
            {isAuthenticated ? (
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link to="/profile">My Events</Link>
                    </Button>
                    <Button onClick={() => logout()} disabled={isPending}>
                       {isPending ? 'Logging out...' : 'Logout'}
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
