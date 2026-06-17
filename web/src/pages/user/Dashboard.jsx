import { Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useProducts, useProductMutations } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';

export default function Dashboard() {
  const { data: products = [], isLoading, isError, error } = useProducts();
  const { adjust } = useProductMutations();

  const handleAdjust = (product, delta) => {
    adjust.mutate({ id: product.id, delta });
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (isError) {
    return <Alert variant="danger">No se pudo cargar el inventario: {error.message}</Alert>;
  }

  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= p.min).length;
  const chartData = products.map((p) => ({ name: p.name, stock: p.stock, min: p.min }));

  return (
    <>
      <h1 className="h3 mb-4">Inventario</h1>

      {/* KPIs */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={4}>
          <Card body className="text-center shadow-sm">
            <div className="text-muted small">Productos</div>
            <div className="h4 mb-0">{products.length}</div>
          </Card>
        </Col>
        <Col xs={6} md={4}>
          <Card body className="text-center shadow-sm">
            <div className="text-muted small">Unidades totales</div>
            <div className="h4 mb-0">{totalUnits}</div>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card body className="text-center shadow-sm">
            <div className="text-muted small">Bajo mínimo</div>
            <div className={`h4 mb-0 ${lowStock ? 'text-danger' : ''}`}>{lowStock}</div>
          </Card>
        </Col>
      </Row>

      {/* Gráfico (recharts) */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="h6">Nivel de stock por producto</Card.Title>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 40, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={60} fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="stock" fill="#0a1f44" name="Stock" />
                <Bar dataKey="min" fill="#c8a951" name="Mínimo" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>

      {/* Tarjetas con ajuste de stock */}
      <Row className="g-3">
        {products.map((product) => (
          <Col key={product.id} xs={12} sm={6} lg={4}>
            <ProductCard product={product} onAdjust={handleAdjust} />
          </Col>
        ))}
      </Row>
    </>
  );
}
