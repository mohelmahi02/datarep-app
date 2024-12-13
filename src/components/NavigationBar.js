import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
const NavigationBar = () => {
  
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Task Manager</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/create">Create Task</Nav.Link>
          <Nav.Link href="/read">View Tasks</Nav.Link>
          <Nav.Link href="/about">About</Nav.Link>
        </Nav>
  
      </Container>
    </Navbar>
  );
};
export default NavigationBar;