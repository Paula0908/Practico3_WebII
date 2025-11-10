import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAccessToken } from "../../utils/TokenUtilities";
import useAuthentication from "../../hooks/useAuthentication";

const Header = () => {
    const { doLogout, userEmail } = useAuthentication();
    const token = getAccessToken();

    const onLogoutClick = () => {
        doLogout();
    };

    return (
        <Navbar bg="primary" data-bs-theme="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Amigo Secreto</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {token ? (
                            <>

                                <NavDropdown title="Sorteos" id="basic-nav-dropdown">
                                    <Link className="dropdown-item" to="/sorteos">
                                        Ver Sorteos
                                    </Link>
                                    <Link className="dropdown-item" to="/">
                                        Crear Sorteo
                                    </Link>
                                </NavDropdown>

                                <NavDropdown title={userEmail || "Mi cuenta"} id="logout-dropdown">
                                    <button className="dropdown-item" onClick={onLogoutClick}>
                                        Cerrar sesión
                                    </button>
                                </NavDropdown>
                                <Link className="nav-link" to="/dirigir">Dirigir</Link>

                            </>
                        ) : (
                            <>
                                <Link className="nav-link" to="/login">Iniciar sesión</Link>
                                <Link className="nav-link" to="/register">Registrarse</Link>
                                <Link className="nav-link" to="/dirigir">Dirigir</Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
