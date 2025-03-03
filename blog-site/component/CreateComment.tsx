import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateCommentMutation } from "@/services/api";
import { useAppSelector } from "@/store/store";

interface CreateCommentProps {
    onAddComment: (comment: string) => void;
    documentId: string; // Blog ID
}

// Validation schema
const schema = yup.object().shape({
    comment: yup
        .string()
        .trim()
        .min(3, "Comment must be at least 3 characters")
        .max(200, "Comment cannot exceed 200 characters")
        .required("Comment is required"),
});

const CreateComment: React.FC<CreateCommentProps> = ({ onAddComment, documentId }) => {
    const [createComment] = useCreateCommentMutation();


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<{ comment: string }>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: { comment: string }) => {
        try {
            const payload = {
                data: {
                    blog: documentId,
                    comment: data.comment,
                    users_permissions_user: null,
                    commentStatus: "pending"
                }
            };

            console.log("Submitting Comment:", payload);

            await createComment(payload); // Sending to backend

            onAddComment(data.comment);
            reset(); // Reset input field
        } catch (error) {
            console.error("Failed to submit comment", error);
        }
    };

    return (
        <Box component="form" display="flex" gap={2} alignItems="center" onSubmit={handleSubmit(onSubmit)}>
            <TextField
                label="Add a comment..."
                variant="outlined"
                fullWidth
                {...register("comment")}
                error={!!errors.comment}
                helperText={errors.comment?.message}
                sx={{ bgcolor: "#f9f9f9", borderRadius: "8px" }}
            />
            {/* Submit Button */}
            <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    sx={{ py: 1.2, px: 3, borderRadius: "8px" }}
                >
                    {isSubmitting ? "Posting..." : "Post"}
                </Button>
            </motion.div>
        </Box>
    );
};

export default CreateComment;
