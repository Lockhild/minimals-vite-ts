import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `Interactive Image - ${CONFIG.appName}` };

export default function Page() {
  const [showBuilder, setShowBuilder] = useState(false);

  const loadBuilder = async () => {
    try {
      const { default: InteractiveImageBuilder } = await import('./InteractiveImageBuilder');
      setShowBuilder(true);
    } catch (error) {
      console.error('Error loading InteractiveImageBuilder:', error);
    }
  };

  if (showBuilder) {
    // Dynamically import and render the builder
    const { default: InteractiveImageBuilder } = require('./InteractiveImageBuilder');
    return (
      <>
        <title>{metadata.title}</title>
        <InteractiveImageBuilder />
      </>
    );
  }

  return (
    <>
      <title>{metadata.title}</title>
      <Container>
        <Typography variant="h4">Interactive Image Builder</Typography>
        <Typography variant="body1" gutterBottom>
          Click the button below to load the interactive image builder.
        </Typography>
        <Button variant="contained" onClick={loadBuilder}>
          Load Builder
        </Button>
      </Container>
    </>
  );
}
