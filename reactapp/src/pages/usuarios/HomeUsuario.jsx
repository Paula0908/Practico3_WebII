// src/pages/usuarios/HomeUsuario.jsx
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import RequiredLabel from "../../components/RequiredLabel";
import useAuthentication from "../../../hooks/useAuthentication";
import { cargarSorteos, crearSorteoLogica } from "./HomeUsuario.logic";

const HomeUsuario = () => {

    useAuthentication(true);

    const navigate = useNavigate();

    const [sorteos, setSorteos] = useState([]);

    const [validated, setValidated] = useState(false);
    const [nombre, setNombre] = useState("");
    const [fechaEvento, setFechaEvento] = useState("");

    useEffect(() => {
        cargarSorteos(setSorteos);
    }, []);

    const onFormSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        let hasErrors = false;
        if (form.checkValidity() === false) {
            hasErrors = true;
        }
        setValidated(true);
        if (hasErrors) return;

        const payload = { nombre, fechaEvento };

        crearSorteoLogica(payload, () => {
            setNombre("");
            setFechaEvento("");
            setValidated(false);
            cargarSorteos(setSorteos);
        });
    };

    const onVerMasClick = () => {
        navigate("/sorteos");
    };

    const onSorteoClick = (s) => {
        navigate(`/sorteos/${s.accessToken}`);
    };

    const primerosTres = sorteos.slice(0, 3);

    return (
        <>
            <Header />
            <Container className="mt-3">
                <Row>
                    {/* Columna izquierda sorteos receintes */}
                    <Col md={7} xl={8}>
                        <Card>
                            <Card.Body>
                                <h2>Mis sorteos recientes</h2>
                                <p className="text-muted">Tus últimos sorteos.</p>

                                <Table striped hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Fecha</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {primerosTres.map((s) => (
                                            <tr
                                                key={s.id}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => onSorteoClick(s)}
                                            >
                                                <td>{s.nombre}</td>
                                                <td>
                                                    {s.fechaEvento &&
                                                        new Date(s.fechaEvento).toLocaleDateString()}
                                                </td>
                                                <td>{s.isStarted ? "Iniciado" : "No iniciado"}</td>
                                            </tr>
                                        ))}
                                        {primerosTres.length === 0 && (
                                            <tr>
                                                <td colSpan={3}>Todavía no tienes sorteos.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>

                                {sorteos.length > 3 && (
                                    <Button variant="link" onClick={onVerMasClick}>
                                        Ver más sorteos...
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Columna derecha crear sorteo */}
                    <Col md={5} xl={4}>
                        <Card>
                            <Card.Body>
                                <h3>Crear nuevo sorteo</h3>
                                <Form noValidate validated={validated} onSubmit={onFormSubmit}>
                                    <FormGroup className="mb-2">
                                        <RequiredLabel htmlFor="txtNombreSorteo">
                                            Nombre
                                        </RequiredLabel>
                                        <FormControl
                                            id="txtNombreSorteo"
                                            required
                                            maxLength={100}
                                            type="text"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                        />
                                        <FormControl.Feedback type="invalid">
                                            El nombre es obligatorio
                                        </FormControl.Feedback>
                                    </FormGroup>

                                    <FormGroup className="mb-2">
                                        <RequiredLabel htmlFor="txtFechaSorteo">
                                            Fecha del evento
                                        </RequiredLabel>
                                        <FormControl
                                            id="txtFechaSorteo"
                                            required
                                            type="date"
                                            value={fechaEvento}
                                            onChange={(e) => setFechaEvento(e.target.value)}
                                        />
                                        <FormControl.Feedback type="invalid">
                                            La fecha es obligatoria
                                        </FormControl.Feedback>
                                    </FormGroup>

                                    <Button variant="primary" type="submit">
                                        Crear sorteo
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default HomeUsuario;
