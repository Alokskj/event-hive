import React, { lazy } from "react";
import { RouteObject } from "react-router";
import { CitizenRoute } from "@/modules/auth";

// // Lazy load auth pages
// const ReportsPage = lazy(() => 
//   import('@/modules/reports').then(module => ({ default: module.ReportsListPage }))
// );

// const CreateReportPage = lazy(() => 
//   import('@/modules/reports').then(module => ({ default: module.CreateReportPage }))
// );

// const ReportDetailsPage = lazy(() => 
//   import('@/modules/reports').then(module => ({ default: module.ReportDetailsPage }))
// );

// const MyReportsPage = lazy(() => 
//   import('@/modules/reports').then(module => ({ default: module.MyReportsPage }))
// );

const userRoutes: RouteObject[] = [
    // { 
    //     path: '/', 
    //     element: React.createElement(CitizenRoute, null, React.createElement(ReportsPage))
    // },
    // { 
    //     path: '/reports/create', 
    //     element: React.createElement(CitizenRoute, null, React.createElement(CreateReportPage))
    // },
    // { 
    //     path: '/reports/:id', 
    //     element: React.createElement(CitizenRoute, null, React.createElement(ReportDetailsPage))
    // },
    // { 
    //     path: '/my-reports', 
    //     element: React.createElement(CitizenRoute, null, React.createElement(MyReportsPage))
    // },
];

export default userRoutes;