export const getEnv = <T>(key: string, defaultValue?: T): T | string => {
    const value = process.env[key];
    if (value === undefined) {
        if (defaultValue) {
            return defaultValue as T;
        }
        throw new Error(`Enviroment variable ${key} is not set`);
    }
    return value as string;
};
