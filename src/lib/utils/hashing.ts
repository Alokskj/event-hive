import bcrypt from 'bcrypt';
import { HASH_SALT_ROUNDS } from '../../constant';

export const hashString = async (input: string) => {
    const hash = await bcrypt.hash(input, HASH_SALT_ROUNDS);
    return hash;
};

export const compareHash = async (input: string, hash: string) => {
    const isMatch = await bcrypt.compare(input, hash);
    return isMatch;
};

// Alias functions for authentication
export const hashPassword = hashString;
export const comparePassword = compareHash;
