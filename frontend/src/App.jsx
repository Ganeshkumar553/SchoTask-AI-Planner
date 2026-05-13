import React, { useState, useEffect } from 'react';
import authService from './services/authService';
import taskService from './services/taskService';
import { LogOut, Plus, Check, Trash2, Mail, Lock, BrainCircuit, Loader2 } from 'lucide-react';

function App() {
  const [student, setStudent] = useState(authService.getCurrentStudent());
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [loadingAi, setLoadingAi] = useState(null); // Track which task is generating subtasks

  useEffect(() => {
    if (student) {
      fetchTasks();
    }
  }, [student]);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const data = await authService.login({ email, password });
        setStudent(data);
        setSuccess('Logged in successfully!');
      } else {
        await authService.register({ email, password });
        setSuccess('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || 'Authentication failed';
      setError(serverMsg);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setStudent(null);
    setTasks([]);
  };

  const addTask = async () => {
    if (taskInput.trim()) {
      try {
        const newTask = await taskService.addTask(taskInput);
        setTasks([newTask, ...tasks]);
        setTaskInput('');
      } catch (err) {
        setError('Failed to add task');
      }
    }
  };

  const toggleTask = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await taskService.updateTask(task.id, newStatus);
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleBrainstorm = async (task) => {
    setLoadingAi(task.id);
    try {
      const subtasks = await taskService.generateSubtasks(task.title);
      // Add subtasks as new tasks
      for (const subtask of subtasks) {
        const newTask = await taskService.addTask(`${subtask} (Sub-task for: ${task.title})`);
        setTasks(prev => [newTask, ...prev]);
      }
      setSuccess(`Generated 3 sub-tasks for: ${task.title}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('AI Brainstorming failed. Check your API key.');
    } finally {
      setLoadingAi(null);
    }
  };

  if (!student) {
    return (
      <div className="auth-container">
        <div className="stars"></div>
        <div className="glass-card">
          <header>
            <h1>SchoTask</h1>
            <p className="subtitle">{isLogin ? 'Welcome Back, Scholar' : 'Create Student Account'}</p>
          </header>

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg" style={{color: 'var(--success-green)', textAlign: 'center', marginBottom: '1rem'}}>{success}</div>}

          <form onSubmit={handleAuth}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="you@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="glass-btn">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <div className="auth-toggle">
            {isLogin ? "New student? " : "Already registered? "}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Create Account' : 'Login Now'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="stars"></div>
      <header>
        <div className="counter-badge">
          <span className="count">{tasks.length}</span>
          <span className="label">Total Tasks</span>
        </div>
        <h1>SchoTask</h1>
        <p className="subtitle">Focusing as: {student.email}</p>
      </header>

      <main className="glass-card">
        {error && <div className="error-msg" style={{marginBottom: '1rem'}}>{error}</div>}
        {success && <div className="success-msg" style={{color: 'var(--success-green)', textAlign: 'center', marginBottom: '1rem'}}>{success}</div>}
        
        <div className="input-section">
          <input 
            type="text" 
            placeholder="What's on your mind today?" 
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <button className="glass-btn" style={{width: 'auto'}} onClick={addTask}>
            <Plus size={20} />
            <span style={{marginLeft: '4px'}}>Add</span>
          </button>
        </div>

        <ul id="task-list">
          {tasks.map(task => (
            <li key={task.id} className={`task-item ${task.status === 'completed' ? 'done' : ''}`}>
              <div 
                className={`task-checkbox ${task.status === 'completed' ? 'checked' : ''}`} 
                onClick={() => toggleTask(task)}
              >
                {task.status === 'completed' && <Check size={16} strokeWidth={4} />}
              </div>
              <div className="task-content">
                {task.title}
              </div>
              <div className="task-actions" style={{display: 'flex', gap: '8px'}}>
                <button 
                  className="ai-btn" 
                  onClick={() => handleBrainstorm(task)}
                  disabled={loadingAi === task.id}
                  style={{
                    background: 'rgba(100, 100, 255, 0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    color: '#a0a0ff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Brainstorm subtasks"
                >
                  {loadingAi === task.id ? <Loader2 size={18} className="animate-spin" /> : <BrainCircuit size={18} />}
                </button>
                <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          Logout from Schotask
        </button>
      </main>
    </div>
  );
}

export default App;
