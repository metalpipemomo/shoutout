import type { RegisterForm } from './types.server';
import { prisma } from './prisma.server';
import { Hash } from './helpers.server';

export async function createUser(user: RegisterForm) {
    const passwordHash = await Hash(user.password);
    const newUser = await prisma.user.create({
        data: {
            email: user.email,
            password: passwordHash,
            firstName: user.firstName,
            lastName: user.lastName
        }
    });

    return { id: newUser.id, email: user.email };
}