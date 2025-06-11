import { usePermission } from './context';

export function Protected({ children, page }) {
  const hasAccess = usePermission(page, 'view');

  if (!hasAccess) {
    return null;
  }

  return children;
}
