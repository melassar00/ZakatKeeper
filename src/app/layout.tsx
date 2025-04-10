"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    CssBaseline,
    ThemeProvider,
    createTheme,
    IconButton,
    Divider,
} from "@mui/material";
import { Home, Timeline, ChevronLeft, ChevronRight, CurrencyExchange } from "@mui/icons-material";
import { usePathname } from "next/navigation";
import { UserService } from "./services/users";
import { ZakatService } from "./services/zakat";
import { UserContextProvider, useUserContext } from "../../context/UserContext";
import { Zakat } from "../../types/zakat";

const expandedWidth = 240;
const collapsedWidth = 60;

// Create a light green theme
const theme = createTheme({
    palette: {
        primary: {
            main: "#3eb489", // light green main color
            light: "#3eb489", // light variant for backgrounds
            dark: "#2e8565", // dark variant for contrast
            contrastText: "#fff",
        },
        background: {
            default: "#f5f5f5", // overall light background for main content
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 16, // Softer global rounded corners
    },
    // Component-specific overrides:
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 12, // Rounded corners for buttons
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // Rounded corners for list items
                    margin: "4px 8px",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16, // Softer corners for cards (if used)
                },
            },
        },
    },
});

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(true);
    const pathname = usePathname();
    const { user, setUser } = useUserContext();

    // Sidebar navigation items with icons
    const navItems = [
        { label: "Home", href: "/", icon: <Home /> },
        { label: "History", href: "/history", icon: <Timeline /> },
    ];

    const toggleDrawer = () => {
        setOpen(!open);
    };

    React.useEffect(() => {
        if (!user) {
            ZakatService.getUserZakat("muhamad").then((result: Zakat) => {
                setUser(result);
            });
        }
    }, []);

    return (
        <html lang="en">
            <body>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Box sx={{ display: "flex" }}>
                        {/* Sidebar Drawer */}
                        <Drawer
                            variant="permanent"
                            sx={{
                                width: open ? expandedWidth : collapsedWidth,
                                flexShrink: 0,
                                "& .MuiDrawer-paper": {
                                    width: open ? expandedWidth : collapsedWidth,
                                    boxSizing: "border-box",
                                    background: theme.palette.primary.light,
                                    color: theme.palette.primary.contrastText,
                                    transition: "width 0.3s ease",
                                    overflowX: "hidden",
                                    boxShadow: "2px 0 10px rgba(0,0,0,0.08)",
                                    borderRight: "none",
                                },
                            }}
                        >
                            <Toolbar
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: open ? "space-between" : "center",
                                    px: [1],
                                }}
                            >
                                {/* Logo and Title */}
                                {open && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            px: [2],
                                        }}
                                    >
                                        <CurrencyExchange sx={{ marginRight: 1 }} />
                                        <Typography variant="h6" noWrap>
                                            ZakatKeeper
                                        </Typography>
                                    </Box>
                                )}

                                {/* Toggle Button */}
                                <IconButton onClick={toggleDrawer} sx={{ color: theme.palette.primary.contrastText }}>
                                    {open ? <ChevronLeft /> : <ChevronRight />}
                                </IconButton>
                            </Toolbar>
                            <Divider />
                            <List>
                                {navItems.map(({ label, href, icon }) => {
                                    // Check if this nav item is active based on the current pathname
                                    const active = pathname === href;
                                    return (
                                        <ListItem key={label} disablePadding sx={{ display: "block" }}>
                                            <ListItemButton
                                                component={Link}
                                                href={href}
                                                sx={{
                                                    minHeight: 48,
                                                    justifyContent: open ? "initial" : "center",
                                                    px: 2.5,
                                                    backgroundColor: active ? theme.palette.primary.dark : "inherit",
                                                    "&:hover": {
                                                        backgroundColor: active ? theme.palette.primary.dark : theme.palette.primary.light,
                                                    },
                                                }}
                                            >
                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: 0,
                                                        mr: open ? 3 : "auto",
                                                        justifyContent: "center",
                                                        color: theme.palette.primary.contrastText,
                                                    }}
                                                >
                                                    {icon}
                                                </ListItemIcon>
                                                {open && (
                                                    <ListItemText
                                                        primary={label}
                                                        sx={{
                                                            color: theme.palette.primary.contrastText,
                                                        }}
                                                    />
                                                )}
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Drawer>

                        {/* Main Content */}
                        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                            <Toolbar /> {/* Push content below Drawer Toolbar */}
                            {children}
                        </Box>
                    </Box>
                </ThemeProvider>
            </body>
        </html>
    );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <UserContextProvider>
            <Layout>{children}</Layout>
        </UserContextProvider>
    );
}
