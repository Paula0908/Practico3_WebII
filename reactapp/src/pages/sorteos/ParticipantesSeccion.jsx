// src/pages/sorteos/ParticipantesSeccion.jsx
import { useEffect, useState } from "react";
import {
    Button,
    Card,
    Form,
    FormControl,
    FormGroup,
    Table
} from "react-bootstrap";
import RequiredLabel from "../../components/RequiredLabel";

import {
    cargarParticipantes,
    agregarParticipante,
    editarParticipante,
    eliminarParticipante
} from "./Participantes.logic";

const ParticipantesSeccion = ({ accessToken, sorteoIniciado }) => {
    const [participantes, setParticipantes] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [formValidated, setFormValidated] = useState(false);
    const [nombreParticipante, setNombreParticipante] = useState("");

    const [formMode, setFormMode] = useState("add");
    const [editingId, setEditingId] = useState(null);

    const puedeEditar = !sorteoIniciado;

    const recargar = () => {
        cargarParticipantes(accessToken, setParticipantes);
    };

    useEffect(() => {
        recargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);

    const onFormSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        let hasErrors = false;
        if (form.checkValidity() === false) {
            hasErrors = true;
        }
        setFormValidated(true);
        if (hasErrors) return;

        if (formMode === "add") {
            agregarParticipante(accessToken, nombreParticipante, () => {
                setNombreParticipante("");
                setFormValidated(false);
                setShowForm(false);
                recargar();
            });
        } else {
            editarParticipante(editingId, nombreParticipante, () => {
                setNombreParticipante("");
                setEditingId(null);
                setFormMode("add");
                setFormValidated(false);
                setShowForm(false);
                recargar();
            });
        }
    };

    const onAddClick = () => {

        setFormMode("add");
        setEditingId(null);
        setNombreParticipante("");
        setFormValidated(false);
        setShowForm((prev) => !prev);
    };

    const onEditClick = (p) => {
        setFormMode("edit");
        setEditingId(p.id);
        setNombreParticipante(p.nombreParticipante);
        setFormValidated(false);
        setShowForm(true);
    };

    const onDeleteClick = (p) => {
        eliminarParticipante(p.id, recargar);
    };

    const onCancelForm = () => {
        setShowForm(false);
        setFormMode("add");
        setEditingId(null);
        setNombreParticipante("");
        setFormValidated(false);
    };

    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h3 className="mb-0">Participantes</h3>
                    {puedeEditar && (
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={onAddClick}
                        >
                            {showForm && formMode === "add" ? "Cancelar" : "Agregar participante"}
                        </Button>
                    )}
                </div>

                {puedeEditar && showForm && (
                    <Form
                        noValidate
                        validated={formValidated}
                        onSubmit={onFormSubmit}
                        className="mb-3"
                    >
                        <FormGroup className="mb-2">
                            <RequiredLabel htmlFor="txtParticipante">
                                {formMode === "add"
                                    ? "Nombre del participante"
                                    : "Editar nombre del participante"}
                            </RequiredLabel>
                            <FormControl
                                id="txtParticipante"
                                required
                                maxLength={120}
                                type="text"
                                value={nombreParticipante}
                                onChange={(e) => setNombreParticipante(e.target.value)}
                            />
                            <FormControl.Feedback type="invalid">
                                El nombre del participante es obligatorio
                            </FormControl.Feedback>
                        </FormGroup>
                        <Button type="submit" variant="primary">
                            {formMode === "add" ? "Guardar" : "Guardar cambios"}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            className="ms-2"
                            onClick={onCancelForm}
                        >
                            Cancelar
                        </Button>
                    </Form>
                )}

                <Table striped bordered hover size="sm" responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Identificado</th>
                            {puedeEditar && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {participantes.map((p, idx) => (
                            <tr key={p.id}>
                                <td>{idx + 1}</td>
                                <td>{p.nombreParticipante}</td>
                                <td>{p.isIdentified ? "Sí" : "No"}</td>
                                {puedeEditar && (
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="me-2"
                                            onClick={() => onEditClick(p)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => onDeleteClick(p)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {participantes.length === 0 && (
                            <tr>
                                <td colSpan={puedeEditar ? 4 : 3}>No hay participantes</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default ParticipantesSeccion;
