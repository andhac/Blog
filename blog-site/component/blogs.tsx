"use client";
import React from "react";
import { useGetBlogsQuery } from "@/services/api";
import { Container, Grid, Card, CardContent, Typography, Button, CircularProgress, Box } from "@mui/material";
import { format } from "date-fns";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  blogStatus: string;
  publishedAt: string;
  slug: string;
}

const Blogs = () => {
  const { data, isLoading } = useGetBlogsQuery();

  if (isLoading) {
    return (
        <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
        </Container>
    );
  }

  return (
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {data?.data?.map((blog: Blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog.id}>
                <Card
                    sx={{
                      background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                      borderRadius: "16px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": { transform: "translateY(-5px)", boxShadow: "0 12px 30px rgba(0,0,0,0.25)" },
                    }}
                >
                  <CardContent>

                    {/* Blog Title */}
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "#333", mb: 1 }}>
                      {blog.title}
                    </Typography>

                    {/* Blog Status */}
                    <Box
                        sx={{
                          display: "inline-block",
                          backgroundColor: blog.blogStatus === "Published" ? "#4CAF50" : "#FF9800",
                          color: "#fff",
                          px: 2,
                          py: 0.5,
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                        }}
                    >
                      {blog.blogStatus}
                    </Box>

                    {/* Published Date */}
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1, mb: 2 }}>
                      Published on: {format(new Date(blog.publishedAt), "PPPP")}
                    </Typography>

                    {/* Read More Button */}
                    <Link href={`/blogs/${blog.slug}`} passHref>
                      <Button
                          variant="contained"
                          sx={{
                            mt: 1,
                            backgroundColor: "#ff5722",
                            color: "white",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            px: 3,
                            py: 1,
                            textTransform: "none",
                            boxShadow: "0 4px 12px rgba(255, 87, 34, 0.3)",
                            "&:hover": {
                              backgroundColor: "#e64a19",
                              boxShadow: "0 6px 16px rgba(230, 74, 25, 0.4)",
                              transform: "scale(1.05)",
                            },
                          }}
                      >
                        Read More →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
          ))}
        </Grid>
      </Container>
  );
};

export default Blogs;
