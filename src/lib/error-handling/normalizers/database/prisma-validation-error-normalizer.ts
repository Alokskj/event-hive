import { Prisma } from '@prisma/client';
import { ErrorCodeEnum } from '../../../../enums/error-code.enum';
import { HTTPSTATUS } from '../../../../config/http.config';
import { BaseErrorNormalizer } from '../base/base-error.normalize';
import { NormalizedError } from '../../interfaces/error.interfaces';

interface PrismaValidationDetails {
    field?: string;
    model?: string;
    operation?: string;
    expectedType?: string;
    receivedType?: string;
    missingFields?: string[];
    invalidFields?: string[];
    constraint?: string;
}

export class PrismaValidationErrorNormalizer extends BaseErrorNormalizer {
    canHandle(error: any): boolean {
        return error instanceof Prisma.PrismaClientValidationError;
    }

    normalize(error: Prisma.PrismaClientValidationError): NormalizedError {
        const validationDetails = this.extractValidationDetails(error.message);
        const userFriendlyMessage =
            this.generateUserFriendlyMessage(validationDetails);
        const baseDetails = this.extractErrorDetails(error);

        return this.createNormalizedError(
            HTTPSTATUS.BAD_REQUEST,
            userFriendlyMessage,
            true,
            ErrorCodeEnum.VALIDATION_ERROR,
            {
                ...baseDetails,
                errorType: 'PrismaClientValidationError',
                originalMessage: this.sanitizeMessage(error.message, 300),
                validationDetails,
                suggestion: this.generateSuggestion(validationDetails),
            },
            error.stack,
        );
    }

    private extractValidationDetails(message: string): PrismaValidationDetails {
        const details: PrismaValidationDetails = {};

        // Extract model name
        const modelMatch = message.match(/Argument `(\w+)` of type `(\w+)`/);
        if (modelMatch) {
            details.model = modelMatch[2];
        }

        // Extract operation type
        const operationMatch = message.match(/Invalid `prisma\.(\w+)\.(\w+)/);
        if (operationMatch) {
            details.model = operationMatch[1];
            details.operation = operationMatch[2];
        }

        // Extract field information
        const fieldMatch = message.match(/Argument `(\w+)`/);
        if (fieldMatch) {
            details.field = fieldMatch[1];
        }

        // Extract type information
        const typeMatch = message.match(
            /Expected (\w+(?:\[\])?), received (\w+(?:\[\])?)/,
        );
        if (typeMatch) {
            details.expectedType = typeMatch[1];
            details.receivedType = typeMatch[2];
        }

        // Extract missing required fields
        const missingFieldsMatch = message.match(/Argument `\w+` is missing\./);
        if (missingFieldsMatch) {
            const missingMatch = message.match(/Argument `(\w+)` is missing/);
            if (missingMatch) {
                details.missingFields = [missingMatch[1]];
            }
        }

        // Extract multiple missing fields
        const multipleMissingMatch = message.match(
            /Missing required arguments?: (.+)/,
        );
        if (multipleMissingMatch) {
            details.missingFields = multipleMissingMatch[1]
                .split(',')
                .map((field) => field.trim().replace(/`/g, ''));
        }

        // Extract invalid field names
        const invalidFieldMatch = message.match(/Unknown argument `(\w+)`/);
        if (invalidFieldMatch) {
            details.invalidFields = [invalidFieldMatch[1]];
        }

        // Extract constraint violations
        const constraintMatch = message.match(
            /Unique constraint failed on the fields?: \((.+)\)/,
        );
        if (constraintMatch) {
            details.constraint = constraintMatch[1];
        }

        return details;
    }

    private generateUserFriendlyMessage(
        details: PrismaValidationDetails,
    ): string {
        // Handle missing fields
        if (details.missingFields && details.missingFields.length > 0) {
            const fields = details.missingFields.join(', ');
            return `Missing required field${details.missingFields.length > 1 ? 's' : ''}: ${fields}`;
        }

        // Handle invalid fields
        if (details.invalidFields && details.invalidFields.length > 0) {
            const fields = details.invalidFields.join(', ');
            return `Invalid field${details.invalidFields.length > 1 ? 's' : ''}: ${fields}`;
        }

        // Handle type mismatches
        if (details.expectedType && details.receivedType) {
            const fieldInfo = details.field
                ? ` for field '${details.field}'`
                : '';
            return `Invalid data type${fieldInfo}. Expected ${details.expectedType}, but received ${details.receivedType}`;
        }

        // Handle constraint violations
        if (details.constraint) {
            return `Unique constraint violation: ${details.constraint} already exists`;
        }

        // Handle model/operation specific errors
        if (details.model && details.operation) {
            return `Invalid data provided for ${details.operation} operation on ${details.model}`;
        }

        // Fallback generic message
        return 'Invalid input data. Please check your request parameters and try again.';
    }

    private generateSuggestion(details: PrismaValidationDetails): string {
        // Specific suggestions based on error type
        if (details.missingFields && details.missingFields.length > 0) {
            return `Please provide values for the required field${details.missingFields.length > 1 ? 's' : ''}: ${details.missingFields.join(', ')}`;
        }

        if (details.invalidFields && details.invalidFields.length > 0) {
            return `Remove or correct the invalid field${details.invalidFields.length > 1 ? 's' : ''}: ${details.invalidFields.join(', ')}`;
        }

        if (details.expectedType && details.receivedType) {
            const fieldInfo = details.field ? ` for '${details.field}'` : '';
            return `Please provide a ${details.expectedType} value${fieldInfo} instead of ${details.receivedType}`;
        }

        if (details.constraint) {
            return `Please use a unique value for ${details.constraint} or update the existing record instead`;
        }

        if (details.model) {
            return `Please check the ${details.model} schema documentation and ensure all required fields are provided with correct data types`;
        }

        return 'Verify that all required fields are present and have the correct data types according to your schema';
    }

    protected sanitizeMessage(
        message: string,
        maxLength: number = 300,
    ): string {
        if (!message) return 'Validation error occurred';

        // Remove sensitive information patterns specific to Prisma validation errors
        const sanitized = message
            .replace(
                /password\s*[:=]\s*["'][^"']*["']/gi,
                'password: [REDACTED]',
            )
            .replace(/token\s*[:=]\s*["'][^"']*["']/gi, 'token: [REDACTED]')
            .replace(/secret\s*[:=]\s*["'][^"']*["']/gi, 'secret: [REDACTED]')
            .replace(/key\s*[:=]\s*["'][^"']*["']/gi, 'key: [REDACTED]')
            .replace(/email\s*[:=]\s*["'][^"']*["']/gi, 'email: [REDACTED]');

        // Use base class method as fallback
        return super.sanitizeMessage(sanitized, maxLength);
    }
}
