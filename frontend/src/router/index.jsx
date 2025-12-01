import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute.jsx';
import PublicRoute from '../components/PublicRoute.jsx';
import Login from '../views/Login.jsx';
import Sign from '../views/Sign.jsx';
import Dashboard from '../views/Dashboard.jsx';
import Stock from '../views/Stock.jsx';
import Customer from '../views/Customer.jsx';
import Orders from '../views/Orders.jsx';
import Configurations from '../views/Configurations.jsx'

const routes = [
    { path: '/', element: <Dashboard /> },
    { path: '/stock', element: <Stock /> },
    { path: '/customer', element: <Customer /> },
    { path: '/orders', element: <Orders /> },
    { path: '/config', element: <Configurations /> }
];

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Sign /></PublicRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Sign />} />
                {routes.map((route) => (
                    <Route
                        path={route.path}
                        element={
                            <PrivateRoute>{route.element}</PrivateRoute>
                        }
                    />
                ))}
            </Routes>
        </BrowserRouter>
    );
}
