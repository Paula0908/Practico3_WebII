// src/pages/participantes/SorteoPublicPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Button,
    Spinner,
    Alert,
} from "react-bootstrap";

import Header from "../../components/Header";
import {
    cargarSorteoPublic,
    identificarParticipantePublic,
} from "./SorteoPublic.logic";

const SorteoPublicPage = () => {
    const { accessToken } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sorteo, setSorteo] = useState(null);
    const [participantes, setParticipantes] = useState([]);

    useEffect(() => {
        if (!accessToken) return;
        cargarSorteoPublic(
            accessToken,
            setSorteo,
            setParticipantes,
            setError,
            setLoading
        );
    }, [accessToken]);

    const onSoyEsteClick = (p) => {
        identificarParticipantePublic(accessToken, p, navigate);
    };

    if (loading) {
        return (
            <>
                <Header />
                <Container className="mt-4">
                    <Row>
                        <Col className="d-flex justify-content-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </Spinner>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }

    if (error || !sorteo) {
        return (
            <>
                <Header />
                <Container className="mt-4">
                    <Row>
                        <Col md={8} lg={6}>
                            <Alert variant="danger">
                                {error || "Enlace inválido o sorteo no encontrado"}
                            </Alert>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }

    return (
        <>
            <Header />
            <Container className="mt-4">
                <Row className="mb-3">
                    <Col md={8} lg={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{sorteo.nombre}</Card.Title>
                                {sorteo.fechaEvento && (
                                    <p className="mb-1 text-muted">
                                        Fecha del evento:{" "}
                                        {new Date(sorteo.fechaEvento).toLocaleDateString()}
                                    </p>
                                )}
                                {!sorteo.isStarted && (
                                    <p className="text-warning mb-0">
                                        El sorteo aún no ha sido sorteado, pero ya puedes
                                        identificarte en la lista.
                                    </p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col md={8} lg={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Selecciona tu nombre</Card.Title>

                                {participantes.length === 0 ? (
                                    <p className="mb-0">
                                        Ya no hay participantes disponibles para identificar.
                                    </p>
                                ) : (
                                    <Table striped bordered hover size="sm" responsive>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Nombre</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {participantes.map((p, idx) => (
                                                <tr key={p.id}>
                                                    <td>{idx + 1}</td>
                                                    <td>{p.nombreParticipante}</td>
                                                    <td className="text-center">
                                                        <Button
                                                            size="sm"
                                                            variant="primary"
                                                            onClick={() => onSoyEsteClick(p)}
                                                        >
                                                            Yo soy esta persona
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default SorteoPublicPage;
