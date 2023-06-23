import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ShowQues from './Pages/ShowQues';
import CreateQues from './Pages/CreateQues';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<CreateQues />} />
        <Route path='/Ques' element={<ShowQues />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
