import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './Layout';
import ProtectedRoute from './ProtectedRoute';

const AuthenticatedLayout = () => {
    return (
        <ProtectedRoute>
            <Layout>
                <Outlet />
            </Layout>
        </ProtectedRoute>
    );
};

export default AuthenticatedLayout;
