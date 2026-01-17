import { Container, Row, Col } from 'react-bootstrap';
import { FacesTable } from '../components/FacesTable';
import './FacesPage.scss';

export function FacesPage() {
  return (
    <div
      className="faces-page-wrapper"
      style={{
        marginLeft: 'var(--sidebar-width, 250px)',
        padding: '2rem',
        transition: 'margin-left 0.3s ease',
      }}
    >
      <Container fluid className="h-100 p-0">
        <Row className="h-100 g-0">
          <Col xs={12} className="d-flex flex-column">
            <FacesTable />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
