import { useAuth } from '../../utils/hooks/useAuth-new';
import { Protected } from '../../rbac/components';
import { UserSection, DatabaseSection } from './AdminComponents';
import { RESOURCES, ACTIONS } from '../../rbac/access';

export default function AdminPortal() {
  const { user } = useAuth();
  
  return (
    <div className="admin-portal">
      <h1 className="text-2xl font-bold">
        {user.role === 'client_admin' ? 'Client Admin' : 'System Admin'} Dashboard
      </h1>

      {/* Combined protection for admin-only sections */}
      <Protected 
        checks={[
          { resource: RESOURCES.ADMIN.VIEW, action: ACTIONS.VIEW },
          { resource: RESOURCES.ADMIN.USERS, action: ACTIONS.VIEW },
          { resource: RESOURCES.ADMIN.SYSTEM, action: ACTIONS.VIEW }
        ]}
        requireAll={true}
      >
        <div className="admin-sections space-y-6 mt-6">
          <UserSection />
          <DatabaseSection />
        </div>
      </Protected>
    </div>
  );
}