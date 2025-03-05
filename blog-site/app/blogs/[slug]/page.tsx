import { Metadata } from "next";
import BlogPage from "@/app/blogs/[slug]/BlogPage";

// Simulate an API call (Replace with actual API request)
async function getBlogMetadata(slug: string) {
    try {
        const res = await fetch(`http://localhost:1337/api/blogs?filters[slug][$eq]=${slug}`);
        if (!res.ok) throw new Error("Blog not found");
        const json = await res.json();
        return json.data[0];
    } catch (error) {
        return null;
    }
}

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = params.slug;
    const blog = await getBlogMetadata(slug);

    if (!blog) {
        return {
            title: "Blog Not Found - Your Blog Name",
            description: "This blog does not exist.",
        };
    }

    return {
        title: `${blog.title} - Your Blog Name`,
        description: blog.excerpt || blog.content.slice(0, 150),
    };
}

export default function BlogPageWrapper({ params }: Props) {
    return <BlogPage slug={params.slug} />;
}
