"use client";

import { Container, Typography, Card, CardContent, Button, Box } from "@mui/material";

export default function HomePage() {
	// Example data: you can later replace this with dynamic data or API calls
	const currentYear = new Date().getFullYear();
	const currentZakat = 650; // Replace with your calculated logic

	const handleAddZakat = () => {
		// Placeholder for your add/update logic
		alert("Add or update today's Zakat record!");
	};

	return (
		<Container maxWidth="md" sx={{ mt: 4 }}>
			<Typography variant="h4" gutterBottom>
				Welcome to ZakatKeeper
			</Typography>
			<Card sx={{ mb: 4 }}>
				<CardContent>
					<Typography variant="h6">Zakat Due for {currentYear}:</Typography>
					<Typography variant="h4" color="primary">
						${currentZakat}
					</Typography>
					<Box mt={2}>
						<Button variant="contained" color="primary" onClick={handleAddZakat}>
							Add/Update This Year's Zakat
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Container>
	);
}
