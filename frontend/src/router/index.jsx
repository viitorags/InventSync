import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../views/Home.jsx';
import Login from '../views/Login.jsx';
import Sign from '../views/Sign.jsx';
import Dashboard from '../views/Dashboard.jsx';
import Stock from '../views/Stock.jsx';
import Customer from '../views/Customer.jsx';
import Orders from '../views/Orders.jsx';
import Configurations from '../views/Configurations.jsx'

const routes = [
    { path: '/', element: <Dashboard /> },
    { path: '/home', element: <Home /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Sign /> },
    { path: '/stock', element: <Stock /> },
    { path: '/customer', element: <Customer /> },
    { path: '/orders', element: <Orders /> },
    { path: '/config', element: <Configurations /> }
];

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                {routes.map((route) => (
                    <Route
                        path={route.path}
                        element={route.element}
                    />
                ))}
            </Routes>
        </BrowserRouter>
    );
}
