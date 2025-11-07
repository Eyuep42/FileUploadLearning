import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import FileViewer from './FileViewer.tsx';
import "./index.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/viewer/:fileName" element={<FileViewer />} />
        </Routes>
    </BrowserRouter>
);
