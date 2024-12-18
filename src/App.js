import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Create from './components/Create';
import Read from './components/Read';
import Edit from './components/Edit';
import Footer from './components/Footer';
import About from './components/About';
import './App.css';
import './components/About.css';




function App() {
  return (
    <Router>
      <NavigationBar />
      <div className="container mt-4">
      <Routes>
        <Route path="/" element={<Read />} />
        <Route path="/create" element={<Create />} />
        <Route path="/read" element={<Read />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/about" element={<About />} />
        
        </Routes>
        </div>
      <Footer />
      
    </Router>
  );
}

export default App;
