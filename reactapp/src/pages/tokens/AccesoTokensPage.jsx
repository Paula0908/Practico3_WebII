// src/pages/tokens/AccesoTokensPage.jsx
import { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    FormGroup,
    FormControl,
    Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import {
    irAlSorteoConToken,
    irAlBolilloConToken,
} from "./AccesoTokens.logic";

const AccesoTokensPage = () => {
    const navigate = useNavigate();

    const [sorteoToken, setSorteoToken] = useState("");
    const [bolilloToken, setBolilloToken] = useState("");

    const [errorSorteo, setErrorSorteo] = useState("");
    const [errorBolillo, setErrorBolillo] = useState("");

    const onIrSorteoSubmit = (e) => {
        e.preventDefault();
        irAlSorteoConToken(sorteoToken, setErrorSorteo, navigate);
    };

    const onIrBolilloSubmit = (e) => {
        e.preventDefault();
        irAlBolilloConToken(bolilloToken, setErrorBolillo, navigate);
    };

    return (
        <>
            <Header />
            <Container className="mt-4">
                <Row className="mb-3">
                    <Col>
                        <h2>Acceso por token</h2>
                        <p className="text-muted mb-0">
                            Usá el token que tengas para ir al sorteo o a tu bolillo personal.
                        </p>
                    </Col>
                </Row>

                <Row>
                    {/* Ir al sorteo (token de sorteo :3) */}
                    <Col md={6} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>Ir al sorteo</Card.Title>
                                <p className="text-muted">
                                    Usá el <strong>token del sorteo</strong> para ver la página de inscripción.
                                </p>
                                <Form onSubmit={onIrSorteoSubmit}>
                                    <FormGroup className="mb-2">
                                        <Form.Label>Token del sorteo</Form.Label>
                                        <FormControl
                                            type="text"
                                            value={sorteoToken}
                                            onChange={(e) => setSorteoToken(e.target.value)}
                                            placeholder="Ej: abc123..."
                                        />
                                    </FormGroup>
                                    {errorSorteo && (
                                        <small className="text-danger d-block mb-2">
                                            {errorSorteo}
                                        </small>
                                    )}
                                    <Button type="submit" variant="primary">
                                        Ir al sorteo
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Ir al bolillo (token de participante :3) */}
                    <Col md={6} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>Ir a tu bolillo</Card.Title>
                                <p className="text-muted">
                                    Usá el <strong>token de participante</strong> para ver tu bolillo.
                                </p>
                                <Form onSubmit={onIrBolilloSubmit}>
                                    <FormGroup className="mb-2">
                                        <Form.Label>Token de participante (bolillo)</Form.Label>
                                        <FormControl
                                            type="text"
                                            value={bolilloToken}
                                            onChange={(e) => setBolilloToken(e.target.value)}
                                            placeholder="Ej: xyz789..."
                                        />
                                    </FormGroup>
                                    {errorBolillo && (
                                        <small className="text-danger d-block mb-2">
                                            {errorBolillo}
                                        </small>
                                    )}
                                    <Button type="submit" variant="primary">
                                        Ir a mi bolillo
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

export default AccesoTokensPage;
