import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ShowQues from './Pages/ShowQues';
import CreateQues from './Pages/CreateQues';
import Bundle from './Pages/bundle';
import Admin from './Pages/admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<CreateQues />} />
        <Route path='/Ques' element={<ShowQues />} />
        <Route path='/bundle' element={<Bundle />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;