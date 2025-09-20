import { getGlobalData } from './global-data';
import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';
import { serialize } from 'next-mdx-remote/serialize';

const POSTS_PATH = join(process.cwd(), 'posts');

export function getPostsFilePaths() {
  return fs
    .readdirSync(POSTS_PATH)
    .filter((path) => /\.mdx?$/.test(path));
}

export function getPostBySlug(slug) {
  const postFilePath = join(POSTS_PATH, `${slug}.mdx`);
  const source = fs.readFileSync(postFilePath);

  const { content, data } = matter(source);

  return {
    content,
    data,
  };
}

export function getSortedPosts() {
  const posts = getPostsFilePaths()
    .map((filePath) => {
      const source = fs.readFileSync(join(POSTS_PATH, filePath));
      const { content, data } = matter(source);

      return {
        content,
        data,
        filePath,
      };
    })
    .sort((post1, post2) => {
      // Ordena posts por data em ordem decrescente
      if (post1.data.date < post2.data.date) {
        return 1;
      } else {
        return -1;
      }
    });

  return posts.map((post) => {
    return {
      content: post.content,
      ...post.data,
      slug: post.filePath.replace(/\.mdx?$/, ''),
      date: post.data.date ? new Date(post.data.date).toISOString() : null,
    };
  });
}

export async function getPosts() {
  const posts = getSortedPosts();

  return Promise.all(
    posts.map(async (post) => {
      const { content, ...data } = post;
      const mdxSource = await serialize(content);

      return {
        source: mdxSource,
        ...data,
      };
    })
  );
}

// CORREÇÃO: A função getPost agora converte o objeto de data para uma string antes de retornar.
export async function getPost(slug) {
  const { content, data } = getPostBySlug(slug);
  const mdxSource = await serialize(content);

  // Certifica-se de que a data é uma string válida
  const dateString = data.date ? new Date(data.date).toISOString() : null;

  return {
    source: mdxSource,
    ...data,
    date: dateString // Sobrescreve a data com a versão em string
  };
}