import { useState } from 'react';
import { usePermission, useRBAC } from '../../rbac/context.jsx';
import { useAuth } from '../../utils/hooks/useAuth.jsx';
import { RESOURCES, ACTIONS } from '../../rbac/access.jsx';

// User Management Section
export function UserSection() {
  const canManageUsers = usePermission(RESOURCES.ADMIN.USERS, ACTIONS.MANAGE);
  
  return canManageUsers ? (
    <section className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <div className="space-y-4">
        <UserList />
        <InviteUserForm />
      </div>
    </section>
  ) : null;
}

// Database Admin Section 
export function DatabaseSection() {
  const canManageDB = usePermission(RESOURCES.ADMIN.SYSTEM, ACTIONS.MANAGE);
  const { user } = useAuth();

  return canManageDB ? (
    <section className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Database Controls
        {user.role === 'client_admin' && (
          <span className="text-sm text-gray-500 ml-2">(View Only)</span>
        )}
      </h2>
      <DatabaseControls />
    </section>
  ) : null;
}

// Mini-components (not exported)
function UserList() {
  const { permissions } = useRBAC();
  const canDelete = usePermission(RESOURCES.ADMIN.USERS, ACTIONS.DELETE);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            {canDelete && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Sample data - in a real app, this would come from API */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
            <td className="px-6 py-4 whitespace-nowrap">Client Admin</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </td>
            {canDelete && (
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function InviteUserForm() {
  const [formData, setFormData] = useState({ email: '', role: 'client_analyst' });
  const canInvite = usePermission(RESOURCES.ADMIN.USERS, ACTIONS.CREATE);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Inviting user:', formData);
  };

  if (!canInvite) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="client_analyst">Client Analyst</option>
          <option value="client_admin">Client Admin</option>
        </select>
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Send Invite
      </button>
    </form>
  );
}

function DatabaseControls() {
  const { user } = useAuth();
  const canManage = usePermission(RESOURCES.ADMIN.SYSTEM, ACTIONS.MANAGE);
  const canView = usePermission(RESOURCES.ADMIN.SYSTEM, ACTIONS.VIEW);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">System Status</h3>
          <div className="mt-2 text-sm text-gray-500">
            <div className="flex justify-between items-center">
              <span>CPU Usage</span>
              <span className="font-medium">45%</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span>Memory Usage</span>
              <span className="font-medium">2.3GB / 8GB</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span>Storage</span>
              <span className="font-medium">156GB / 500GB</span>
            </div>
          </div>
        </div>

        {canManage && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            <div className="mt-2 space-y-2">
              <button className="w-full px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Backup Database
              </button>
              <button className="w-full px-3 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">
                Optimize Performance
              </button>
              {user.role === 'product_owner' && (
                <button className="w-full px-3 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">
                  Reset System
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}