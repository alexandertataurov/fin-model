import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Help as HelpIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  PlayCircle as VideoIcon,
  Article as ArticleIcon,
  School as TutorialIcon,
  ContactSupport as ContactIcon,
  Close as CloseIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';

interface HelpItem {
  id: string;
  title: string;
  content: string;
  category: 'faq' | 'tutorial' | 'guide' | 'troubleshooting';
  tags: string[];
  type: 'text' | 'video' | 'link';
  url?: string;
}

const helpContent: HelpItem[] = [
  {
    id: '1',
    title: 'How to upload financial models',
    content: 'Learn how to upload Excel financial models to FinVision and start creating interactive dashboards.',
    category: 'tutorial',
    tags: ['upload', 'excel', 'getting-started'],
    type: 'text',
  },
  {
    id: '2',
    title: 'Understanding P&L Dashboard',
    content: 'Explore the features of the Profit & Loss dashboard including key metrics, charts, and analysis tools.',
    category: 'guide',
    tags: ['dashboard', 'pl', 'metrics'],
    type: 'text',
  },
  {
    id: '3',
    title: 'Creating Custom Reports',
    content: 'Step-by-step guide to creating custom financial reports using FinVision report builder.',
    category: 'tutorial',
    tags: ['reports', 'custom', 'builder'],
    type: 'text',
  },
  {
    id: '4',
    title: 'Troubleshooting File Upload Issues',
    content: 'Common issues when uploading files and how to resolve them.',
    category: 'troubleshooting',
    tags: ['upload', 'error', 'troubleshooting'],
    type: 'text',
  },
  {
    id: '5',
    title: 'Scenario Modeling Walkthrough',
    content: 'Complete video tutorial on using scenario modeling features.',
    category: 'tutorial',
    tags: ['scenarios', 'modeling', 'video'],
    type: 'video',
    url: '#',
  },
];

interface HelpCenterProps {
  open: boolean;
  onClose: () => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  const filteredContent = helpContent.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = activeTab === 0 || // All
      (activeTab === 1 && item.category === 'faq') ||
      (activeTab === 2 && item.category === 'tutorial') ||
      (activeTab === 3 && item.category === 'guide') ||
      (activeTab === 4 && item.category === 'troubleshooting');
    
    return matchesSearch && matchesTab;
  });

  const handleAccordionChange = (panel: string) => (
    _: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const getItemIcon = (item: HelpItem) => {
    switch (item.type) {
      case 'video':
        return <VideoIcon color="primary" />;
      case 'link':
        return <LaunchIcon color="primary" />;
      default:
        return <ArticleIcon color="primary" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'faq':
        return 'primary';
      case 'tutorial':
        return 'success';
      case 'guide':
        return 'info';
      case 'troubleshooting':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderContent = () => {
    if (filteredContent.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No content found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search terms or browse different categories.
          </Typography>
        </Box>
      );
    }

    return filteredContent.map((item) => (
      <Accordion
        key={item.id}
        expanded={expandedAccordion === item.id}
        onChange={handleAccordionChange(item.id)}
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            {getItemIcon(item)}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {item.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                <Chip 
                  label={item.category} 
                  size="small" 
                  color={getCategoryColor(item.category) as any}
                  variant="outlined"
                />
                {item.tags.slice(0, 2).map(tag => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" paragraph>
            {item.content}
          </Typography>
          
          {item.type === 'video' && (
            <Button
              startIcon={<VideoIcon />}
              variant="outlined"
              href={item.url}
              target="_blank"
              sx={{ mt: 1 }}
            >
              Watch Video
            </Button>
          )}
          
          {item.type === 'link' && (
            <Button
              startIcon={<LaunchIcon />}
              variant="outlined"
              href={item.url}
              target="_blank"
              sx={{ mt: 1 }}
            >
              Open Link
            </Button>
          )}

          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {item.tags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                clickable
                onClick={() => setSearchTerm(tag)}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    ));
  };

  const contactSupport = () => {
    // This would typically open a support form or redirect to support email
    window.open('mailto:support@finvision.com?subject=FinVision Support Request', '_blank');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HelpIcon color="primary" />
          <Typography variant="h6">Help Center</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ px: 3, pt: 2, pb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search help articles, tutorials, and guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All" />
          <Tab label="FAQ" />
          <Tab label="Tutorials" />
          <Tab label="Guides" />
          <Tab label="Troubleshooting" />
        </Tabs>

        <Box sx={{ p: 3, height: 'calc(100% - 120px)', overflow: 'auto' }}>
          {renderContent()}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Paper sx={{ flex: 1, p: 2, backgroundColor: 'grey.50' }}>
          <Typography variant="subtitle2" gutterBottom>
            Need more help?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Can't find what you're looking for? Contact our support team.
          </Typography>
          <Button
            startIcon={<ContactIcon />}
            variant="outlined"
            size="small"
            onClick={contactSupport}
          >
            Contact Support
          </Button>
        </Paper>
      </DialogActions>
    </Dialog>
  );
};

// Help Button Component for easy integration
export interface HelpButtonProps {
  tooltip?: string;
  size?: 'small' | 'medium' | 'large';
}

export const HelpButton: React.FC<HelpButtonProps> = ({ 
  tooltip = 'Help & Documentation',
  size = 'medium' 
}) => {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <Tooltip title={tooltip}>
        <IconButton
          onClick={() => setHelpOpen(true)}
          size={size}
          color="inherit"
        >
          <HelpIcon />
        </IconButton>
      </Tooltip>
      
      <HelpCenter open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
};

export default HelpCenter; 