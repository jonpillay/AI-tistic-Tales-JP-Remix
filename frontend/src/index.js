import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'react-tooltip/dist/react-tooltip.css'
import App from './components/app/App';
import reportWebVitals from './reportWebVitals';
import { AuthContextProvider } from './context/AuthContext';
import { StoryContextProvider } from './context/StoryContext';
import { CreditsContextProvider } from './context/CreditsContext';
import { LoadingContextProvider } from './context/LoadingContext';
import { WarningsContextProvider } from './context/WarningsContext';

import { store, persistor } from './redux-state/store';
import { Provider } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react';
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

if (process.env.NODE_ENV === 'production') disableReactDevTools()

const container = document.getElementById('root');

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <LoadingContextProvider>
      <AuthContextProvider>
        <WarningsContextProvider>
          <CreditsContextProvider>
            <StoryContextProvider>
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <App />
                </PersistGate>
              </Provider>
            </StoryContextProvider>
          </CreditsContextProvider>
        </WarningsContextProvider>
      </AuthContextProvider>
    </LoadingContextProvider>
  </React.StrictMode>
);

reportWebVitals();
