// ChatRoot.tsx — global island. Place once in each page's <body>.
// Listens for 'chat:open' CustomEvent and renders the drawer.
// Dispatch from any Astro page/component:
//   window.dispatchEvent(new CustomEvent('chat:open', { detail: { seed: '...' } }))

import { useState, useEffect } from 'react';
import ChatDrawer from './ChatDrawer';

export default function ChatRoot() {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ seed?: string }>).detail ?? {};
      setSeed(detail.seed ?? '');
      setOpen(true);
    };
    window.addEventListener('chat:open', handler);
    return () => window.removeEventListener('chat:open', handler);
  }, []);

  return (
    <ChatDrawer
      open={open}
      seed={seed}
      onClose={() => setOpen(false)}
    />
  );
}
