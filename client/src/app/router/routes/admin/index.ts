import { RouteObject } from 'react-router';
import {
  AdminDashboard,
  AdminIssues,
  AdminUsers,
  AdminFlaggedReports,
  AdminCategories,
} from '@/modules/admin/pages';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    children: [
      {
        index: true,
        Component: AdminDashboard,
      },
      {
        path: 'issues',
        Component: AdminIssues,
      },
      {
        path: 'users',
        Component: AdminUsers,
      },
      {
        path: 'flagged',
        Component: AdminFlaggedReports,
      },
      {
        path: 'categories',
        Component: AdminCategories,
      }
     
    ],
  },
];
