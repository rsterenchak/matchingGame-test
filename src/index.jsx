import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import MainSection from './MainSection.jsx';

const root = createRoot(document.getElementById('app'));

root.render(
  <StrictMode>

    <MainSection />

  </StrictMode>
);
