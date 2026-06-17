import { Card, ProgressBar, Button, ButtonGroup } from 'react-bootstrap';

// Determina el color según el nivel de stock respecto al mínimo.
function stockVariant(product) {
  if (product.stock <= product.min) return 'danger';
  if (product.stock <= product.min * 1.5) return 'warning';
  return 'success';
}

export default function ProductCard({ product, onAdjust }) {
  const variant = stockVariant(product);
  const pct = product.max ? Math.min(100, Math.round((product.stock / product.max) * 100)) : 0;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title className="mb-1">{product.name}</Card.Title>
          <span className="badge bg-light text-dark">{product.category}</span>
        </div>
        <Card.Subtitle className="text-muted mb-3">
          {product.stock} uds · {product.price.toFixed(2)} €
        </Card.Subtitle>

        <ProgressBar now={pct} variant={variant} className="mb-2" />
        <small className="text-muted mb-3">
          Mín {product.min} · Máx {product.max}
        </small>

        {onAdjust && (
          <ButtonGroup className="mt-auto">
            <Button variant="outline-danger" size="sm" onClick={() => onAdjust(product, -10)}>
              −10
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={() => onAdjust(product, -1)}>
              −1
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={() => onAdjust(product, +1)}>
              +1
            </Button>
            <Button variant="outline-success" size="sm" onClick={() => onAdjust(product, +10)}>
              +10
            </Button>
          </ButtonGroup>
        )}
      </Card.Body>
    </Card>
  );
}
