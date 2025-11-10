// src/pages/usuarios/ListaSorteos.jsx
import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import useAuthentication from "../../../hooks/useAuthentication";
import { cargarListaSorteos } from "./ListaSorteos.logic";

const ListaSorteos = () => {
    const navigate = useNavigate();
    useAuthentication(true);

    const [listaSorteos, setListaSorteos] = useState([]);

    useEffect(() => {
        cargarListaSorteos(setListaSorteos);
    }, []);

    const onRowClick = (sorteo) => () => {
        navigate(`/sorteos/${sorteo.accessToken}`);
    };

    return (
        <>
            <Header />

            <Container className="mt-3">
                <Row className="mb-3">
                    <Col>
                        <h1>Mis sorteos</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Table striped bordered hover size="sm" responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Fecha evento</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaSorteos.map((sorteo, index) => (
                                    <tr
                                        key={sorteo.id}
                                        style={{ cursor: "pointer" }}
                                        onClick={onRowClick(sorteo)}
                                    >
                                        <td>{index + 1}</td>
                                        <td>{sorteo.nombre}</td>
                                        <td>
                                            {sorteo.fechaEvento &&
                                                new Date(sorteo.fechaEvento).toLocaleDateString()}
                                        </td>
                                        <td>
                                            {sorteo.isStarted ? (
                                                <span className="text-success fw-semibold">
                                                    Iniciado
                                                </span>
                                            ) : (
                                                <span className="text-danger fw-semibold">
                                                    No iniciado
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {listaSorteos.length === 0 && (
                                    <tr>
                                        <td colSpan={4}>No se encontraron sorteos</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ListaSorteos;
