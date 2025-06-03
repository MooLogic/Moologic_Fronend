import { Session } from 'next-auth';

/**
 * Checks if a user can access a specific feature based on their role and worker role
 * @param session - The NextAuth session object
 * @param feature - The feature to check access for (e.g., 'health', 'milk', 'finance')
 * @returns boolean - Whether the user can access the feature
 */
export function canAccessFeature(session: Session | null, feature: string): boolean {
  if (!session) return false;
  
  const userRole = session.user.role;
  const workerRole = session.user.worker_role;
  
  // Superuser and admin always have access
  if (userRole === 'superuser' || userRole === 'admin') return true;
  
  // Worker role-based access
  if (userRole === 'worker') {
    switch (feature) {
      case 'health':
        return workerRole === 'veterinary';
      case 'milk':
        return workerRole === 'milktracker';
      case 'finance':
        return workerRole === 'finance';
      default:
        return false;
    }
  }
  
  // Default deny for other roles
  return false;
}

/**
 * Checks if a user can view the government dashboard
 * @param session - The NextAuth session object
 * @returns boolean - Whether the user can view the government dashboard
 */
export function canViewGovernmentDashboard(session: Session | null): boolean {
  if (!session) return false;
  
  const userRole = session.user.role;
  
  // Only superuser, admin, and government users can view government dashboard
  return userRole === 'superuser' || userRole === 'admin' || userRole === 'government';
}

/**
 * Checks if a user can access the farm dashboard
 * @param session - The NextAuth session object
 * @returns boolean - Whether the user can access the farm dashboard
 */
export function canAccessFarmDashboard(session: Session | null): boolean {
  if (!session) return false;
  
  const userRole = session.user.role;
  
  // Only superuser, admin, and farm users can access farm dashboard
  return userRole === 'superuser' || userRole === 'admin' || userRole === 'farm';
}
