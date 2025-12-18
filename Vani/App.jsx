import React from 'react';
import { LanguageProvider } from './src/context/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';
import { NetworkProvider } from './src/context/NetworkContext';

const App = () => {
  return (
    <NetworkProvider>
      <LanguageProvider>
        <AppNavigator />
      </LanguageProvider>
    </NetworkProvider>
  );
};

export default App;
