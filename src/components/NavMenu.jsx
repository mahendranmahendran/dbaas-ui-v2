import { useRBAC } from '../utils/hooks/useRBAC-new';
import { PAGE_ACCESS } from '../rbac/clickhouse-roles';

export default function NavMenu() {
  const { hasPageAccess } = useRBAC();
  const showAdmin = hasPageAccess('admin');
  const showMonitoring = hasPageAccess('monitoring');
  const showBilling = hasPageAccess('billing');
  const showSQLPlayground = hasPageAccess('sqlPlayground');

  return (
    <nav className="flex gap-4 p-4">
      <Link to="/">Home</Link>
      <Link to="/pricing">Pricing</Link>
      {showSQLPlayground && <Link to="/playground">SQL Playground</Link>}
      {showBilling && <Link to="/billing">Billing</Link>}
      {showMonitoring && <Link to="/monitoring">Monitoring</Link>}
      {showAdmin && <Link to="/admin">Admin</Link>}
      <Link to="/profile">Profile</Link>
    </nav>
  );
}