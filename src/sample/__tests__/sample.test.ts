import { jest } from '@jest/globals';

// basic jest config
jest.setTimeout(30000);

const addition = (a: number, b: number) => a + b;

export interface IPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}

const fetchPosts = async (): Promise<IPost[]> => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');

    const posts = await res.json();

    return posts;
};

describe('Addition function tests', () => {
    it('Should check the addition result of two numbers', () => {
        const sum = addition(1, 2);

        expect(sum).toBe(3);
        expect(sum).not.toBe(1);
        expect(sum).not.toBeLessThan(2);
    });
});

describe('JSON posts tests', () => {
    it('Should check the fetch posts function', async () => {
        const posts = await fetchPosts();

        expect(posts).toEqual(
            expect.arrayContaining([
                {
                    userId: 1,
                    id: 1,
                    title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
                    body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
                }
            ])
        );
    });
});
