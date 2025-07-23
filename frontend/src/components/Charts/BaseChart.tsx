import React, { useState } from 'react';
import { Box, Paper, Typography, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import { Download as DownloadIcon, Fullscreen as FullscreenIcon } from '@mui/icons-material';

interface BaseChartProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: number;
  loading?: boolean;
  error?: string;
  onExport?: (format?: 'PNG' | 'SVG' | 'PDF') => void;
  onFullscreen?: () => void;
  actions?: React.ReactNode;
}

export const BaseChart: React.FC<BaseChartProps> = ({
  title,
  subtitle,
  children,
  height = 400,
  loading = false,
  error,
  onExport,
  onFullscreen,
  actions,
}) => {
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        height: 'fit-content',
        position: 'relative',
        '&:hover .chart-actions': {
          opacity: 1,
        },
      }}
    >
      {/* Header */}
      {(title || subtitle || onExport || onFullscreen || actions) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box>
            {title && (
              <Typography variant="h6" component="h3" gutterBottom>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          
          <Box
            className="chart-actions"
            sx={{
              display: 'flex',
              gap: 1,
              opacity: 0.7,
              transition: 'opacity 0.2s ease-in-out',
            }}
          >
            {actions}
            {onExport && (
              <>
                <Tooltip title="Export Chart">
                  <IconButton 
                    size="small" 
                    onClick={(e) => setExportMenuAnchor(e.currentTarget)}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={exportMenuAnchor}
                  open={Boolean(exportMenuAnchor)}
                  onClose={() => setExportMenuAnchor(null)}
                >
                  <MenuItem onClick={() => {
                    onExport('PNG');
                    setExportMenuAnchor(null);
                  }}>
                    Export as PNG
                  </MenuItem>
                  <MenuItem onClick={() => {
                    onExport('SVG');
                    setExportMenuAnchor(null);
                  }}>
                    Export as SVG
                  </MenuItem>
                  <MenuItem onClick={() => {
                    onExport('PDF');
                    setExportMenuAnchor(null);
                  }}>
                    Export as PDF
                  </MenuItem>
                </Menu>
              </>
            )}
            {onFullscreen && (
              <Tooltip title="Fullscreen">
                <IconButton size="small" onClick={onFullscreen}>
                  <FullscreenIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      )}

      {/* Chart Content */}
      <Box
        sx={{
          height,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Loading chart data...
            </Typography>
          </Box>
        )}
        
        {error && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'error.main',
            }}
          >
            <Typography variant="body2">
              Error loading chart: {error}
            </Typography>
          </Box>
        )}
        
        {!loading && !error && children}
      </Box>
    </Paper>
  );
};

export default BaseChart; 