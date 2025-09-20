import { getGlobalData } from '../../utils/global-data';
import { getPost, getSortedPosts } from '../../utils/mdx-utils';
import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import Link from 'next/link';
import ArrowIcon from '../../components/ArrowIcon';
import CustomLink from '../../components/CustomLink';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Layout, { GradientBackground } from '../../components/Layout';
import SEO from '../../components/SEO';


const components = {
  a: CustomLink,
  Head,
};

export default function PostPage({
  source,
  frontMatter,
  globalData,
}) {
  return (
    <Layout>
      <SEO
        title={`${frontMatter.title} - ${globalData.name}`}
        description={frontMatter.description}
      />
      <Header name={globalData.name} />
      <article className="px-6 md:px-0">
        <header>
          <h1 className="text-3xl md:text-5xl dark:text-white text-center mb-12">
            {frontMatter.title}
          </h1>
          {frontMatter.description && (
            <p className="text-xl mb-4">{frontMatter.description}</p>
          )}
        </header>
        <main>
          <article className="prose dark:prose-dark">
            <MDXRemote {...source} components={components} />
          </article>
        </main>
      </article>
      <Footer copyrightText={globalData.footerText} />
      <GradientBackground
        variant="large"
        className="absolute -top-32 opacity-30 dark:opacity-50"
      />
      <GradientBackground
        variant="small"
        className="absolute bottom-0 opacity-20 dark:opacity-10"
      />
    </Layout>
  );
}

export const getStaticPaths = async () => {
  const posts = getSortedPosts();
  const paths = posts.map((post) => ({
    params: {
      slug: post.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const globalData = getGlobalData();
  // Chamando a função getPost corrigida
  const { source, ...data } = await getPost(params.slug);

  return {
    props: {
      globalData,
      source: source,
      frontMatter: data,
    },
  };
};