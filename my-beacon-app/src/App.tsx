// src/App.tsx

import React from 'react';
import BeaconVisualization from './components/BeaconVisualization';

const App: React.FC = () => {
  return (
    <div>
      {/* Optional: Remove or style the header to take up less space */}
      {/* <h1>Beacon Visualization</h1> */}
      <BeaconVisualization />
    </div>
  );
};

export default App;