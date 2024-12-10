import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Create from './components/Create';
import Read from './components/Read';
import Edit from './components/Edit';
import Login from './components/Login';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <NavigationBar />
      <div className="container mt-4">
      <Routes>
       <Route path="/" element={<Dashboard />} /> 
        <Route path="/" element={<Read />} />
        <Route path="/create" element={<Create />} />
        <Route path="/read" element={<Read />} />
        <Route path="/edit/:id" element={<Edit />} />
      
        <Route path="/login" element={<Login />} />
        </Routes>
        </div>
      <Footer />
      
    </Router>
  );
}

export default App;
