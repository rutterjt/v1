import React from 'react';
import { graphql, Link, PageProps } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';

// components
import {
  Layout,
  Seo,
  Section,
  CTABox,
  CodeBlock,
  CodeTabs,
  CodePanel,
} from '@/components';

// types
import type { PostNode, BlogPost } from '@/types';

type DataProps = {
  allFile: {
    edges: [
      {
        node: BlogPost;
      }
    ];
  };
};

type PageContext = {
  id: string;
  next: PostNode | null;
  previous: PostNode | null;
};

const shortcodes = { pre: CodeBlock, CodeTabs, CodePanel };

const BlogPostTemplate = ({
  data,
  pageContext,
}: PageProps<DataProps, PageContext>) => {
  const node = data.allFile.edges[0].node.childMdx;
  const { next, previous } = pageContext;

  const image =
    node.frontmatter.featured_image?.childImageSharp?.gatsbyImageData;

  let src = node.frontmatter.featured_image?.childImageSharp.original.src;
  let height = node.frontmatter.featured_image?.childImageSharp.original.height;
  let width = node.frontmatter.featured_image?.childImageSharp.original.width;

  let seoImage = src && height && width ? { src, height, width } : undefined;

  return (
    <Layout withCTA>
      <Seo
        title={`${node.frontmatter.title} | Jon Rutter`}
        pathname={`/blog/${node.slug}`}
        article
        author="Jon Rutter"
        description={node.frontmatter.excerpt}
        image={seoImage}
      />
      <div className="bg-white dark:bg-slate-900 pt-8 transition-all">
        <Section as="div">
          <article className="max-w-xl md:max-w-screen-md mx-auto">
            <header className="mb-10 sm:mb-12 md:mb-16">
              <h1 className="transition-all font-heading font-black text-4xl md:text-5xl lg:text-6xl text-slate-900 dark:text-white mb-3 md:mb-4">
                {node.frontmatter.title}
              </h1>
              <p className="text-base md:text-lg font-normal mt-0 mb-6 md:mb-8 block">
                <time dateTime={node.frontmatter.date}>
                  {node.frontmatter.date}
                </time>{' '}
                • {node.timeToRead} minute read
              </p>

              {image && (
                <figure>
                  <GatsbyImage
                    image={image}
                    alt={node.frontmatter.featured_image_alt || ''}
                    className="select-none pointer-events-none dark:opacity-80 rounded-lg mb-3"
                    imgClassName="select-none pointer-events-none dark:opacity-80 rounded-lg"
                  />
                  <figcaption className="italic">
                    Image credit:{' '}
                    <a
                      href={node.frontmatter.featured_image_link}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {node.frontmatter.featured_image_credit}
                    </a>
                  </figcaption>
                </figure>
              )}
            </header>
            <div className="prose md:prose-lg prose-slate mx-auto dark:prose-invert mb-8">
              <MDXProvider components={shortcodes}>
                <MDXRenderer>{node.body}</MDXRenderer>
              </MDXProvider>
              <hr />
            </div>
            <footer className="prose md:prose-lg mx-auto">
              <div className="flex flex-col space-y-4">
                {previous && (
                  <div className="self-start">
                    <Link
                      to={`/blog/${previous.childMdx.slug}`}
                      className="text-sea-900 dark:text-sea-400 hover:opacity-80 no-underline hover:underline"
                    >
                      ← {previous.childMdx.frontmatter.title}
                    </Link>
                  </div>
                )}
                {next && (
                  <div className="self-end">
                    <Link
                      to={`/blog/${next.childMdx.slug}`}
                      className="text-sea-900 dark:text-sea-400 hover:opacity-80 no-underline hover:underline"
                    >
                      {next.childMdx.frontmatter.title} →
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </article>
        </Section>
        <CTABox />
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query ($id: String) {
    allFile(filter: { id: { eq: $id } }) {
      edges {
        node {
          id
          childMdx {
            id
            slug
            timeToRead
            body
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              title
              excerpt
              featured_image_link
              featured_image_credit
              featured_image_alt
              featured_image {
                childImageSharp {
                  gatsbyImageData(placeholder: BLURRED)
                  original {
                    src
                    width
                    height
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default BlogPostTemplate;
