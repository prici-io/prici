import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { readFileSync } from 'fs';


const privateKeyPath = process.env.PRIVATE_KEY_PATH || join(process.cwd(), 'private_key.pem');

export const jwtSecret: string = existsSync(privateKeyPath) ? readFileSync(privateKeyPath, 'utf8') : process.env.JWT_SECRET || 'default';

export const port = Number(process.env.PORT || 9000);

export const host = process.env.HOST || '0.0.0.0';