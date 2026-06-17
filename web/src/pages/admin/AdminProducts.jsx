import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Table, Button, Modal, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useProducts, useProductMutations } from '../../hooks/useProducts';

const EMPTY = { name: '', category: '', stock: 0, min: 0, max: 0, price: 0 };

export default function AdminProducts() {
  const { data: products = [], isLoading, isError, error } = useProducts();
  const { create, update, remove } = useProductMutations();

  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null); // null = crear, objeto = editar

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: EMPTY });

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setShow(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    reset(product);
    setShow(true);
  };

  const onSubmit = async (values) => {
    // Convertimos los campos numéricos a número.
    const data = {
      ...values,
      stock: Number(values.stock),
      min: Number(values.min),
      max: Number(values.max),
      price: Number(values.price),
    };
    if (editing) {
      await update.mutateAsync({ id: editing.id, data });
    } else {
      await create.mutateAsync(data);
    }
    setShow(false);
  };

  const handleDelete = (product) => {
    if (window.confirm(`¿Eliminar "${product.name}"?`)) {
      remove.mutate(product.id);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }
  if (isError) {
    return <Alert variant="danger">Error al cargar: {error.message}</Alert>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="h3 mb-0">Administración de productos</h1>
        <Button onClick={openCreate}>+ Nuevo producto</Button>
      </div>

      <div className="table-responsive">
        <Table striped hover className="align-middle">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th className="text-end">Stock</th>
              <th className="text-end d-none d-md-table-cell">Mín / Máx</th>
              <th className="text-end d-none d-sm-table-cell">Precio</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td className="text-end">{p.stock}</td>
                <td className="text-end d-none d-md-table-cell">
                  {p.min} / {p.max}
                </td>
                <td className="text-end d-none d-sm-table-cell">{p.price.toFixed(2)} €</td>
                <td className="text-end">
                  <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => openEdit(p)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(p)}>
                    Borrar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal de crear / editar */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? 'Editar producto' : 'Nuevo producto'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                isInvalid={!!errors.name}
                {...register('name', { required: 'Obligatorio' })}
              />
              <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                isInvalid={!!errors.category}
                {...register('category', { required: 'Obligatorio' })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.category?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control type="number" {...register('stock')} />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio (€)</Form.Label>
                  <Form.Control type="number" step="0.01" {...register('price')} />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mínimo</Form.Label>
                  <Form.Control type="number" {...register('min')} />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Máximo</Form.Label>
                  <Form.Control type="number" {...register('max')} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              {editing ? 'Guardar cambios' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
