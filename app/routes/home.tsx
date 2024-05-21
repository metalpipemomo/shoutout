import { LoaderFunction } from '@remix-run/node';

import { requireUserId } from '~/utils/auth.server';
import { Layout } from '~/components/layout';
import { Header } from '~/components/header';

export const loader: LoaderFunction = async ({ request }) => {
	await requireUserId(request);
	return null;
};

export default function Home() {
	return (
		<Layout>
            <Header />
		</Layout>
	);
}
