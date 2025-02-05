import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import matter from 'gray-matter'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import remarkfrontmatter from 'remark-frontmatter'

interface BlogPostData {
  title: string
  date: string
}

// Fetch the list of slugs (paths to blog posts)
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'app/blogs/posts')
  const filenames = fs.readdirSync(postsDirectory)

  const slugs = filenames
    .filter((filename) => filename.endsWith('.md') || filename.endsWith('.mdx'))
    .map((filename) => ({
      slug: filename.replace(/\.mdx?$/, ''),
    }))

  return slugs
}

// Function to fetch the blog post content
async function getBlogPost(slug: string) {
  const filePath = path.join(process.cwd(), 'app/blogs/posts', `${slug}.mdx`)

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { content, data } = matter(fileContents)

    return {
      content,
      data: data as BlogPostData,
    }
  } catch (error) {
    console.error('Error reading file:', filePath)
    return {
      content: '',
      data: { title: 'Post Not Found', date: '' },
    }
  }
}

export type paramsType = Promise<{ slug: string }>;

// Blog Post component that renders the content
export default async function BlogPost({ params }: { params: paramsType }) {
  // Fetch the blog content and data
  const { content, data } = await getBlogPost((await params).slug)

  return (
    <div className="space-y-8">
      <Link href="/blogs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Blogs
      </Link>
      <><script async data-cfasync="false" src="//pl25765154.profitablecpmrate.com/a039feec78d06c378ec11b81ec2e1253/invoke.js"></script>
      <div id="container-a039feec78d06c378ec11b81ec2e1253"></div>
      </>
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <p className="text-muted-foreground">{data.date}</p>

      {/* Render the MDX content */}
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            rehypePlugins: [rehypeHighlight],
            remarkPlugins: [remarkGfm, remarkfrontmatter],
          },
        }}
      />
    </div>
  )
}
