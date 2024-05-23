import { redirect } from '@remix-run/node';
import { db } from './prisma.server';

export type HomePosts = Awaited<ReturnType<typeof getAllPosts>>;

export async function getAllPosts(userId: string) {
    const posts = await db.post.findMany({
        where: { authorId: { not: userId } },
        select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            }
        }
    });

    return posts;
}

export async function createPost(userId: string, content: string) {
    const post = await db.post.create({
        data: {
            authorId: userId,
            content: content
        }
    });

    return redirect('/home');
}