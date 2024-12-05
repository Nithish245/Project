import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../utils/AuthContext';
import '../styles/styles.css';

const Dashboard = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (currentUser.role === 'admin') {
      fetch('http://localhost:5000/users')
        .then((response) => response.json())
        .then((data) => setUsers(data));
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Welcome, {currentUser.name}</h1>
        <h2>Role: {currentUser.role}</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {currentUser.role === 'admin' ? (
        <div className="admin-section">
          <h3>Admin Actions</h3>
          <nav>
            <Link to="/users" className="link">
              User Management
            </Link>
            <Link to="/roles" className="link">
              Role Management
            </Link>
          </nav>
        </div>
      ) : (
        <div className="user-section">
          <h3>User Information</h3>
          <p>You have limited access to the system.</p>
          <ul style={{ listStyleType: 'none' }}>
            <li>Name: {currentUser.name}</li>
            <li>Role: {currentUser.role}</li>
          </ul>
        </div>
      )}

      {currentUser.role === 'admin' && (
        <div className="user-list">
          <h3>All Users</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
