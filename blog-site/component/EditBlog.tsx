"use client";

import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {Box, Button, TextField, Typography, Card} from "@mui/material";
import {motion} from "framer-motion";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {toast} from "react-toastify";
import {useRouter, useParams} from "next/navigation";
import {useGetBlogByIdQuery, useEditBlogMutation} from "@/services/api";
import {useAppSelector} from "@/store/store";


const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    content: yup.string().required("Content is required"),
});

const EditBlog = () => {
    const router = useRouter();
    const {documentId} = useParams();
    const[editBlog] = useEditBlogMutation();

    const {isAuthenticated} = useAppSelector((state) => state.auth);
    // @ts-ignore
    const {data: blogData, isLoading} = useGetBlogByIdQuery(documentId); // Fetch blog data
    // const [updateBlog] = useUpdateBlogMutation();
    const {register, handleSubmit, setValue, watch, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
        if (blogData) {
            setValue("title", blogData?.data[0].title);
            setValue("content", blogData?.data[0].content);
        }
    }, [isAuthenticated, blogData]);


    const onSubmit = async (data: any) => {
        try {
        const updateBlog = {
            data: { ...data},
        }
            console.log(updateBlog)
        await editBlog({data:updateBlog, id:documentId}).unwrap()
           toast.success("Blog updated successfully.");
        router.push("/profile");

        } catch (err: any) {
            const error = err.data?.message || "Failed to update blog";
            toast.error(error);
        }
    }

    // const onSubmit = async (data: any) => {
    //     try {
    //         const updatedBlog = {
    //             id,
    //             data: { ...data},
    //         };
    //
    //         await updateBlog(updatedBlog).unwrap();
    //         toast.success("Blog updated successfully");
    //         router.push("/");
    //     } catch (err: any) {
    //         const error = err.data?.message || "Failed to update blog";
    //         toast.error(error);
    //     }
    // };

    if (isLoading) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)"
        }}>
            <motion.div initial={{opacity: 0, y: 30}} animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, ease: "easeOut"}}>
                <Card sx={{
                    p: 4,
                    width: "500px",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    background: "#fff"
                }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{fontWeight: "bold", color: "#333"}}>
                        Edit Blog
                    </Typography>

                    <Box component="form" sx={{mt: 3}} onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            {...register("title")}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            sx={{mb: 2, bgcolor: "#f9f9f9", borderRadius: "8px"}}
                        />

                        <TextField
                            label="Content"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={6}
                            {...register("content")}
                            error={!!errors.content}
                            helperText={errors.content?.message}
                            sx={{mb: 2, bgcolor: "#f9f9f9", borderRadius: "8px"}}
                        />

                        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                            <Button type="submit" variant="contained" color="primary" fullWidth
                                    sx={{py: 1.5, fontSize: "16px", borderRadius: "8px"}}>
                                Update Blog
                            </Button>
                        </motion.div>
                    </Box>
                </Card>
            </motion.div>
        </Box>
    );
};

export default EditBlog;
