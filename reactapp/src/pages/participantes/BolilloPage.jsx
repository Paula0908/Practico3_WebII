// src/pages/participantes/BolilloPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert, Form, FormGroup, FormControl, Button } from "react-bootstrap";

import Header from "../../components/Header";
import {
    cargarBolillo,
    guardarWishlist,
} from "./Bolillo.logic";

const BolilloPage = () => {
    const { accessLinkToken } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [sorteo, setSorteo] = useState(null);
    const [yo, setYo] = useState(null);
    const [asignado, setAsignado] = useState(null);

    const [wishlist, setWishlist] = useState("");
    const [saveMessage, setSaveMessage] = useState("");
    const [copyLinkMsg, setCopyLinkMsg] = useState("");
    const [copyTokenMsg, setCopyTokenMsg] = useState("");

    useEffect(() => {
        if (!accessLinkToken) return;
        cargarBolillo(
            accessLinkToken,
            setSorteo,
            setYo,
            setAsignado,
            setWishlist,
            setError,
            setLoading
        );
    }, [accessLinkToken]);

    const onGuardarWishlist = (e) => {
        e.preventDefault();
        setSaveMessage("");
        guardarWishlist(accessLinkToken, wishlist, setSaving, () => {
            setSaveMessage("Wishlist guardada correctamente ✨");
            setYo((prev) => (prev ? { ...prev, wishlist } : prev));
        });
    };

    const urlBolillo = `${window.location.origin}/bolillo/${accessLinkToken}`;

    const onCopyLinkClick = async () => {
        try {
            await navigator.clipboard.writeText(urlBolillo);
            setCopyLinkMsg("Link copiado :3");
            setTimeout(() => setCopyLinkMsg(""), 2500);
        } catch (err) {
            console.error(err);
            alert("No se pudo copiar el link. Puedes copiarlo manualmente.");
        }
    };

    const onCopyTokenClick = async () => {
        try {
            await navigator.clipboard.writeText(accessLinkToken);
            setCopyTokenMsg("Token copiado :D");
            setTimeout(() => setCopyTokenMsg(""), 2500);
        } catch (err) {
            console.error(err);
            alert("No se pudo copiar el token. Puedes copiarlo manualmente.");
        }
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

    if (error || !yo || !sorteo) {
        return (
            <>
                <Header />
                <Container className="mt-4">
                    <Row>
                        <Col md={8} lg={6}>
                            <Alert variant="danger">
                                {error || "Enlace inválido o información no disponible."}
                            </Alert>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }

    const fechaEventoTexto = sorteo.fechaEvento
        ? new Date(sorteo.fechaEvento).toLocaleDateString()
        : "";

    return (
        <>
            <Header />
            <Container className="mt-4">
                <Row>
                    {/* parte izquierda: link, token, nombre, wishlist */}
                    <Col md={6} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title className="text-terciary">ACCESO Y DATOS</Card.Title>


                                {/* Link */}
                                <p className="mb-1">
                                    <strong>Link personal:</strong>
                                </p>
                                <p className="mb-2">
                                    <a href={urlBolillo}>{urlBolillo}</a>{" "}
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="p-0 ms-1 align-baseline"
                                        onClick={onCopyLinkClick}
                                    >
                                        (copiar)
                                    </Button>
                                </p>
                                {copyLinkMsg && (
                                    <small className="text-success d-block mb-2">
                                        {copyLinkMsg}
                                    </small>
                                )}

                                {/* Token */}
                                <p className="mb-1">
                                    <strong>Token personal:</strong>
                                </p>
                                <p className="mb-2">
                                    <strong>
                                        <code className="text-secondary" >{accessLinkToken}</code>{" "}
                                    </strong>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="p-0 ms-1 align-baseline"
                                        onClick={onCopyTokenClick}
                                    >
                                        (copiar)
                                    </Button>
                                </p>
                                {copyTokenMsg && (
                                    <small className="text-success d-block mb-2">
                                        {copyTokenMsg}
                                    </small>
                                )}

                                <p className="text-danger fw-semibold mb-3">
                                    Guarda tu link o tu token.
                                    Si los pierdes,
                                    NO PODRAS VOLVER A ACCEDER A TU BOLILLO
                                </p>
                                <hr />

                                <p className="mb-2">
                                    <strong>Nombre:</strong> {yo.nombreParticipante}
                                </p>

                                <Form onSubmit={onGuardarWishlist}>
                                    <FormGroup className="mb-2">
                                        <Form.Label>Tu wishlist (opcional)</Form.Label>
                                        <FormControl
                                            as="textarea"
                                            rows={4}
                                            value={wishlist}
                                            onChange={(e) => setWishlist(e.target.value)}
                                            placeholder="Ideas de regalos que te gustaría recibir..."
                                        />
                                    </FormGroup>
                                    <Button type="submit" variant="primary" disabled={saving}>
                                        {saving ? "Guardando..." : "Guardar wishlist"}
                                    </Button>
                                    {saveMessage && (
                                        <p className="text-success mt-2 mb-0">{saveMessage}</p>
                                    )}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* parte derecha: info sorteo y a quien rgalas*/}
                    <Col md={6} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>{sorteo.nombre}</Card.Title>
                                {fechaEventoTexto && (
                                    <p className="mb-2 text-muted">
                                        <strong>Fecha:</strong> {fechaEventoTexto}
                                    </p>
                                )}

                                <hr />

                                <h5>A quién te toca regalar</h5>
                                {!asignado ? (
                                    <p className="mb-0">
                                        Aún no tienes un destinatario asignado.
                                        Es posible que el sorteo todavía no se haya realizado.
                                    </p>
                                ) : (
                                    <>
                                        <p className="mb-1">
                                            <strong>Nombre:</strong>{" "}
                                            {asignado.nombreParticipante}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Wishlist de esta persona:</strong>
                                        </p>
                                        <p className="mb-0">
                                            {asignado.wishlist
                                                ? asignado.wishlist
                                                : "Esta persona aún no ha definido su wishlist."}
                                        </p>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default BolilloPage;
