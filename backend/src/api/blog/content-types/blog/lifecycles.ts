export default {
    async beforeUpdate(event: any) {
        const { params } = event;
        const blogId = params.where.id;

        if (!blogId) return;

        // Fetch the existing blog data before updating
        const existingBlog = await strapi.entityService.findOne("api::blog.blog", blogId, {
            fields: ["title", "content"], // Fetch only necessary fields
        });

        if (existingBlog) {
            // Save the old version in the blog_versions collection
            await strapi.entityService.create("api::blog-version.blog-version", {
                data: {
                    blog: blogId,
                    title: existingBlog.title,
                    content: existingBlog.content,
                },
            });
        }
    },
};
