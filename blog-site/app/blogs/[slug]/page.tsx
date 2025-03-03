"use client";
import React, { useEffect, useState } from "react";
import { useGetSingleBlogQuery } from "@/services/api";
import { notFound, useParams } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CreateComment from "@/component/CreateComment"; // Import CreateComment

const BlogPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const { data, error, isLoading } = useGetSingleBlogQuery(slug);
  const documentId = data?.data[0].documentId;
  const [liked, setLiked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [comments, setComments] = useState<string[]>([]); // State to store comments

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  if (isLoading) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
    );
  }

  if (error || !data?.data?.length) return notFound();

  const blog = data.data[0];

  // Handle new comment submission
  const handleAddComment = (newComment: string) => {
    setComments([...comments, newComment]);
  };

  return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="linear-gradient(135deg, #f0f4f8, #d9e2ec)">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card sx={{ maxWidth: 700, p: 2, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
            <CardContent>
              {/* Blog Title */}
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {blog.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Published on {new Date(blog.createdAt).toLocaleDateString()}
              </Typography>

              {/* Blog Cover Image */}
              {blog.coverImage && (
                  <motion.img
                      src={blog.coverImage.url}
                      alt={blog.title}
                      className="w-full h-64 object-cover rounded-lg my-4 shadow-lg"
                      initial={{ opacity: 0.6, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                  />
              )}

              {/* Blog Content */}
              <Typography variant="body1" color="textPrimary" sx={{ mt: 2, textAlign: "justify", lineHeight: 1.6 }}>
                {blog.content}
              </Typography>

              {/* Like & Share Buttons */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                {/* Like Button */}
                <motion.div whileTap={{ scale: 0.9 }}>
                  <IconButton
                      onClick={() => setLiked(!liked)}
                      sx={{ color: liked ? "red" : "gray", transition: "0.3s" }}
                  >
                    {liked ? <FaHeart /> : <FaRegHeart />}
                  </IconButton>
                </motion.div>

                {/* Share Button */}
                <motion.div whileTap={{ scale: 0.9 }}>
                  <IconButton
                      onClick={() =>
                          navigator.share({ title: blog.title, url: window.location.href })
                      }
                      sx={{ color: "gray", transition: "0.3s" }}
                  >
                    <FaShareAlt />
                  </IconButton>
                </motion.div>
              </Box>

              {/* Comment Section */}
              <Box mt={4}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Comments
                </Typography>

                {/* Comment Input Field */}
                <CreateComment onAddComment={handleAddComment} documentId={documentId} />

                {/* Display Comments */}
                {comments.length > 0 && (
                    <List sx={{ mt: 2 }}>
                      {comments.map((cmt, index) => (
                          <ListItem key={index} sx={{ bgcolor: "#f1f1f1", my: 1, borderRadius: "8px", px: 2 }}>
                            <ListItemText primary={cmt} />
                          </ListItem>
                      ))}
                    </List>
                )}
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
  );
};

export default BlogPage;
