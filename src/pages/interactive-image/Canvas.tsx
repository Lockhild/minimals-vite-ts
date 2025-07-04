import { useRef } from 'react';
import Box from '@mui/material/Box';
import { Info, Star, Heart, Home, Camera } from 'lucide-react';
import type { CanvasState, CanvasElement } from './types';
import { getCanvasPosition, isPointInElement, HOTSPOT_SIZES } from './helpers';

interface CanvasProps {
  canvasState: CanvasState;
  onElementAdd: (x: number, y: number) => void;
  onElementSelect: (elementId: string | null) => void;
}

export default function Canvas({ canvasState, onElementAdd, onElementSelect }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const { x, y } = getCanvasPosition(event, rect, canvasState.zoom);

    // Check if clicking on an existing element
    const clickedElement = [...canvasState.elements]
      .reverse()
      .find((element) => isPointInElement(x, y, element));

    if (clickedElement) {
      onElementSelect(clickedElement.id);
      return;
    }

    // If in select mode and not clicking an element, deselect
    if (canvasState.currentTool === 'select') {
      onElementSelect(null);
      return;
    }

    // Add new element if in tool mode
    if (canvasState.currentTool === 'text' || canvasState.currentTool === 'hotspot') {
      onElementAdd(x, y);
    }
  };

  const renderElement = (element: CanvasElement) => {
    const isSelected = element.id === canvasState.selectedElementId;

    if (element.type === 'text') {
      return (
        <Box
          key={element.id}
          sx={{
            position: 'absolute',
            left: element.x,
            top: element.y - element.fontSize,
            fontSize: element.fontSize,
            color: element.color,
            fontFamily: 'system-ui',
            userSelect: 'none',
            cursor: 'pointer',
            border: isSelected ? '2px solid #2196f3' : '2px solid transparent',
            borderRadius: 1,
            padding: '2px 4px',
            margin: '-2px -4px',
            backgroundColor: isSelected ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
          }}
        >
          {element.content}
        </Box>
      );
    } else {
      const IconComponent = Icons[element.icon as keyof typeof Icons] as any;
      const size = HOTSPOT_SIZES[element.size];

      return (
        <Box
          key={element.id}
          sx={{
            position: 'absolute',
            left: element.x - size / 2,
            top: element.y - size / 2,
            width: size,
            height: size,
            backgroundColor: element.backgroundColor,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: isSelected ? '2px solid #2196f3' : '1px solid rgba(0,0,0,0.2)',
            boxShadow: isSelected ? '0 0 8px rgba(33, 150, 243, 0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {IconComponent && <IconComponent size={size * 0.6} color="white" />}
        </Box>
      );
    }
  };

  return (
    <Box
      sx={{
        width: 800,
        height: 600,
        border: '2px solid #ddd',
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: 'white',
        position: 'relative',
        cursor: canvasState.currentTool !== 'select' ? 'crosshair' : 'default',
        transform: `scale(${canvasState.zoom})`,
        transformOrigin: 'top left',
      }}
    >
      <Box
        ref={canvasRef}
        onClick={handleCanvasClick}
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          backgroundImage: canvasState.backgroundImage
            ? `url(${canvasState.backgroundImage})`
            : 'none',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        {canvasState.elements.map(renderElement)}
      </Box>
    </Box>
  );
}
