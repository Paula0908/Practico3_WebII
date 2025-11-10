// src/pages/sorteos/DetalleSorteo.jsx
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/Header";
import RequiredLabel from "../../components/RequiredLabel";
import useAuthentication from "../../../hooks/useAuthentication";
import ParticipantesSection from "./ParticipantesSeccion";

import {
    cargarSorteo,
    guardarCambiosSorteo,
    ejecutarSorteo,
    eliminarSorteo
} from "./DetalleSorteo.logic";

const DetalleSorteo = () => {
    useAuthentication(true);

    const { accessToken } = useParams();
    const navigate = useNavigate();

    const [sorteo, setSorteo] = useState(null);

    const [showEdit, setShowEdit] = useState(false);
    const [formValidated, setFormValidated] = useState(false);
    const [nombre, setNombre] = useState("");
    const [fechaEvento, setFechaEvento] = useState("");

    const [copyLinkMsg, setCopyLinkMsg] = useState("");
    const [copyTokenMsg, setCopyTokenMsg] = useState("");

    const recargarSorteo = () => {
        cargarSorteo(accessToken, navigate, setSorteo, setNombre, setFechaEvento);
    };

    useEffect(() => {
        recargarSorteo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);

    if (!sorteo) {
        return (
            <>
                <Header />
                <Container className="mt-3">Cargando sorteo...</Container>
            </>
        );
    }

    const puedeEditar = !sorteo.isStarted;
    const publicUrl = `http://localhost:5173/sorteo/${accessToken}`;

    const onSorteoFormSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        let hasErrors = false;
        if (form.checkValidity() === false) {
            hasErrors = true;
        }
        setFormValidated(true);
        if (hasErrors) return;

        guardarCambiosSorteo(
            accessToken,
            { nombre, fechaEvento },
            setSorteo,
            setShowEdit
        );
    };

    const onSortearClick = () => {
        ejecutarSorteo(accessToken, recargarSorteo);
    };

    const onDeleteSorteoClick = () => {
        eliminarSorteo(accessToken, navigate);
    };

    const onCopyLinkClick = async () => {
        try {
            await navigator.clipboard.writeText(publicUrl);
            setCopyLinkMsg("Link copiado :3");
            setTimeout(() => setCopyLinkMsg(""), 2500);
        } catch (err) {
            console.error(err);
            alert("No se pudo copiar el link. Puedes copiarlo manualmente.");
        }
    };

    const onCopyTokenClick = async () => {
        try {
            await navigator.clipboard.writeText(accessToken);
            setCopyTokenMsg("Token copiado :D");
            setTimeout(() => setCopyTokenMsg(""), 2500);
        } catch (err) {
            console.error(err);
            alert("No se pudo copiar el token. Puedes copiarlo manualmente.");
        }
    };

    return (
        <>
            <Header />
            <Container className="mt-3">
                <Row>
                    {/* Lado sorteo */}
                    <Col md={5} xl={4}>
                        <Card className="mb-3">
                            <Card.Body>
                                <h2>{sorteo.nombre}</h2>
                                <p className="mb-1">
                                    <strong>Fecha:</strong>{" "}
                                    {new Date(sorteo.fechaEvento).toLocaleDateString()}
                                </p>
                                <p className="mb-1">
                                    <strong>Estado:</strong>{" "}
                                    {sorteo.isStarted ? "Iniciado" : "No iniciado"}
                                </p>

                                {/* Link copiar */}
                                <p className="mb-1">
                                    <strong>Link público:</strong>
                                </p>
                                <p className="mb-2">
                                    <a href={publicUrl} target="_blank" rel="noreferrer">
                                        {publicUrl}
                                    </a>{" "}
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

                                {/* Token copiar */}
                                <p className="mb-1">
                                    <strong>Token Sorteo:</strong>
                                </p>
                                <p className="mb-2">
                                    <code className="text-secondary">{accessToken}</code>{" "}
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

                                <div className="d-flex flex-wrap gap-2 mt-3">
                                    {puedeEditar && (
                                        <Button
                                            variant="secondary"
                                            onClick={() => setShowEdit((prev) => !prev)}
                                        >
                                            {showEdit ? "Cancelar edición" : "Editar sorteo"}
                                        </Button>
                                    )}
                                    <Button
                                        variant="success"
                                        onClick={onSortearClick}
                                        disabled={sorteo.isStarted}
                                    >
                                        Sortear
                                    </Button>
                                    {puedeEditar && (
                                        <Button
                                            variant="danger"
                                            onClick={onDeleteSorteoClick}
                                        >
                                            Eliminar sorteo
                                        </Button>
                                    )}
                                </div>

                                {/* Form de edición */}
                                {puedeEditar && showEdit && (
                                    <Form
                                        className="mt-3"
                                        noValidate
                                        validated={formValidated}
                                        onSubmit={onSorteoFormSubmit}
                                    >
                                        <FormGroup className="mb-2">
                                            <RequiredLabel htmlFor="txtNombre">Nombre</RequiredLabel>
                                            <FormControl
                                                id="txtNombre"
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
                                            <RequiredLabel htmlFor="txtFecha">
                                                Fecha del evento
                                            </RequiredLabel>
                                            <FormControl
                                                id="txtFecha"
                                                required
                                                type="date"
                                                value={fechaEvento}
                                                onChange={(e) => setFechaEvento(e.target.value)}
                                            />
                                            <FormControl.Feedback type="invalid">
                                                La fecha es obligatoria
                                            </FormControl.Feedback>
                                        </FormGroup>

                                        <Button type="submit" variant="primary">
                                            Guardar cambios
                                        </Button>
                                    </Form>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* participantes */}
                    <Col md={7} xl={8}>
                        <ParticipantesSection
                            accessToken={accessToken}
                            sorteoIniciado={sorteo.isStarted}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default DetalleSorteo;
