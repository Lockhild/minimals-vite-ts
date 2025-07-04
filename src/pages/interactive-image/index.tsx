import { CONFIG } from 'src/global-config';
import InteractiveImageBuilder from './InteractiveImageBuilder';

// ----------------------------------------------------------------------

const metadata = { title: `Interactive Image - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <InteractiveImageBuilder />
    </>
  );
}
