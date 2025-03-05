"use client"
import {
    Avatar,
    Box, Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip, CircularProgress,
    Grid,
    Paper,
    Typography
} from "@mui/material";
import {EditIcon} from "lucide-react";
import {useMeQuery} from "@/services/api";
import React from "react";
import {useRouter} from "next/navigation";

export default function ProfilePage() {
    const {data, isLoading} = useMeQuery()

const router = useRouter();
    // @ts-ignore
    const removeDuplicateBlog = data?.blogs.filter((blog: { documentId: any; }, index: any, self: any[]) =>
            index === self.findIndex((t) => (
                t.documentId === blog.documentId
            ))
    )
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress/>
            </Box>
        );
    }
    const getStatusChipColor = (status: string) => {
        switch (status) {
            case "approved":
                return "success"
            case "pending":
                return "warning"
            case "rejected":
                return "error"
            default:
                return "default"
        }
    }
    return (

        <Box maxWidth="full" sx={{py: 4, mx: 5}}>
            <Paper elevation={2} sx={{p: 3, mb: 4, bgcolor: "#F8F9FA"}}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', md: 'row'},
                    alignItems: {xs: "center", md: "center"},
                    gap: 3
                }}
                >
                    <Avatar sx={{
                        width: {xs: 80, md: 100},
                        height: {xs: 80, md: 100},
                        fontSize: {xs: 36, md: 42},
                        bgcolor: "primary.main",
                    }}>
                        {data?.username.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box sx={{
                        textAlign: {xs: "center", md: "left"},
                        width: "100%"
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: {xs: 'column', md: 'row'},
                            alignItems: {xs: "center", md: "baseline"},
                            gap: {xs: 0.5, md: 2}
                        }}>
                            <Typography variant="h4" component="h1" fontWeight="bold">
                                {data?.username}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary">
                                {data?.email}
                            </Typography>
                        </Box>
                        <Typography variant="subtitle2" color="textSecondary" sx={{mt: 1}}>
                            Content Creator & Tech Enthusiast
                        </Typography>
                        <Box sx={{
                            display: "flex",
                            gap: 1,
                            mt: 2,
                            justifyContent: {xs: "center", md: "flex-start"},
                            flexWrap: "wrap"
                        }}>
                            <Chip label={`${removeDuplicateBlog.length} Blogs`} variant="outlined" size="small"/>
                            <Chip label={`Joined ${new Date(data?.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short"
                            })}`} variant="outlined" size="small"/>
                        </Box>

                    </Box>
                </Box>
            </Paper>
            <Box sx={{mb: 4}}>
                <Typography variant="h5" component="h2" fontWeight="bold" sx={{mb: 3}}>
                    Your Blogs
                </Typography>
                <Grid container spacing={5}>
                    {removeDuplicateBlog.map((blog: BlogPost) => (
                        <Grid item xs={12} md={6} lg={3} key={blog.id}>
                            <Card sx={{display: "flex", flexDirection: "column", height: "100%", bgcolor: "#F8F9FA"}}>
                                <CardHeader
                                    title={blog.title}
                                    subheader={new Date(blog.createdAt).toISOString().split("T")[0]}
                                    action={
                                        <Chip
                                            label={blog.blogStatus.charAt(0).toUpperCase() + blog.blogStatus.slice(1)}
                                            color={getStatusChipColor(blog.blogStatus) as "success" | "warning" | "error" | "default"}
                                            size="small"
                                        />
                                    }
                                />
                                <CardContent sx={{flexGrow: 1}}>
                                    <Typography variant="body2" color="textSecondary" sx={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden"
                                    }}>
                                        {blog.content}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{justifyContent: "flex-end"}}>
                                    <Button size="small" variant="outlined" startIcon={<EditIcon/>}
                                            onClick={() => router.push(`/profile/edit/${blog.documentId}`)}>
                                        Edit
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>

                    ))}
                </Grid>
            </Box>

            {
                data?.blogs.length === 0 && (
                    <Box sx={{textAlign: "center", py: 6}}>
                        <Typography color="text.secondary">You haven't created any blogs yet.</Typography>
                        <Button variant="contained" sx={{mt: 2}}>
                            Create Your First Blog
                        </Button>
                    </Box>
                )
            }

        </Box>

    )
}