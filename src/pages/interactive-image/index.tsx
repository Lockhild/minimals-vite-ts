import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Upload, Type, MapPin } from 'lucide-react';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `Interactive Image - ${CONFIG.appName}` };

export default function Page() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [elements, setElements] = useState<any[]>([]);
  const [currentTool, setCurrentTool] = useState('select');
  const [selectedElement, setSelectedElement] = useState<any>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setBackgroundImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleCanvasClick = (event: React.MouseEvent) => {
    if (currentTool === 'select') return;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: currentTool,
      x,
      y,
      content: currentTool === 'text' ? 'New Text' : 'info',
      color: '#000000',
    };

    setElements((prev) => [...prev, newElement]);
    setCurrentTool('select');
  };

  return (
    <>
      <title>{metadata.title}</title>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid #ddd',
          }}
        >
          <Typography variant="h5">Interactive Image Builder</Typography>
          <Button variant="contained" startIcon={<Upload size={16} />} component="label">
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>
        </Box>

        {/* Toolbar */}
        <Box sx={{ display: 'flex', gap: 1, p: 2, borderBottom: '1px solid #ddd' }}>
          <Button
            variant={currentTool === 'select' ? 'contained' : 'outlined'}
            onClick={() => setCurrentTool('select')}
          >
            Select
          </Button>
          <Button
            variant={currentTool === 'text' ? 'contained' : 'outlined'}
            onClick={() => setCurrentTool('text')}
            startIcon={<Type size={16} />}
          >
            Text
          </Button>
          <Button
            variant={currentTool === 'hotspot' ? 'contained' : 'outlined'}
            onClick={() => setCurrentTool('hotspot')}
            startIcon={<MapPin size={16} />}
          >
            Hotspot
          </Button>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'flex', flex: 1 }}>
          {/* Canvas */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
            }}
          >
            <Box
              onClick={handleCanvasClick}
              sx={{
                width: 800,
                height: 600,
                border: '2px solid #ddd',
                backgroundColor: 'white',
                position: 'relative',
                cursor: currentTool !== 'select' ? 'crosshair' : 'default',
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            >
              {elements.map((element) => (
                <Box
                  key={element.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElement(element);
                  }}
                  sx={{
                    position: 'absolute',
                    left: element.x,
                    top: element.y,
                    cursor: 'pointer',
                    border: selectedElement?.id === element.id ? '2px solid blue' : 'none',
                    padding: '2px',
                  }}
                >
                  {element.type === 'text' ? (
                    <span style={{ color: element.color }}>{element.content}</span>
                  ) : (
                    <Box
                      sx={{ width: 20, height: 20, backgroundColor: 'blue', borderRadius: '50%' }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Properties Panel */}
          <Box sx={{ width: 300, p: 2, borderLeft: '1px solid #ddd' }}>
            <Typography variant="h6" gutterBottom>
              Properties
            </Typography>
            {selectedElement ? (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {selectedElement.type === 'text' ? 'Text Element' : 'Hotspot Element'}
                </Typography>
                {selectedElement.type === 'text' && (
                  <TextField
                    label="Content"
                    value={selectedElement.content}
                    onChange={(e) => {
                      const updated = { ...selectedElement, content: e.target.value };
                      setSelectedElement(updated);
                      setElements((prev) =>
                        prev.map((el) => (el.id === updated.id ? updated : el))
                      );
                    }}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                )}
              </Box>
            ) : (
              <Typography color="text.secondary">Select an element to edit</Typography>
            )}
          </Box>
        </Box>

        {/* Layer List */}
        <Box sx={{ height: 150, borderTop: '1px solid #ddd', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Layers ({elements.length})
          </Typography>
          {elements.length === 0 ? (
            <Typography color="text.secondary">No elements yet</Typography>
          ) : (
            <Box>
              {elements.map((element, index) => (
                <Box
                  key={element.id}
                  onClick={() => setSelectedElement(element)}
                  sx={{
                    p: 1,
                    cursor: 'pointer',
                    backgroundColor:
                      selectedElement?.id === element.id ? 'primary.light' : 'transparent',
                    '&:hover': { backgroundColor: 'grey.100' },
                  }}
                >
                  Layer {index + 1}: {element.type}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
