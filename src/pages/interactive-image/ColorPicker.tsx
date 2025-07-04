import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Popover from '@mui/material/Popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  '#000000',
  '#FFFFFF',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF',
  '#FFA500',
  '#800080',
  '#FFC0CB',
  '#A52A2A',
  '#808080',
  '#90EE90',
  '#FFB6C1',
];

export default function ColorPicker({ color, onChange, label = 'Color' }: ColorPickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorSelect = (selectedColor: string) => {
    onChange(selectedColor);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          label={label}
          value={color}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        />
        <Box
          onClick={handleClick}
          sx={{
            width: 32,
            height: 32,
            backgroundColor: color,
            border: '1px solid #ccc',
            borderRadius: 1,
            cursor: 'pointer',
            '&:hover': {
              border: '1px solid #999',
            },
          }}
        />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>
          {PRESET_COLORS.map((presetColor) => (
            <Box
              key={presetColor}
              onClick={() => handleColorSelect(presetColor)}
              sx={{
                width: 24,
                height: 24,
                backgroundColor: presetColor,
                border: '1px solid #ccc',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  border: '2px solid #000',
                },
              }}
            />
          ))}
        </Box>
      </Popover>
    </>
  );
}
