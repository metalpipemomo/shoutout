import { json, createCookieSessionStorage, redirect, Session, SessionData, TypedResponse } from '@remix-run/node';

import type { RegisterForm, LoginForm } from './types.server';
import { db } from './prisma.server';
import { createUser } from './user.server';
import { VerifyHash } from './helpers.server';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
	throw new Error('SESSION_SECRET must be set in the .env');
}

const storage = createCookieSessionStorage({
	cookie: {
		name: 'shoutout-session',
		secure: process.env.NODE_ENV === 'production',
		secrets: [sessionSecret],
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 30,
		httpOnly: true
	}
});

export async function createUserSession(userId: string, redirectTo: string) {
	const session = await storage.getSession();
	session.set('userId', userId);
	return redirect(redirectTo, {
		headers: {
			'Set-Cookie': await storage.commitSession(session)
		}
	});
}

export async function register(data: RegisterForm) {
	const userExists = await db.user.count({ where: { email: data.email } });
	if (userExists) {
		return json(
			{ error: `User already exists with that email` },
			{ status: 400 }
		);
	}

	const user = await createUser(data);
	if (!user) {
		return json(
			{
				error: `Something went wrong while creating the new user`,
				fields: { email: data.email, password: data.password }
			},
			{ status: 400 }
		);
	}

	return createUserSession(user.id, '/');
}

export async function login(data: LoginForm) {
	const user = await db.user.findUnique({
		where: { email: data.email }
	});
	if (!user) {
		return json(
			{ error: `No user exists with the email provided` },
			{ status: 400 }
		);
	}

	if (!(await VerifyHash(user.password, data.password))) {
		return json(
			{ error: `Credentials provided are incorrect` },
			{ status: 400 }
		);
	}

	return createUserSession(user.id, '/');
}

function getUserSession(request: Request): Promise<Session<SessionData, SessionData>> {
    return storage.getSession(request.headers.get('Cookie'));
}

async function getUserId(request: Request): Promise<string | null> {
    const session = await getUserSession(request);
    const userId = session.get('userId');
    if (!userId || typeof userId !== 'string') return null;
    return userId;
}

export async function getUser(request: Request) {
    const userId = await getUserId(request);
    if (typeof userId !== 'string') {
        return null;
    }

    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, firstName: true, lastName: true }
        });

        return user;
    } catch {
        throw logout(request);
    }
}

export async function logout(request: Request): Promise<TypedResponse<never>> {
    const session = await getUserSession(request);
    return redirect('/login', {
        headers: {
            'Set-Cookie': await storage.destroySession(session)
        }
    });
}

export async function requireUserId(
	request: Request,
	redirectTo: string = new URL(request.url).pathname
): Promise<string> {
    const session = await getUserSession(request);
    const userId = session.get('userId');
    if (!userId || typeof userId !== 'string') {
        const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
        throw redirect(`/login?${searchParams}`);
    }

    return userId;
}
