const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/tasks`;
const AI_URL = `${BASE_URL}/api/ai`;

const getAuthHeaders = () => {
    const student = JSON.parse(localStorage.getItem('student'));
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${student?.token}`
    };
};

const getTasks = async () => {
    const response = await fetch(API_URL, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
};

const addTask = async (title) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title })
    });
    if (!response.ok) throw new Error('Failed to add task');
    return await response.json();
};

const updateTask = async (id, status) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update task');
    return await response.json();
};

const deleteTask = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return await response.json();
};

const generateSubtasks = async (title) => {
    const response = await fetch(`${AI_URL}/generate-subtasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title })
    });
    if (!response.ok) throw new Error('Failed to generate subtasks');
    return await response.json();
};

const taskService = {
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    generateSubtasks
};

export default taskService;
