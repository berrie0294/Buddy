import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DogNavigator from './DogNavigator';
import Admin from './Admin'; // Import the Admin component
import Banner from './Banner';

const App = () => {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1></h1>
        </header>
        <main>
          <Routes>
            <Route path="/dog/:id/:password" element={<DogNavigator />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/" element={<DogNavigator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
