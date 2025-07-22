import { Typography, Paper, Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        FinVision Dashboard
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Welcome to FinVision
        </Typography>
        <Typography variant="body1">
          Transform your Excel financial models into interactive web dashboards.
          Upload your financial templates and start analyzing your data with powerful
          visualization tools.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard; 