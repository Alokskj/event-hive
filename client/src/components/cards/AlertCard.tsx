import { Alert, AlertDescription } from '../ui/alert';

interface AlertCardProps {
    errorMessage: string | null | undefined;
}

const AlertCard = ({ errorMessage }: AlertCardProps) => {
    if (!errorMessage) {
        return null; // Return null if no error message is provided
    }
    return (
        <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
    );
};

export default AlertCard;
