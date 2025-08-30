import { PrismaClient } from '@prisma/client';
import _config from './_config';

const prisma = new PrismaClient();

export default prisma;
