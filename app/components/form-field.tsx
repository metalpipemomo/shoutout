import { useState, useRef } from 'react';

import type { ValidationResult } from '~/utils/validation';

type FormFieldProps = {
	htmlFor: string;
	labelText: string;
	type: React.HTMLInputTypeAttribute;
	value?: string | number | readonly string[];
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	validationFn?: (value: string) => ValidationResult;
	validateWhen?: 'change' | 'blur';
	required?: boolean
};

export function FormField({
	htmlFor,
	labelText,
	type,
	value,
	onChange = () => {},
	onBlur = () => {},
	validationFn,
	validateWhen,
	required = false
}: FormFieldProps) {
	const [errors, setErrors] = useState<string[]>([]);
	const val = useRef<HTMLInputElement>(null);

	return (
		<>
			<label htmlFor={htmlFor} className={'font-semibold text-blue-500'}>
				{labelText}
			</label>
			<input
				required={required}
				onChange={(e) => {
					onChange(e);
					if (validationFn && validateWhen === 'change') {
						if (val.current) {
							const result = validationFn(val.current.value);
							setErrors(result.errors ?? []);
						}
					}
				}}
				onBlur={(e) => {
					onBlur(e);
					if (validationFn && validateWhen === 'blur') {
						if (val.current && val.current.value) {
							const result = validationFn(val.current.value);
							setErrors(result.errors ?? []);
						}
					}
				}}
				type={type}
				id={htmlFor}
				name={htmlFor}
				className={'my-2 w-full rounded-xl p-2'}
				value={value}
				ref={val}
			/>
			{errors.length > 0 ? (
				<div className={'flex flex-col w-full mb-2'}>
					{errors.map((error, key) => {
						return (
							<p
								className={
									'text-xs font-semibold tracking-wide text-red-500 px-2 border-b'
								}
								key={key}
							>
								{error}.
							</p>
						);
					})}
				</div>
			) : null}
		</>
	);
}
