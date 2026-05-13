const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/auth`;

// Register student
const register = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw { response: { data } };
    }
    return data;
};

// Login student
const login = async (userData) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw { response: { data } };
    }

    if (data.token) {
        localStorage.setItem('student', JSON.stringify(data));
    }
    return data;
};

// Logout student
const logout = () => {
    localStorage.removeItem('student');
};

// Get current student
const getCurrentStudent = () => {
    const student = localStorage.getItem('student');
    return student ? JSON.parse(student) : null;
};

const authService = {
    register,
    login,
    logout,
    getCurrentStudent,
};

export default authService;
