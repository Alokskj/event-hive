import { format } from 'date-fns';

export const formatDate = (date: Date | string): string => {
    const formattedDate = format(new Date(date), 'dd MMM yy');
    return formattedDate;
};
