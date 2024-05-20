import { Outlet } from '@remix-run/react';

import { Layout } from '~/components/layout';

export default function Auth() {
	return (
		<Layout>
			<div
				className={'flex h-full flex-col items-center justify-center gap-y-4'}
			>
				<h2 className={'text-5xl font-extrabold text-black'}>
					Welcome to SHOUTOUT!
				</h2>
				<p className={'font-semibold text-black'}>
					Join in on giving someone a well-deserved shoutout!
				</p>
				<Outlet />
			</div>
		</Layout>
	);
}
