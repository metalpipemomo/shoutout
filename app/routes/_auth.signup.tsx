import { json, ActionFunction } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';

import { FormField } from '~/components/form-field';
import {
	validateEmail,
	validatePassword,
	validateName
} from '~/utils/validation';
import { register } from '~/utils/auth.server';

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const email = form.get('email');
	const password = form.get('password');
	const firstName = form.get('firstName');
	const lastName = form.get('lastName');

	if (
		typeof email !== 'string' ||
		typeof password !== 'string' ||
		typeof firstName !== 'string' ||
		typeof lastName !== 'string'
	) {
		return json({ error: 'Invalid form data' }, { status: 400 });
	}

	const errors: string[] = [
		validateEmail(email),
		validatePassword(password),
		validateName(firstName),
		validateName(lastName)
	].flatMap((validation) => validation.errors || []);

	if (errors.length) {
		return json({ error: errors.toString() }, { status: 400 });
	}

	return await register({ email, password, firstName, lastName });
};

export default function Signup() {
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
			<FormField
				htmlFor={'firstName'}
				labelText={'First Name'}
				type={'text'}
                validationFn={validateName}
				validateWhen={'blur'}
				required
			/>
			<FormField
				htmlFor={'lastName'}
				labelText={'Last Name'}
				type={'text'}
                validationFn={validateName}
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
					Sign Up
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
                <p className={'text-xs font-semibold mt-3 tracking-wide'}>
					Already have an account?{' '}<Link to={'/login'} className={'underline text-blue-700'}>Log in!</Link>
				</p>
			</div>
		</Form>
	);
}
