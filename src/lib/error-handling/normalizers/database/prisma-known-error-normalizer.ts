import { Prisma } from '@prisma/client';
import { PRISMA_ERROR_MAPPINGS } from '../../constants/error-mappings';
import { ErrorCodeEnum } from '../../../../enums/error-code.enum';
import { HTTPSTATUS } from '../../../../config/http.config';
import { BaseErrorNormalizer } from '../base/base-error.normalize';
import { NormalizedError } from '../../interfaces/error.interfaces';

interface PrismaErrorContext {
    table?: string;
    column?: string;
    constraint?: string;
    modelName?: string;
    relationName?: string;
    fieldName?: string;
    targetFields?: string[];
    conflictingValue?: any;
}

export class PrismaKnownErrorNormalizer extends BaseErrorNormalizer {
    canHandle(error: any): boolean {
        return error instanceof Prisma.PrismaClientKnownRequestError;
    }

    normalize(error: Prisma.PrismaClientKnownRequestError): NormalizedError {
        const mapping = PRISMA_ERROR_MAPPINGS.get(error.code);
        const errorContext = this.extractErrorContext(error);
        const userMessage = this.buildUserFriendlyMessage(error, errorContext);
        const baseDetails = this.extractErrorDetails(error);

        if (mapping) {
            return this.createNormalizedError(
                mapping.statusCode,
                userMessage,
                mapping.isOperational,
                mapping.errorCode,
                {
                    ...baseDetails,
                    errorType: 'PrismaClientKnownRequestError',
                    code: error.code,
                    context: errorContext,
                    meta: this.sanitizeMeta(error.meta),
                    suggestion: this.generateSuggestion(
                        error.code,
                        errorContext,
                    ),
                    clientVersion: error.clientVersion,
                },
                error.stack,
            );
        }

        // Fallback for unmapped error codes
        return this.createNormalizedError(
            HTTPSTATUS.INTERNAL_SERVER_ERROR,
            'An unexpected database error occurred',
            false,
            ErrorCodeEnum.DATABASE_ERROR,
            {
                ...baseDetails,
                errorType: 'PrismaClientKnownRequestError',
                code: error.code,
                context: errorContext,
                meta: this.sanitizeMeta(error.meta),
                originalMessage: this.sanitizeMessage(error.message, 200),
                suggestion: 'Please contact support if this error persists',
            },
            error.stack,
        );
    }

    private extractErrorContext(
        error: Prisma.PrismaClientKnownRequestError,
    ): PrismaErrorContext {
        const context: Record<string, any> = {};
        const meta = error.meta;

        if (!meta) return context;

        // Extract common fields
        if (meta.target) {
            context.targetFields = Array.isArray(meta.target)
                ? meta.target
                : [meta.target];
        }

        if (meta.table_name) context.table = meta.table_name;
        if (meta.column_name) context.column = meta.column_name;
        if (meta.constraint) context.constraint = meta.constraint;
        if (meta.model_name) context.modelName = meta.model_name;
        if (meta.relation_name) context.relationName = meta.relation_name;
        if (meta.field_name) context.fieldName = meta.field_name;

        // Extract model names for relations
        if (meta.model_a_name) context.modelName = meta.model_a_name;

        return context;
    }

    private buildUserFriendlyMessage(
        error: Prisma.PrismaClientKnownRequestError,
        context: PrismaErrorContext,
    ): string {
        const mapping = PRISMA_ERROR_MAPPINGS.get(error.code);
        const baseMessage =
            mapping?.messageTemplate || 'Database operation failed';

        switch (error.code) {
            case 'P2002': {
                // Unique constraint violation
                const fields =
                    context.targetFields?.join(', ') || 'unique field';
                return `A record with this ${fields} already exists. Please use different values.`;
            }

            case 'P2003': {
                // Foreign key constraint violation
                const fieldName = context.fieldName || 'referenced field';
                return `The ${fieldName} references a record that doesn't exist. Please provide a valid reference.`;
            }

            case 'P2004': {
                // Constraint violation
                const constraint = context.constraint || 'database constraint';
                return `Operation violates ${constraint}. Please check your data and try again.`;
            }

            case 'P2014': {
                // Relation violation
                const relation = context.relationName || 'relationship';
                return `Cannot modify record due to existing ${relation}. Please remove related records first.`;
            }

            case 'P2015': {
                // Related record not found
                return `Cannot find the related record. Please ensure all referenced data exists.`;
            }

            case 'P2016': {
                // Query interpretation error
                return `Invalid query parameters. Please check your request format.`;
            }

            case 'P2017': {
                // Records not connected
                const relationField = context.relationName || 'relation';
                return `The records are not connected through ${relationField}. Please verify the relationship.`;
            }

            case 'P2018': {
                // Required connected records not found
                return `Required connected records not found. Please ensure all dependencies exist.`;
            }

            case 'P2019': {
                // Input error
                return `Invalid input provided. Please check your data format and try again.`;
            }

            case 'P2020': {
                // Value out of range
                const column = context.column || 'field';
                return `Value for ${column} is out of acceptable range. Please provide a valid value.`;
            }

            case 'P2021': {
                // Table doesn't exist
                const table = context.table || 'table';
                return `The ${table} doesn't exist in the database. Please check your request.`;
            }

            case 'P2022': {
                // Column doesn't exist
                const col = context.column || 'column';
                return `The ${col} doesn't exist. Please check your field names.`;
            }

            case 'P2023': {
                // Inconsistent column data
                return `Inconsistent column data detected. Please verify your data integrity.`;
            }

            case 'P2024': {
                // Connection timeout
                return `Database connection timeout. Please try again in a moment.`;
            }

            case 'P2025': {
                // Record not found
                const model = context.modelName || 'record';
                return `The requested ${model} was not found. It may have been deleted or doesn't exist.`;
            }

            case 'P2026': {
                // Unsupported feature
                return `This operation is not supported by the current database configuration.`;
            }

            case 'P2027': {
                // Database errors during execution
                return `Database encountered errors during execution. Please try again.`;
            }

            default: {
                return baseMessage;
            }
        }
    }

    private generateSuggestion(
        code: string,
        context: PrismaErrorContext,
    ): string {
        switch (code) {
            case 'P2002': {
                const fields = context.targetFields?.join(', ') || 'the field';
                return `Try using different values for ${fields}, or update the existing record instead of creating a new one.`;
            }

            case 'P2003': {
                const field = context.fieldName || 'the referenced field';
                return `Ensure that the value for ${field} exists in the related table, or create the referenced record first.`;
            }

            case 'P2014':
                return 'Delete or update the related records first, then retry the operation.';

            case 'P2025': {
                const model = context.modelName || 'the record';
                return `Verify that ${model} exists and you have the correct identifier. Check if it was recently deleted.`;
            }

            case 'P2016':
                return 'Review your query parameters and ensure they match the expected format and data types.';

            case 'P2020': {
                const column = context.column || 'the field';
                return `Check the acceptable range for ${column} and provide a value within those limits.`;
            }

            case 'P2024':
                return 'The database may be experiencing high load. Wait a moment and retry the operation.';

            default:
                return 'Review your request parameters and ensure all required data is provided correctly.';
        }
    }

    protected sanitizeMeta(meta: any): any {
        if (!meta) return undefined;

        const sanitized = { ...meta };

        // Remove potentially sensitive or verbose fields
        const fieldsToRemove = [
            'cause',
            'details',
            'database_error',
            'raw_query',
        ];
        fieldsToRemove.forEach((field) => delete sanitized[field]);

        // Sanitize target array if it contains sensitive field names
        if (sanitized.target && Array.isArray(sanitized.target)) {
            sanitized.target = sanitized.target.map((field: string) =>
                this.sanitizeFieldName(field),
            );
        } else if (typeof sanitized.target === 'string') {
            sanitized.target = this.sanitizeFieldName(sanitized.target);
        }

        return Object.keys(sanitized).length > 0 ? sanitized : undefined;
    }

    private sanitizeFieldName(fieldName: string): string {
        // Don't expose sensitive field names in error responses
        const sensitiveFields = ['password', 'token', 'secret', 'key', 'hash'];
        const lowerField = fieldName.toLowerCase();

        if (
            sensitiveFields.some((sensitive) => lowerField.includes(sensitive))
        ) {
            return '[SENSITIVE_FIELD]';
        }

        return fieldName;
    }
}
