import React, { Suspense } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

// Lazy load the heavy 3D viewer and its Three.js dependencies
const HeartExplorer = React.lazy(() => import('@/components/HeartExplorer'));

const Index = () => {
  return (
    <Suspense fallback={<LoadingScreen progress={5} />}>
      <HeartExplorer />
    </Suspense>
  );
};

export default Index;
