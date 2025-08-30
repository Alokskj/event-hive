import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { InputHTMLAttributes, useState } from 'react';

const PasswordInput = ({
    showIcon = true,
    ...field
}: InputHTMLAttributes<HTMLInputElement> & { showIcon?: boolean }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative">
            {showIcon && (
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            )}
            <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={"pr-10" + (showIcon ? ' pl-10' : '')}
                autoComplete="current-password"
                {...field}
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={field.disabled}
            >
                {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                )}
            </Button>
        </div>
    );
};

export default PasswordInput;
