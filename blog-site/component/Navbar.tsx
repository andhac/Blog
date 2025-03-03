"use client"; // ✅ Ensure it runs only on the client

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { useMeQuery } from "@/services/api";
import { useAppSelector } from "@/store/store";
import Authenticated from "@/component/Authenticated";

const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
];

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const { data } = useMeQuery();

    // ✅ Ensure component is mounted before animations run
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: "background.paper" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                    {/* Logo */}
                    {mounted && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Typography variant="h6" fontWeight="bold">
                                Blogify
                            </Typography>
                        </motion.div>
                    )}

                    {/* Desktop Navigation */}
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        {navItems.map((item, index) => (
                            mounted && (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Button component="a" href={item.href} sx={{ color: "text.primary" }}>
                                        {item.name}
                                    </Button>
                                </motion.div>
                            )
                        ))}

                        {/* Authentication Button */}
                        {mounted && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                {isAuthenticated ? (
                                    <Authenticated /> // ✅ Ensure it's only rendered on the client
                                ) : (
                                    <Link href="/login" passHref>
                                        <Button variant="contained" color="primary" sx={{ borderRadius: "24px", px: 3 }}>
                                            Get Started
                                        </Button>
                                    </Link>
                                )}
                            </motion.div>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
