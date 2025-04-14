"use client";

import { useState } from "react";
import { Container, Box, Typography, TextField, Button, Paper, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import { LoginService } from "../services/login";
import { redirect } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = { userID: email, password };

        LoginService.login(body).then((result: any) => {
            if (result.message.includes("success")) {
                redirect("/dashboard");
            }
        });
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Sign In
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
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
                        Login
                    </Button>
                </Box>

                <Box mt={2} textAlign="center">
                    <Typography variant="body2">
                        Don&apos;t have an account?{" "}
                        <MuiLink component={Link} href="/signup" underline="hover">
                            Sign up
                        </MuiLink>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}
