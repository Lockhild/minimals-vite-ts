import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import type { CanvasElement, TextElement, HotspotElement } from './types';
import { FONT_SIZES, HOTSPOT_ICONS } from './types';
import ColorPicker from './ColorPicker';

interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void;
}

export default function PropertiesPanel({
  selectedElement,
  onElementUpdate,
}: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Properties
        </Typography>
        <Typography color="text.secondary">Select an element to edit its properties</Typography>
      </Box>
    );
  }

  const handleUpdate = (updates: Partial<CanvasElement>) => {
    onElementUpdate(selectedElement.id, updates);
  };

  const renderTextProperties = (element: TextElement) => (
    <>
      <TextField
        label="Content"
        value={element.content}
        onChange={(e) => handleUpdate({ content: e.target.value })}
        fullWidth
        margin="normal"
        size="small"
      />

      <FormControl fullWidth margin="normal" size="small">
        <InputLabel>Font Size</InputLabel>
        <Select
          value={element.fontSize}
          label="Font Size"
          onChange={(e) => handleUpdate({ fontSize: e.target.value as number })}
        >
          {FONT_SIZES.map((size) => (
            <MenuItem key={size} value={size}>
              {size}px
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mt: 2 }}>
        <ColorPicker
          color={element.color}
          onChange={(color) => handleUpdate({ color })}
          label="Text Color"
        />
      </Box>
    </>
  );

  const renderHotspotProperties = (element: HotspotElement) => (
    <>
      <FormControl fullWidth margin="normal" size="small">
        <InputLabel>Size</InputLabel>
        <Select
          value={element.size}
          label="Size"
          onChange={(e) => handleUpdate({ size: e.target.value as 'small' | 'medium' | 'large' })}
        >
          <MenuItem value="small">Small (20px)</MenuItem>
          <MenuItem value="medium">Medium (30px)</MenuItem>
          <MenuItem value="large">Large (40px)</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" size="small">
        <InputLabel>Icon</InputLabel>
        <Select
          value={element.icon}
          label="Icon"
          onChange={(e) => handleUpdate({ icon: e.target.value })}
        >
          {HOTSPOT_ICONS.map((icon) => (
            <MenuItem key={icon} value={icon}>
              {icon}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mt: 2 }}>
        <ColorPicker
          color={element.backgroundColor}
          onChange={(backgroundColor) => handleUpdate({ backgroundColor })}
          label="Background Color"
        />
      </Box>
    </>
  );

  return (
    <Box sx={{ p: 2, width: 300, borderLeft: '1px solid #ddd', backgroundColor: '#fafafa' }}>
      <Typography variant="h6" gutterBottom>
        Properties
      </Typography>

      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {selectedElement.type === 'text' ? 'Text Element' : 'Hotspot Element'}
      </Typography>

      <TextField
        label="X Position"
        type="number"
        value={selectedElement.x}
        onChange={(e) => handleUpdate({ x: parseInt(e.target.value) || 0 })}
        fullWidth
        margin="normal"
        size="small"
      />

      <TextField
        label="Y Position"
        type="number"
        value={selectedElement.y}
        onChange={(e) => handleUpdate({ y: parseInt(e.target.value) || 0 })}
        fullWidth
        margin="normal"
        size="small"
      />

      {selectedElement.type === 'text'
        ? renderTextProperties(selectedElement as TextElement)
        : renderHotspotProperties(selectedElement as HotspotElement)}
    </Box>
  );
}
