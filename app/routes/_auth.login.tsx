import {
	json,
	ActionFunction,
	LoaderFunction,
	redirect
} from '@remix-run/node';
import { Form, Link } from '@remix-run/react';
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
		return json({ errors, fields: { email, password } }, { status: 400 });
	}

	return await login({ email, password });
};

export default function Login() {
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
				<p className={'text-xs font-semibold mt-3 tracking-wide'}>
					New to shoutout?{' '}<Link to={'/signup'} className={'underline text-blue-700'}>Sign up!</Link>
				</p>
			</div>
		</Form>
	);
}
