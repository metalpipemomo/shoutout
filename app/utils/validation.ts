import { z } from 'zod';

export type ValidationResult = {
	success: boolean;
	errors?: string[];
};

const EmailSchema = z.string().email('Please enter a valid email address');
const PasswordSchema = z
	.string()
	.min(8, 'Password must be at least 8 characters')
	.regex(/[A-Za-z]/, 'Password must contain at least 1 alphabet letter')
	.regex(/[0-9]/, 'Password must contain at least 1 number')
	.regex(
		/[@$!%*?&]/,
		'Password must contain at least 1 of the following special characters: @$!%*?&'
	);
const NameSchema = z.string().min(2, 'Name must be longer than 1 character');

function validateString(validatee: string, validator: z.ZodString): ValidationResult {
    const result = validator.safeParse(validatee);

    return {
		success: result.success,
		errors: result.error
			? result.error.errors.map((issue) => issue.message)
			: undefined
	};
}

export const validateEmail = (email: string) => validateString(email, EmailSchema);
export const validatePassword = (password: string) => validateString(password, PasswordSchema);
export const validateName = (name: string) => validateString(name, NameSchema);