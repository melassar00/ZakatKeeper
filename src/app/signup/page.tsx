"use client";

import { useState } from "react";
import { Container, Paper, Typography, TextField, Button, Box, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import { LoginService } from "../services/login";
import { redirect } from "next/navigation";

export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        const body = { name, userID: email, password };
        LoginService.signup(body).then((result: any) => {
            if (result.message.includes("success")) {
                redirect("/dashboard");
            }
        });
        // TODO: Add signup logic
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Create an Account
                </Typography>
                <Box component="form" onSubmit={handleSignUp}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        type="email"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Sign Up
                    </Button>
                </Box>

                <Box mt={2} textAlign="center">
                    <Typography variant="body2">
                        Already have an account?{" "}
                        <MuiLink component={Link} href="/login" underline="hover">
                            Login
                        </MuiLink>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}
