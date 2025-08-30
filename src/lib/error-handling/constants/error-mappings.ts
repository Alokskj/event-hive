import { ErrorCodeEnum } from '../../../enums/error-code.enum';
import { HTTPSTATUS } from '../../../config/http.config';

export const PRISMA_ERROR_MAPPINGS = new Map([
    // Connection and Engine Errors (P1xxx)
    [
        'P1001',
        {
            statusCode: HTTPSTATUS.SERVICE_UNAVAILABLE,
            messageTemplate: 'Database connection failed',
            errorCode: ErrorCodeEnum.DATABASE_CONNECTION_ERROR,
            isOperational: true,
        },
    ],
    [
        'P1002',
        {
            statusCode: HTTPSTATUS.SERVICE_UNAVAILABLE,
            messageTemplate: 'Database connection timed out',
            errorCode: ErrorCodeEnum.DATABASE_CONNECTION_ERROR,
            isOperational: true,
        },
    ],
    [
        'P1003',
        {
            statusCode: HTTPSTATUS.NOT_FOUND,
            messageTemplate: 'Database file not found',
            errorCode: ErrorCodeEnum.DATABASE_ERROR,
            isOperational: true,
        },
    ],
    [
        'P1008',
        {
            statusCode: HTTPSTATUS.REQUEST_TIMEOUT,
            messageTemplate: 'Database operation timed out',
            errorCode: ErrorCodeEnum.DATABASE_TIMEOUT,
            isOperational: true,
        },
    ],
    [
        'P1009',
        {
            statusCode: HTTPSTATUS.CONFLICT,
            messageTemplate: 'Database already exists',
            errorCode: ErrorCodeEnum.RESOURCE_ALREADY_EXISTS,
            isOperational: true,
        },
    ],
    [
        'P1010',
        {
            statusCode: HTTPSTATUS.UNAUTHORIZED,
            messageTemplate: 'Access denied for database user',
            errorCode: ErrorCodeEnum.AUTHENTICATION_ERROR,
            isOperational: true,
        },
    ],
    [
        'P1011',
        {
            statusCode: HTTPSTATUS.INTERNAL_SERVER_ERROR,
            messageTemplate: 'Error opening TLS connection',
            errorCode: ErrorCodeEnum.DATABASE_CONNECTION_ERROR,
            isOperational: true,
        },
    ],
    [
        'P1012',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'Schema validation error',
            errorCode: ErrorCodeEnum.VALIDATION_ERROR,
            isOperational: true,
        },
    ],
    [
        'P1013',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'Invalid database string provided',
            errorCode: ErrorCodeEnum.CONFIGURATION_ERROR,
            isOperational: true,
        },
    ],
    [
        'P1014',
        {
            statusCode: HTTPSTATUS.NOT_FOUND,
            messageTemplate: 'Underlying model does not exist',
            errorCode: ErrorCodeEnum.RESOURCE_NOT_FOUND,
            isOperational: true,
        },
    ],
    [
        'P1015',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'Unsupported database version',
            errorCode: ErrorCodeEnum.CONFIGURATION_ERROR,
            isOperational: true,
        },
    ],
    [
        'P1016',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'Incorrect number of parameters for raw query',
            errorCode: ErrorCodeEnum.VALIDATION_ERROR,
            isOperational: true,
        },
    ],
    [
        'P1017',
        {
            statusCode: HTTPSTATUS.SERVICE_UNAVAILABLE,
            messageTemplate: 'Database server has closed the connection',
            errorCode: ErrorCodeEnum.DATABASE_CONNECTION_ERROR,
            isOperational: true,
        },
    ],

    // Query Engine Errors (P2xxx)
    [
        'P2000',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate:
                'The provided value is too long for the column type',
            errorCode: ErrorCodeEnum.VALIDATION_ERROR,
            isOperational: true,
        },
    ],
    [
        'P2001',
        {
            statusCode: HTTPSTATUS.NOT_FOUND,
            messageTemplate: 'The record searched for does not exist',
            errorCode: ErrorCodeEnum.RESOURCE_NOT_FOUND,
            isOperational: true,
        },
    ],
    [
        'P2002',
        {
            statusCode: HTTPSTATUS.CONFLICT,
            messageTemplate: 'A record with this value already exists',
            errorCode: ErrorCodeEnum.RESOURCE_ALREADY_EXISTS,
            isOperational: true,
        },
    ],
    [
        'P2003',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate:
                'The operation failed due to a conflict with related data',
            errorCode: ErrorCodeEnum.FOREIGN_KEY_CONSTRAINT,
            isOperational: true,
        },
    ],
    [
        'P2004',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'A constraint failed on the database',
            errorCode: ErrorCodeEnum.CONSTRAINT_VIOLATION,
            isOperational: true,
        },
    ],
    [
        'P2005',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate:
                'The value stored in the database is invalid for the field type',
            errorCode: ErrorCodeEnum.DATA_TYPE_ERROR,
            isOperational: true,
        },
    ],
    [
        'P2006',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate:
                'The provided value is not valid for the field type',
            errorCode: ErrorCodeEnum.VALIDATION_ERROR,
            isOperational: true,
        },
    ],
    [
        'P2007',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'Data validation error',
            errorCode: ErrorCodeEnum.VALIDATION_ERROR,
            isOperational: true,
        },
    ],
    [
        'P2008',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'Failed to parse the query',
            errorCode: ErrorCodeEnum.QUERY_PARSE_ERROR,
            isOperational: true,
        },
    ],
    [
        'P2009',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'Failed to validate the query',
            errorCode: ErrorCodeEnum.QUERY_VALIDATION_ERROR,
            isOperational: true,
        },
    ],
    [
        'P2010',
        {
            statusCode: HTTPSTATUS.INTERNAL_SERVER_ERROR,
            messageTemplate: 'Raw query failed',
            errorCode: ErrorCodeEnum.QUERY_EXECUTION_ERROR,
            isOperational: false,
        },
    ],
    [
        'P2011',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'Null constraint violation',
            errorCode: ErrorCodeEnum.NULL_CONSTRAINT_VIOLATION,
            isOperational: true,
        },
    ],
    [
        'P2012',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'Missing a required value',
            errorCode: ErrorCodeEnum.REQUIRED_FIELD_MISSING,
            isOperational: true,
        },
    ],
    [
        'P2013',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'Missing the required argument for field',
            errorCode: ErrorCodeEnum.REQUIRED_FIELD_MISSING,
            isOperational: true,
        },
    ],
    [
        'P2014',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'The change would violate a required relationship',
            errorCode: ErrorCodeEnum.RELATION_VIOLATION,
            isOperational: true,
        },
    ],
    [
        'P2015',
        {
            statusCode: HTTPSTATUS.NOT_FOUND,
            messageTemplate: 'A related record could not be found',
            errorCode: ErrorCodeEnum.RELATED_RESOURCE_NOT_FOUND,
            isOperational: true,
        },
    ],
    [
        'P2016',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'Query interpretation error',
            errorCode: ErrorCodeEnum.QUERY_INTERPRETATION_ERROR,
            isOperational: true,
        },
    ],
    [
        'P2017',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'The records are not connected',
            errorCode: ErrorCodeEnum.RECORDS_NOT_CONNECTED,
            isOperational: true,
        },
    ],
    [
        'P2018',
        {
            statusCode: HTTPSTATUS.NOT_FOUND,
            messageTemplate: 'The required connected records were not found',
            errorCode: ErrorCodeEnum.CONNECTED_RECORDS_NOT_FOUND,
            isOperational: true,
        },
    ],
    [
        'P2019',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'Input error',
            errorCode: ErrorCodeEnum.INPUT_ERROR,
            isOperational: true,
        },
    ],
    [
        'P2020',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'Value out of range for the type',
            errorCode: ErrorCodeEnum.VALUE_OUT_OF_RANGE,
            isOperational: true,
        },
    ],
    [
        'P2021',
        {
            statusCode: HTTPSTATUS.NOT_FOUND,
            messageTemplate: 'The table does not exist in the current database',
            errorCode: ErrorCodeEnum.TABLE_NOT_FOUND,
            isOperational: true,
        },
    ],
    [
        'P2022',
        {
            statusCode: HTTPSTATUS.NOT_FOUND,
            messageTemplate:
                'The column does not exist in the current database',
            errorCode: ErrorCodeEnum.COLUMN_NOT_FOUND,
            isOperational: true,
        },
    ],
    [
        'P2023',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate: 'Inconsistent column data',
            errorCode: ErrorCodeEnum.INCONSISTENT_COLUMN_DATA,
            isOperational: true,
        },
    ],
    [
        'P2024',
        {
            statusCode: HTTPSTATUS.REQUEST_TIMEOUT,
            messageTemplate:
                'Timed out fetching a new connection from the connection pool',
            errorCode: ErrorCodeEnum.CONNECTION_POOL_TIMEOUT,
            isOperational: true,
        },
    ],
    [
        'P2025',
        {
            statusCode: HTTPSTATUS.NOT_FOUND,
            messageTemplate: 'The requested record was not found',
            errorCode: ErrorCodeEnum.RESOURCE_NOT_FOUND,
            isOperational: true,
        },
    ],
    [
        'P2026',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate:
                'The current database provider does not support this feature',
            errorCode: ErrorCodeEnum.UNSUPPORTED_FEATURE,
            isOperational: true,
        },
    ],
    [
        'P2027',
        {
            statusCode: HTTPSTATUS.INTERNAL_SERVER_ERROR,
            messageTemplate: 'Multiple errors occurred during query execution',
            errorCode: ErrorCodeEnum.MULTIPLE_QUERY_ERRORS,
            isOperational: false,
        },
    ],
    [
        'P2028',
        {
            statusCode: HTTPSTATUS.INTERNAL_SERVER_ERROR,
            messageTemplate: 'Transaction API error',
            errorCode: ErrorCodeEnum.TRANSACTION_ERROR,
            isOperational: false,
        },
    ],
    [
        'P2030',
        {
            statusCode: HTTPSTATUS.NOT_FOUND,
            messageTemplate:
                'Cannot find a fulltext index to use for the search',
            errorCode: ErrorCodeEnum.FULLTEXT_INDEX_NOT_FOUND,
            isOperational: true,
        },
    ],
    [
        'P2031',
        {
            statusCode: HTTPSTATUS.INTERNAL_SERVER_ERROR,
            messageTemplate:
                'MongoDB replica set required for transaction support',
            errorCode: ErrorCodeEnum.MONGODB_REPLICA_SET_REQUIRED,
            isOperational: true,
        },
    ],
    [
        'P2033',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate:
                'A number used in the query does not fit into a 64 bit signed integer',
            errorCode: ErrorCodeEnum.NUMBER_OUT_OF_RANGE,
            isOperational: true,
        },
    ],
    [
        'P2034',
        {
            statusCode: HTTPSTATUS.CONFLICT,
            messageTemplate:
                'Transaction failed due to a write conflict or a deadlock',
            errorCode: ErrorCodeEnum.TRANSACTION_WRITE_CONFLICT,
            isOperational: true,
        },
    ],

    // Migration Engine Errors (P3xxx)
    [
        'P3000',
        {
            statusCode: HTTPSTATUS.INTERNAL_SERVER_ERROR,
            messageTemplate: 'Failed to create database',
            errorCode: ErrorCodeEnum.DATABASE_CREATION_FAILED,
            isOperational: false,
        },
    ],
    [
        'P3001',
        {
            statusCode: HTTPSTATUS.INTERNAL_SERVER_ERROR,
            messageTemplate: 'Migration possible with destructive changes',
            errorCode: ErrorCodeEnum.DESTRUCTIVE_MIGRATION_DETECTED,
            isOperational: false,
        },
    ],
    [
        'P3002',
        {
            statusCode: HTTPSTATUS.INTERNAL_SERVER_ERROR,
            messageTemplate: 'The attempted migration was rolled back',
            errorCode: ErrorCodeEnum.MIGRATION_ROLLBACK,
            isOperational: false,
        },
    ],

    // Introspection Engine Errors (P4xxx)
    [
        'P4000',
        {
            statusCode: HTTPSTATUS.INTERNAL_SERVER_ERROR,
            messageTemplate: 'Introspection operation failed',
            errorCode: ErrorCodeEnum.INTROSPECTION_ERROR,
            isOperational: false,
        },
    ],
    [
        'P4001',
        {
            statusCode: HTTPSTATUS.NOT_FOUND,
            messageTemplate: 'The introspected database was empty',
            errorCode: ErrorCodeEnum.EMPTY_DATABASE,
            isOperational: true,
        },
    ],
    [
        'P4002',
        {
            statusCode: HTTPSTATUS.BAD_REQUEST,
            messageTemplate:
                'The schema of the introspected database is inconsistent',
            errorCode: ErrorCodeEnum.INCONSISTENT_SCHEMA,
            isOperational: true,
        },
    ],
]);

export const HTTP_STATUS_MAPPINGS = new Map([
    // Client Error Responses (4xx)
    [400, { status: 'fail', message: 'Bad Request' }],
    [401, { status: 'fail', message: 'Unauthorized' }],
    [402, { status: 'fail', message: 'Payment Required' }],
    [403, { status: 'fail', message: 'Forbidden' }],
    [404, { status: 'fail', message: 'Not Found' }],
    [405, { status: 'fail', message: 'Method Not Allowed' }],
    [406, { status: 'fail', message: 'Not Acceptable' }],
    [407, { status: 'fail', message: 'Proxy Authentication Required' }],
    [408, { status: 'fail', message: 'Request Timeout' }],
    [409, { status: 'fail', message: 'Conflict' }],
    [410, { status: 'fail', message: 'Gone' }],
    [411, { status: 'fail', message: 'Length Required' }],
    [412, { status: 'fail', message: 'Precondition Failed' }],
    [413, { status: 'fail', message: 'Payload Too Large' }],
    [414, { status: 'fail', message: 'URI Too Long' }],
    [415, { status: 'fail', message: 'Unsupported Media Type' }],
    [416, { status: 'fail', message: 'Range Not Satisfiable' }],
    [417, { status: 'fail', message: 'Expectation Failed' }],
    [418, { status: 'fail', message: "I'm a teapot" }],
    [421, { status: 'fail', message: 'Misdirected Request' }],
    [422, { status: 'fail', message: 'Unprocessable Entity' }],
    [423, { status: 'fail', message: 'Locked' }],
    [424, { status: 'fail', message: 'Failed Dependency' }],
    [425, { status: 'fail', message: 'Too Early' }],
    [426, { status: 'fail', message: 'Upgrade Required' }],
    [428, { status: 'fail', message: 'Precondition Required' }],
    [429, { status: 'fail', message: 'Too Many Requests' }],
    [431, { status: 'fail', message: 'Request Header Fields Too Large' }],
    [451, { status: 'fail', message: 'Unavailable For Legal Reasons' }],

    // Server Error Responses (5xx)
    [500, { status: 'error', message: 'Internal Server Error' }],
    [501, { status: 'error', message: 'Not Implemented' }],
    [502, { status: 'error', message: 'Bad Gateway' }],
    [503, { status: 'error', message: 'Service Unavailable' }],
    [504, { status: 'error', message: 'Gateway Timeout' }],
    [505, { status: 'error', message: 'HTTP Version Not Supported' }],
    [506, { status: 'error', message: 'Variant Also Negotiates' }],
    [507, { status: 'error', message: 'Insufficient Storage' }],
    [508, { status: 'error', message: 'Loop Detected' }],
    [510, { status: 'error', message: 'Not Extended' }],
    [511, { status: 'error', message: 'Network Authentication Required' }],
]);
