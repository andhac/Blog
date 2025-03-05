"use client";

import {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, Typography, Card } from "@mui/material";
import { motion } from "framer-motion";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {useMeQuery, usePostBlogMutation} from "@/services/api";
import {useAppSelector} from "@/store/store";
import {useRouter} from "next/navigation";

// ✅ Validation Schema
const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    content: yup.string().required("Content is required"),
});

const CreateBlogs = () => {
    const router = useRouter();

    const {isAuthenticated} = useAppSelector((state) => state.auth)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    },[isAuthenticated])
    const {data} = useMeQuery()
    const [postBlog] = usePostBlogMutation()
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [slug, setSlug] = useState("");

    //@ts-ignore
    const author = data?.id
    // ✅ Auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setValue("title", title);
        setSlug(title
            .toLowerCase()
            .replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(7));
    };


    const onSubmit =  async (data: any) => {
        try{
            const blogData = {
            data:{...data, author, slug}
        };

            // @ts-ignore
            await postBlog(blogData).unwrap()
            toast.success("Blog created successfully")
            router.push('/')
        }catch (err:any){
            const error = err.data.message[0].messages[0].message
            toast.error(error)
        }
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)" }}>
            {/* Animated Form Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <Card sx={{ p: 4, width: "500px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", background: "#fff" }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
                        Create a New Blog
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                        {/* ✅ Title Field */}
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            {...register("title")}
                            onChange={handleTitleChange}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            sx={{ mb: 2, bgcolor: "#f9f9f9", borderRadius: "8px" }}
                        />

                        {/* ✅ Slug Display (Read-Only) */}
                        <TextField
                            label="Slug"
                            variant="outlined"
                            fullWidth
                            value={slug}
                            disabled
                            sx={{ mb: 2, bgcolor: "#f1f1f1", borderRadius: "8px" }}
                        />

                        {/* ✅ Content Field */}
                        <TextField
                            label="Content"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={6}
                            {...register("content")}
                            error={!!errors.content}
                            helperText={errors.content?.message}
                            sx={{ mb: 2, bgcolor: "#f9f9f9", borderRadius: "8px" }}
                        />

                        {/* ✅ Animated Submit Button */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5, fontSize: "16px", borderRadius: "8px" }}>
                                Publish Blog
                            </Button>
                        </motion.div>
                    </Box>
                </Card>
            </motion.div>
        </Box>
    );
};

export default CreateBlogs;
