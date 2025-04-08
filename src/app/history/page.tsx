"use client";

import { Container, Typography } from "@mui/material";

export default function HistoryPage() {
	return (
		<Container maxWidth="md" sx={{ mt: 4 }}>
			<Typography variant="h4" gutterBottom>
				Zakat History
			</Typography>
			<Typography>Detailed records of your previous years' Zakat payments will be shown here.</Typography>
		</Container>
	);
}
