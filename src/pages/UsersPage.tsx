import { Container } from 'react-bootstrap';
import { UsersTable } from '../components/UsersTable';
import './UsersPage.scss';

export function UsersPage() {
  return (
    <div
      className="users-page-wrapper"
      style={{
        marginLeft: 'var(--sidebar-width, 250px)',
        padding: '2rem',
        transition: 'margin-left 0.3s ease',
      }}
    >
      <Container fluid className="h-100 p-0">
        <div className="users-page-content">
          <UsersTable />
        </div>
      </Container>
    </div>
  );
}
