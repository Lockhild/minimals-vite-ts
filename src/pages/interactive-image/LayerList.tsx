import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import IconButton from '@mui/material/IconButton';
import { Trash2 } from 'lucide-react';
import type { CanvasElement } from './types';
import { getElementDisplayName } from './helpers';

interface LayerListProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  onElementSelect: (elementId: string | null) => void;
  onElementDelete: (elementId: string) => void;
}

export default function LayerList({
  elements,
  selectedElementId,
  onElementSelect,
  onElementDelete,
}: LayerListProps) {
  return (
    <Box
      sx={{
        height: 200,
        borderTop: '1px solid #ddd',
        backgroundColor: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
        Layers ({elements.length})
      </Typography>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {elements.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography color="text.secondary">
              No layers yet. Add text or hotspots to get started.
            </Typography>
          </Box>
        ) : (
          <List dense>
            {elements.map((element, index) => (
              <ListItem
                key={element.id}
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onElementDelete(element.id);
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={element.id === selectedElementId}
                  onClick={() => onElementSelect(element.id)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={getElementDisplayName(element)}
                    secondary={`Layer ${elements.length - index}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
