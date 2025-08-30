import { Search } from 'lucide-react';
import { Input } from './input';

type SearchInputProps = {
    placeholder?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder }) => {
    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder={placeholder || 'Search...'}
                value={value}
                onChange={onChange}
                className="max-w-sm pl-8"
            />
        </div>
    );
};

export default SearchInput;
