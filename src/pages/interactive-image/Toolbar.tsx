import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { MousePointer, Type, MapPin } from 'lucide-react';
import type { CanvasState } from './types';
import { ZOOM_LEVELS } from './types';

interface ToolbarProps {
  currentTool: CanvasState['currentTool'];
  zoom: number;
  onToolChange: (tool: CanvasState['currentTool']) => void;
  onZoomChange: (zoom: number) => void;
}

export default function Toolbar({ currentTool, zoom, onToolChange, onZoomChange }: ToolbarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        borderBottom: '1px solid #ddd',
        backgroundColor: '#f5f5f5',
      }}
    >
      <ButtonGroup variant="outlined" size="small">
        <Button
          onClick={() => onToolChange('select')}
          variant={currentTool === 'select' ? 'contained' : 'outlined'}
          startIcon={<MousePointer size={16} />}
        >
          Select
        </Button>
        <Button
          onClick={() => onToolChange('text')}
          variant={currentTool === 'text' ? 'contained' : 'outlined'}
          startIcon={<Type size={16} />}
        >
          Text
        </Button>
        <Button
          onClick={() => onToolChange('hotspot')}
          variant={currentTool === 'hotspot' ? 'contained' : 'outlined'}
          startIcon={<MapPin size={16} />}
        >
          Hotspot
        </Button>
      </ButtonGroup>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Zoom</InputLabel>
        <Select value={zoom} label="Zoom" onChange={(e) => onZoomChange(e.target.value as number)}>
          {ZOOM_LEVELS.map((level) => (
            <MenuItem key={level} value={level}>
              {Math.round(level * 100)}%
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
