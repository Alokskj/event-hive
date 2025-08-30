import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { useRegister } from '../hooks/useAuth';
import { RegisterRequest } from '../types';
import {
    registrationSchema,
    RegistrationFormData,
} from '@/lib/validations/auth';

export const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const registerMutation = useRegister();

    const form = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: RegistrationFormData) => {
        const registerData: RegisterRequest = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
        };
        registerMutation.mutate(registerData);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-lg shadow-none border-0 bg-transparent">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold">
                        Create an account
                    </CardTitle>
                    <CardDescription>
                        Join EventHive to explore and book local events in your
                        area
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    {...form.register('firstName')}
                                    className={
                                        form.formState.errors.firstName
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                {form.formState.errors.firstName && (
                                    <p className="text-sm text-red-500">
                                        {
                                            form.formState.errors.firstName
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    {...form.register('lastName')}
                                    className={
                                        form.formState.errors.lastName
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                {form.formState.errors.lastName && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                {...form.register('email')}
                                className={
                                    form.formState.errors.email
                                        ? 'border-red-500'
                                        : ''
                                }
                            />
                            {form.formState.errors.email && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a strong password"
                                    {...form.register('password')}
                                    className={
                                        form.formState.errors.password
                                            ? 'border-red-500 pr-10'
                                            : 'pr-10'
                                    }
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            {form.formState.errors.password && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Confirm your password"
                                    {...form.register('confirmPassword')}
                                    className={
                                        form.formState.errors.confirmPassword
                                            ? 'border-red-500 pr-10'
                                            : 'pr-10'
                                    }
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            {form.formState.errors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {
                                        form.formState.errors.confirmPassword
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create account'
                            )}
                        </Button>

                        <div className="text-center text-sm">
                            Already have an account?{' '}
                            <Link
                                to="/auth/login"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
