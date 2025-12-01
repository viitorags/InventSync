export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    UPDATE_USER: `${API_BASE_URL}/auth/update`,
    DELETE_USER: `${API_BASE_URL}/auth/delete`,

    PRODUCTS: `${API_BASE_URL}/products`,
    PRODUCT_BY_ID: (id) => `${API_BASE_URL}/products?product_id=${id}`,

    CUSTOMERS: `${API_BASE_URL}/customers`,
    CUSTOMER_BY_ID: (id) => `${API_BASE_URL}/customers?customer_id=${id}`,

    ORDERS: `${API_BASE_URL}/orders`,
    ORDER_BY_ID: (id) => `${API_BASE_URL}/orders?order_id=${id}`,

    REPORT_PRODUCTS: (format) => `${API_BASE_URL}/reports/${format}/products`,
    REPORT_CUSTOMERS: (format) => `${API_BASE_URL}/reports/${format}/clients`,
    REPORT_ORDERS: (format) => `${API_BASE_URL}/reports/${format}/sales`,
};

export const getAuthHeaders = (token = null) => {
    const authToken = token || localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
};

export const apiGet = async (url, token = null) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
    });
    return response;
};

export const apiPost = async (url, data, token = null) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
    });
    return response;
};

export const apiPut = async (url, data, token = null) => {
    const response = await fetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
    });
    return response;
};

export const apiDelete = async (url, token = null) => {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
    });
    return response;
};
