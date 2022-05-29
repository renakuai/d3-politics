import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import DivergentChart from './components/DivergentChart';
import HistoricalChart from './components/HistoricalChart';

import { BrowserRouter, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HistoricalChart />} />
          <Route path="politicians" element={<DivergentChart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

