import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";

function Report() {
  const [reportId, setReportId] = useState("");
  const [reportContent, setReportContent] = useState({ name: "", description: "", notFound: false });
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchReport = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/reports/${reportId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 404) {
        setReportContent({ name: "", description: "", notFound: true });
      } else if (response.ok) {
        const data = await response.json();
        setReportContent({ name: data.name, description: data.description, notFound: false });
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      setReportContent({ name: "", description: "", notFound: true });
    }
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Insert ID to search for reports:
      </Typography>
      <TextField
        label="Report ID"
        variant="outlined"
        value={reportId}
        onChange={(e) => setReportId(e.target.value)}
        sx={{ marginBottom: 2, width: '100%' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={fetchReport}
        sx={{ marginBottom: 2 }}
      >
        Search
      </Button>
      <Box sx={{ marginTop: 2 }}>
        {reportContent.notFound ? (
          <Typography variant="body1">Report not found</Typography>
        ) : reportContent.name !== "" && reportContent.description !== "" ?(
          <>
            <Typography variant="body1"><strong>Name:</strong> {reportContent.name}</Typography>
            <Typography variant="body1"><strong>Description:</strong> {reportContent.description}</Typography>
          </>
        ) : (
          <>
            <Typography variant="body1">Search Your Report</Typography>
          </>
        )
        }
      </Box>
    </Container>
  );
}

export default Report;
