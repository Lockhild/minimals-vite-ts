import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Upload } from 'lucide-react';
import type { CanvasState, CanvasElement, TextElement, HotspotElement } from './types';
import { generateId } from './helpers';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import PropertiesPanel from './PropertiesPanel';
import LayerList from './LayerList';

export default function InteractiveImageBuilder() {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    backgroundImage: null,
    elements: [],
    selectedElementId: null,
    currentTool: 'select',
    zoom: 1,
  });

  // Handle keyboard events for deletion
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && canvasState.selectedElementId) {
        handleElementDelete(canvasState.selectedElementId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvasState.selectedElementId]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('Please upload a JPG or PNG image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCanvasState((prev) => ({
        ...prev,
        backgroundImage: result,
        selectedElementId: null,
      }));
    };
    reader.readAsDataURL(file);

    // Reset the input
    event.target.value = '';
  }, []);

  const handleElementAdd = useCallback(
    (x: number, y: number) => {
      const id = generateId();

      let newElement: CanvasElement;

      if (canvasState.currentTool === 'text') {
        newElement = {
          id,
          type: 'text',
          x,
          y,
          content: 'New Text',
          fontSize: 18,
          color: '#000000',
        } as TextElement;
      } else if (canvasState.currentTool === 'hotspot') {
        newElement = {
          id,
          type: 'hotspot',
          x,
          y,
          size: 'medium',
          backgroundColor: '#2196f3',
          icon: 'info',
        } as HotspotElement;
      } else {
        return;
      }

      setCanvasState((prev) => ({
        ...prev,
        elements: [...prev.elements, newElement],
        selectedElementId: id,
        currentTool: 'select',
      }));
    },
    [canvasState.currentTool]
  );

  const handleElementSelect = useCallback((elementId: string | null) => {
    setCanvasState((prev) => ({
      ...prev,
      selectedElementId: elementId,
    }));
  }, []);

  const handleElementUpdate = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    setCanvasState((prev) => ({
      ...prev,
      elements: prev.elements.map((element) =>
        element.id === elementId ? { ...element, ...updates } : element
      ),
    }));
  }, []);

  const handleElementDelete = useCallback((elementId: string) => {
    setCanvasState((prev) => ({
      ...prev,
      elements: prev.elements.filter((element) => element.id !== elementId),
      selectedElementId: prev.selectedElementId === elementId ? null : prev.selectedElementId,
    }));
  }, []);

  const handleToolChange = useCallback((tool: CanvasState['currentTool']) => {
    setCanvasState((prev) => ({
      ...prev,
      currentTool: tool,
    }));
  }, []);

  const handleZoomChange = useCallback((zoom: number) => {
    setCanvasState((prev) => ({
      ...prev,
      zoom,
    }));
  }, []);

  const selectedElement =
    canvasState.elements.find((el) => el.id === canvasState.selectedElementId) || null;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid #ddd',
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h5">Interactive Image Builder</Typography>
        <Button variant="contained" startIcon={<Upload size={16} />} component="label" size="small">
          Upload Image
          <input
            type="file"
            hidden
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleImageUpload}
          />
        </Button>
      </Box>

      {/* Toolbar */}
      <Toolbar
        currentTool={canvasState.currentTool}
        zoom={canvasState.zoom}
        onToolChange={handleToolChange}
        onZoomChange={handleZoomChange}
      />

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Canvas Area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            backgroundColor: '#f0f0f0',
            overflow: 'auto',
          }}
        >
          <Canvas
            canvasState={canvasState}
            onElementAdd={handleElementAdd}
            onElementSelect={handleElementSelect}
          />
        </Box>

        {/* Properties Panel */}
        <PropertiesPanel selectedElement={selectedElement} onElementUpdate={handleElementUpdate} />
      </Box>

      {/* Layer List */}
      <LayerList
        elements={canvasState.elements}
        selectedElementId={canvasState.selectedElementId}
        onElementSelect={handleElementSelect}
        onElementDelete={handleElementDelete}
      />
    </Box>
  );
}
