import type { MetaFunction } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/node';
import { requireUserId } from '~/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
	await requireUserId(request);

	return null;
}

export const meta: MetaFunction = () => {
	return [
		{ title: 'New Remix App' },
		{ name: 'description', content: 'Welcome to Remix!' }
	];
};

export default function Index() {
	return (
		<div className={'flex h-screen items-center justify-center bg-white'}>
			<h2 className={'text-5xl font-extrabold text-black'}>
				TailwindCSS Is Working!
			</h2>
		</div>
	);
}
