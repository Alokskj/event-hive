import jwt from 'jsonwebtoken';
import { Response } from 'express';
import _config from '../../config/_config';
import { JWT_EXPIRATION, JWT_TOKEN_NAME } from '../../constant';
import { getEnv } from './get-env';

// Token types
export type TokenType = 'access' | 'refresh' | 'email' | 'password-reset';

// New token payload interface for auth
export interface TokenPayload {
    userId: string;
    email: string;
    role?: string;
    type?: TokenType;
}

/**
 * Generate a JWT token
 */
export function generateToken(
    payload: TokenPayload,
    type: TokenType = 'access',
    expiresIn?: string,
): string {
    const secret = getTokenSecret(type);
    const defaultExpiry = getDefaultExpiry(type);

    return jwt.sign({ ...payload, type }, secret, {
        expiresIn: expiresIn || defaultExpiry,
        issuer: 'event-hive',
        audience: 'event-hive-users',
    });
}

/**
 * Verify a JWT token
 */
export function verifyToken(
    token: string,
    expectedType?: TokenType,
): TokenPayload {
    try {
        // Try different secrets based on the expected type or all types
        const typesToTry = expectedType
            ? [expectedType]
            : (['access', 'refresh', 'email', 'password-reset'] as TokenType[]);

        for (const type of typesToTry) {
            try {
                const secret = getTokenSecret(type);
                const decoded = jwt.verify(token, secret) as TokenPayload;

                // If expectedType is provided, verify it matches
                if (expectedType && decoded.type !== expectedType) {
                    continue;
                }

                return decoded;
            } catch (error) {
                // Try next type
                console.error('Token verification error:', error);
                continue;
            }
        }

        throw new Error('Invalid token');
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

/**
 * Get the appropriate secret for token type
 */
function getTokenSecret(type: TokenType): string {
    switch (type) {
        case 'access':
            return _config.jwtAccessSecret || _config.jwtSecret;
        case 'refresh':
            return _config.jwtRefreshSecret || _config.jwtSecret;
        case 'email':
            return _config.jwtEmailSecret || _config.jwtSecret;
        case 'password-reset':
            return _config.jwtResetSecret || _config.jwtSecret;
        default:
            return _config.jwtAccessSecret || _config.jwtSecret;
    }
}

/**
 * Get default expiry for token type
 */
function getDefaultExpiry(type: TokenType): string {
    switch (type) {
        case 'access':
            return '15m';
        case 'refresh':
            return '7d';
        case 'email':
            return '24h';
        case 'password-reset':
            return '1h';
        default:
            return '15m';
    }
}

/**
 * Decode token without verification (for debugging)
 */
export function decodeToken(token: string): TokenPayload | null {
    try {
        return jwt.decode(token) as TokenPayload;
    } catch (error) {
        return null;
    }
}
