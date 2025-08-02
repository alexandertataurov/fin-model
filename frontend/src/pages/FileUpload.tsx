import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  Snackbar,
  Tabs,
  Tab,
} from '@mui/material';
import { Upload, List } from 'lucide-react';
import FileUploadDropzone from '../components/FileUpload/FileUploadDropzone';
import FileList from '../components/FileUpload/FileList';
import { FileUploadResponse } from '../services/fileApi';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`file-upload-tabpanel-${index}`}
      aria-labelledby={`file-upload-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const FileUpload: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUploadComplete = (files: FileUploadResponse[]) => {
    const message =
      files.length === 1
        ? `File "${files[0].original_filename}" uploaded successfully!`
        : `${files.length} files uploaded successfully!`;

    setSnackbar({
      open: true,
      message,
      severity: 'success',
    });

    // Trigger refresh of file list
    setRefreshTrigger(prev => prev + 1);

    // Auto-switch to file list tab
    setActiveTab(1);
  };

  const handleUploadError = (error: string) => {
    setSnackbar({
      open: true,
      message: `Upload failed: ${error}`,
      severity: 'error',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          File Upload & Processing
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload Excel files to transform them into interactive financial
          models. Supported formats: .xlsx, .xls, .csv
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="file upload tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<Upload />}
            label="Upload Files"
            id="file-upload-tab-0"
            aria-controls="file-upload-tabpanel-0"
          />
          <Tab
            icon={<List />}
            label="Manage Files"
            id="file-upload-tab-1"
            aria-controls="file-upload-tabpanel-1"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Upload New Files
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select Excel or CSV files to upload and process. Files will be
                validated and parsed to extract financial data.
              </Typography>

              <FileUploadDropzone
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                maxFiles={5}
                maxSize={10 * 1024 * 1024} // 10MB
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Getting Started
              </Typography>
              <Typography variant="body2" paragraph>
                To get the best results from file processing:
              </Typography>
              <Box component="ol" sx={{ pl: 2 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <strong>Use structured Excel templates</strong> - Ensure
                    your financial statements have clear headers and organized
                    data
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <strong>
                      Include P&L, Balance Sheet, or Cash Flow data
                    </strong>{' '}
                    - The system automatically detects and validates financial
                    statement types
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <strong>Keep file sizes reasonable</strong> - Files up to
                    10MB are supported for optimal processing performance
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body2">
                    <strong>Review validation results</strong> - Check
                    processing logs to understand any issues or recommendations
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Paper sx={{ p: 3 }}>
          <FileList refreshTrigger={refreshTrigger} />
        </Paper>
      </TabPanel>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FileUpload;
