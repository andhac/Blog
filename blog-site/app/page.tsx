"use client";
import Blogs from "@/component/blogs";
import { useAppSelector } from "@/store/store";
import { Button, Box, Typography, Container } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import Link from "next/link";

export default function Home() {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
                py: 4,
            }}
        >
            <Container maxWidth="lg">
                {/* Header Section */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    my={4}
                    sx={{ background: "#ffffffdd", p: 2, borderRadius: 2, boxShadow: 2 }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: "#333", textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}
                    >
                        🚀 Welcome to Blogify
                    </Typography>

                    {/* Create New Button (Only for Authenticated Users) */}
                    {isAuthenticated && (
                        <Link href="/create" passHref>
                            <Button
                                variant="contained"
                                startIcon={<AddCircleOutline />}
                                sx={{
                                    borderRadius: "10px",
                                    px: 3,
                                    py: 1,
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    backgroundColor: "#ff5722",
                                    color: "white",
                                    boxShadow: "0 4px 12px rgba(255, 87, 34, 0.3)",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": {
                                        backgroundColor: "#e64a19",
                                        boxShadow: "0 6px 16px rgba(230, 74, 25, 0.4)",
                                        transform: "translateY(-2px)",
                                    },
                                }}
                            >
                                Create New
                            </Button>
                        </Link>
                    )}
                </Box>
                <Blogs />
            </Container>
        </Box>
    );
}
