'use client';

import { useEffect, useState } from 'react';
import App from '../src/App.tsx';

export default function LegacyApplication() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div role="status" className="flex min-h-[60vh] items-center justify-center text-sm text-stone-600">
        Loading service…
      </div>
    );
  }

  return <App />;
}
