import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../utils/AuthContext';
import '../styles/styles.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', role: 'user', status: 'Active', permissions: ['read'] });
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({ name: '', role: '', status: '', permissions: [] });
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  const handleCreate = () => {
    if (currentUser.role !== 'admin') return;

    // Include "read" permission by default for all new users
    const userWithPermissions = { ...newUser, permissions: ['read'] }; // Ensure "read" permission is included
    
    fetch('http://localhost:5000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...userWithPermissions, id: Date.now() }),
    }).then(() => {
      setUsers([...users, { ...userWithPermissions, id: Date.now() }]);
      setNewUser({ name: '', role: 'user', status: 'Active', permissions: ['read'] }); // Reset form
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditedUser({ name: user.name, role: user.role, status: user.status, permissions: user.permissions });
  };

  const handleSave = (id) => {
    fetch(`http://localhost:5000/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedUser),
    }).then(() => {
      setUsers(
        users.map((user) => (user.id === id ? { ...user, ...editedUser } : user))
      );
      setEditingUser(null);
    });
  };

  const handleDelete = (id) => {
    if (currentUser.role !== 'admin') return;
    fetch(`http://localhost:5000/users/${id}`, { method: 'DELETE' }).then(() => {
      setUsers(users.filter((user) => user.id !== id));
    });
  };

  return (
    <div>
      <h2>User Management</h2>

      {currentUser.role === 'admin' && (
        <div className="create-user">
          <h3>Create New User</h3>
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleCreate}>Create</button>
        </div>
      )}

      <div className="user-list">
        <h3>All Users</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              {currentUser.role === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                {editingUser === user.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editedUser.name}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, name: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={editedUser.role}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, role: e.target.value })
                        }
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={editedUser.status}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, status: e.target.value })
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleSave(user.id)}>Save</button>
                      <button onClick={() => setEditingUser(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.name}</td>
                    <td>{user.role}</td>
                    <td>{user.status}</td>
                    {currentUser.role === 'admin' && (
                      <td>
                        <button onClick={() => handleEdit(user)}>Edit</button>
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
