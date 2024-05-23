import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { requireUserId } from '~/utils/auth.server';
import { getAllPosts, HomePosts } from '~/utils/post.server';
import { Layout } from '~/components/layout';
import { Header } from '~/components/header';

export const loader: LoaderFunction = async ({ request }) => {
	const userId = await requireUserId(request);

	return await getAllPosts(userId);
};

export default function Home() {
	const data = useLoaderData<typeof loader>() as HomePosts;
	console.log(data);
	return (
		<Layout>
			<Header />
			{data.map((post) => {
				return (
					<div key={post.id}>
						<h1>{`${post.author.firstName} ${post.author.lastName}`}</h1>
						<p>{post.content}</p>
						<p>{new Date(post.createdAt.toString()).toDateString()}</p>
					</div>
				);
			})}
		</Layout>
	);
}
