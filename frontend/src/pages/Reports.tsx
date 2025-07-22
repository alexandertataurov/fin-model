import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Description as ReportIcon,
  Schedule as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  GetApp as ExportIcon,
  Visibility as PreviewIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';

// Types
interface ReportTemplate {
  id: number;
  name: string;
  description?: string;
  report_type: string;
  is_system: boolean;
  is_active: boolean;
  template_config?: any;
  branding_config?: any;
  created_at: string;
  updated_at?: string;
}

interface ReportExport {
  id: number;
  name: string;
  export_format: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  file_path?: string;
  file_size?: number;
  processing_duration_seconds?: number;
  error_message?: string;
  created_at: string;
  expires_at?: string;
}

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
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Reports: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    report_type: 'FINANCIAL_SUMMARY',
    export_format: 'PDF',
    source_file_ids: [] as number[],
    custom_config: {}
  });

  const queryClient = useQueryClient();

  // Fetch report templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['report-templates'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/reports/templates');
      return response.data;
    }
  });

  // Fetch report exports
  const { data: exports, isLoading: exportsLoading } = useQuery({
    queryKey: ['report-exports'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/reports/exports?limit=50');
      return response.data;
    }
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      const response = await axios.post('/api/v1/reports/templates', templateData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-templates'] });
      setTemplateDialogOpen(false);
      resetFormData();
    }
  });

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: async (reportData: any) => {
      const response = await axios.post('/api/v1/reports/generate', reportData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-exports'] });
      setGenerateDialogOpen(false);
      resetFormData();
    }
  });

  // Delete export mutation
  const deleteExportMutation = useMutation({
    mutationFn: async (exportId: number) => {
      await axios.delete(`/api/v1/reports/exports/${exportId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-exports'] });
    }
  });

  const resetFormData = () => {
    setFormData({
      name: '',
      description: '',
      report_type: 'FINANCIAL_SUMMARY',
      export_format: 'PDF',
      source_file_ids: [],
      custom_config: {}
    });
    setSelectedTemplate(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFormChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCreateTemplate = () => {
    createTemplateMutation.mutate({
      name: formData.name,
      description: formData.description,
      report_type: formData.report_type,
      template_config: formData.custom_config
    });
  };

  const handleGenerateReport = () => {
    generateReportMutation.mutate({
      template_id: selectedTemplate?.id,
      export_format: formData.export_format,
      name: formData.name || `Report_${new Date().toISOString().split('T')[0]}`,
      source_file_ids: formData.source_file_ids,
      custom_config: formData.custom_config
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PROCESSING':
      case 'PENDING':
        return 'warning';
      case 'FAILED':
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reports & Export
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate financial reports, manage templates, and export data
        </Typography>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Generate Reports" icon={<ReportIcon />} iconPosition="start" />
        <Tab label="Templates" icon={<EditIcon />} iconPosition="start" />
        <Tab label="Export History" icon={<DownloadIcon />} iconPosition="start" />
      </Tabs>

      {/* Generate Reports Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader 
                title="Quick Report Generation"
                action={
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setGenerateDialogOpen(true)}
                  >
                    Generate Report
                  </Button>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Select a template and generate a comprehensive financial report.
                  Reports include charts, tables, and key metrics.
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Available Report Types
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      { type: 'FINANCIAL_SUMMARY', name: 'Financial Summary', desc: 'Complete overview' },
                      { type: 'PROFIT_LOSS', name: 'P&L Report', desc: 'Revenue and expenses' },
                      { type: 'BALANCE_SHEET', name: 'Balance Sheet', desc: 'Assets and liabilities' },
                      { type: 'CASH_FLOW', name: 'Cash Flow', desc: 'Cash movement analysis' }
                    ].map((reportType) => (
                      <Grid item xs={12} sm={6} key={reportType.type}>
                        <Paper 
                          sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, report_type: reportType.type }));
                            setGenerateDialogOpen(true);
                          }}
                        >
                          <Typography variant="subtitle2">{reportType.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {reportType.desc}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Export Options" />
              <CardContent>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Export charts and data in various formats for presentations and analysis.
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Supported Formats
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="PDF Reports"
                        secondary="Professional reports with charts and tables"
                      />
                      <Chip label="Most Popular" size="small" color="primary" />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Excel Workbooks"
                        secondary="Interactive spreadsheets with formulas"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="CSV Data"
                        secondary="Raw data for further analysis"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Chart Images"
                        secondary="PNG/SVG charts for presentations"
                      />
                    </ListItem>
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Templates Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Report Templates</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setTemplateDialogOpen(true)}
          >
            Create Template
          </Button>
        </Box>

        {templatesLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {templates?.map((template: ReportTemplate) => (
              <Grid item xs={12} md={6} lg={4} key={template.id}>
                <Card>
                  <CardHeader
                    title={template.name}
                    subheader={template.is_system ? 'System Template' : 'Custom Template'}
                    action={
                      <Box>
                        <Tooltip title="Generate Report">
                          <IconButton
                            onClick={() => {
                              setSelectedTemplate(template);
                              setGenerateDialogOpen(true);
                            }}
                          >
                            <ExportIcon />
                          </IconButton>
                        </Tooltip>
                        {!template.is_system && (
                          <Tooltip title="Edit Template">
                            <IconButton>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    }
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {template.description || 'No description available'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={template.report_type.replace('_', ' ')} 
                        size="small" 
                        variant="outlined" 
                      />
                      {template.is_system && (
                        <Chip label="System" size="small" color="primary" />
                      )}
                      {template.is_active && (
                        <Chip label="Active" size="small" color="success" />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Export History Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Export History</Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => queryClient.invalidateQueries({ queryKey: ['report-exports'] })}
          >
            Refresh
          </Button>
        </Box>

        {exportsLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Format</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>File Size</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exports?.map((exportItem: ReportExport) => (
                  <TableRow key={exportItem.id}>
                    <TableCell>{exportItem.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={exportItem.export_format} 
                        size="small" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={exportItem.status} 
                          size="small" 
                          color={getStatusColor(exportItem.status) as any}
                        />
                        {exportItem.status === 'PROCESSING' && (
                          <CircularProgress size={16} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{formatFileSize(exportItem.file_size)}</TableCell>
                    <TableCell>
                      {new Date(exportItem.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {exportItem.processing_duration_seconds 
                        ? `${exportItem.processing_duration_seconds}s` 
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {exportItem.status === 'COMPLETED' && exportItem.file_path && (
                          <Tooltip title="Download">
                            <IconButton size="small">
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => deleteExportMutation.mutate(exportItem.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* Generate Report Dialog */}
      <Dialog 
        open={generateDialogOpen} 
        onClose={() => setGenerateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Generate Report</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Report Name"
              value={formData.name}
              onChange={handleFormChange('name')}
              fullWidth
              placeholder="Enter report name"
            />
            
            <FormControl fullWidth>
              <InputLabel>Export Format</InputLabel>
              <Select
                value={formData.export_format}
                onChange={handleFormChange('export_format')}
                label="Export Format"
              >
                <MenuItem value="PDF">PDF Report</MenuItem>
                <MenuItem value="EXCEL">Excel Workbook</MenuItem>
                <MenuItem value="CSV">CSV Data</MenuItem>
              </Select>
            </FormControl>

            {selectedTemplate && (
              <Alert severity="info">
                Using template: <strong>{selectedTemplate.name}</strong>
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleGenerateReport}
            disabled={generateReportMutation.isPending}
          >
            {generateReportMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              'Generate'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Template Dialog */}
      <Dialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Report Template</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Template Name"
              value={formData.name}
              onChange={handleFormChange('name')}
              fullWidth
              required
            />
            
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleFormChange('description')}
              fullWidth
              multiline
              rows={3}
            />
            
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={formData.report_type}
                onChange={handleFormChange('report_type')}
                label="Report Type"
              >
                <MenuItem value="FINANCIAL_SUMMARY">Financial Summary</MenuItem>
                <MenuItem value="PROFIT_LOSS">Profit & Loss</MenuItem>
                <MenuItem value="BALANCE_SHEET">Balance Sheet</MenuItem>
                <MenuItem value="CASH_FLOW">Cash Flow</MenuItem>
                <MenuItem value="CUSTOM">Custom</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateTemplate}
            disabled={createTemplateMutation.isPending || !formData.name}
          >
            {createTemplateMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              'Create'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Reports; 