import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/app/App';
import reportWebVitals from './reportWebVitals';
import { AuthContextProvider } from './context/AuthContext';
import { StoryContextProvider } from './context/StoryContext';
import { CreditsContextProvider } from './context/CreditsContext';
import { LoadingContextProvider } from './context/LoadingContext';

const container = document.getElementById('root');

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <LoadingContextProvider>
      <AuthContextProvider>
        <CreditsContextProvider>
          <StoryContextProvider>
            <App />
          </StoryContextProvider>
        </CreditsContextProvider>
      </AuthContextProvider>
    </LoadingContextProvider>
  </React.StrictMode>
);

reportWebVitals();
