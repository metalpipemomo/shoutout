import {
	json,
	ActionFunction,
	LoaderFunction,
	redirect
} from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import { useState } from 'react';

import { FormField } from '~/components/form-field';
import { validateEmail, validatePassword } from '~/utils/validation';
import { login, getUser } from '~/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
	return (await getUser(request)) ? redirect('/') : null;
};

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const email = form.get('email');
	const password = form.get('password');

	if (typeof email !== 'string' || typeof password !== 'string') {
		return json({ error: 'Invalid form data' }, { status: 400 });
	}

	const errors: string[] = [
		validateEmail(email),
		validatePassword(password)
	].flatMap((validation) => validation.errors || []);

	if (errors.length) {
		return json({ error: errors.toString() }, { status: 400 });
	}

	return await login({ email, password });
};

export default function Login() {
	const data = useActionData<typeof action>();

	return (
		<Form
			method={'post'}
			className={'w-96 rounded-2xl bg-gray-100 p-6 shadow-md'}
		>
			<FormField
				htmlFor={'email'}
				labelText={'Email'}
				type={'email'}
				validationFn={validateEmail}
				validateWhen={'blur'}
				required
			/>
			<FormField
				htmlFor={'password'}
				labelText={'Password'}
				type={'password'}
				validationFn={validatePassword}
				validateWhen={'blur'}
				required
			/>
			<div className={'w-full text-center'}>
				<button
					type={'submit'}
					className={
						'mt-2 rounded-xl bg-black px-3 py-2 font-semibold text-white transition duration-300 ease-in-out hover:bg-blue-600 hover:text-black'
					}
				>
					Sign In
				</button>
				{data?.error ? (
					<p
						className={
							'mt-2 border-b px-2 text-xs font-semibold tracking-wide text-red-500'
						}
					>
						{data.error}
					</p>
				) : null}
				<p className={'mt-3 text-xs font-semibold tracking-wide'}>
					New to shoutout?{' '}
					<Link to={'/signup'} className={'text-blue-700 underline'}>
						Sign up!
					</Link>
				</p>
			</div>
		</Form>
	);
}
