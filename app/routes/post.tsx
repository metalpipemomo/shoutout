import { ActionFunction, LoaderFunction, json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { requireUserId } from '~/utils/auth.server';
import { Layout } from '~/components/layout';
import { Header } from '~/components/header';
import { FormField } from '~/components/form-field';
import { createPost } from '~/utils/post.server';

export const action: ActionFunction = async ({ request }) => {
    const userId = await requireUserId(request);
    const form = await request.formData();
    const content = form.get('content');

    if (typeof content !== 'string') {
        return json({ error: 'Invalid form data' }, { status: 400 });
    }

    return await createPost(userId, content);
}

export const loader: LoaderFunction = async ({ request }) => {
	await requireUserId(request);

	return null;
};

export default function Home() {
	return (
		<Layout>
			<Header />
			<Form method={'post'}>
                <FormField 
                    htmlFor={'content'}
                    labelText={'content goes here'}
                    type={'text'}
                    required
                />
                <button
                    type={'submit'}
                >
                    submit
                </button>
            </Form>
		</Layout>
	);
}
