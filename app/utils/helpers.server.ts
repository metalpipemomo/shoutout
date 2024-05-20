import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export async function Hash(hashable: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(hashable, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
}

export async function VerifyHash(storedHash: string, unhashedItem: string): Promise<boolean> {
    const [salt, key] = storedHash.split(':');
    const derivedKeyBuffer = (await scryptAsync(unhashedItem, salt, 64)) as Buffer;
    const keyHex = derivedKeyBuffer.toString('hex');
    return key === keyHex;
}