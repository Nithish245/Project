import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [permissions] = useState(['read', 'edit', 'delete']); // Fixed list of permissions

  useEffect(() => {
    // Fetch roles from the server
    axios.get('http://localhost:5000/roles').then((res) => setRoles(res.data));
  }, []);

  const handleAddRole = () => {
    if (newRole) {
      const role = { 
        id: Date.now(), 
        name: newRole, 
        permissions: ['read']  // Default permission "read"
      };
      
      // Add role to the server with the default "read" permission
      axios.post('http://localhost:5000/roles', role).then(() => {
        setRoles([...roles, role]);
        setNewRole(''); // Clear the input field
      });
    }
  };

  // const handlePermissionChange = (roleId, permission) => {
  //   const updatedRoles = roles.map((role) => {
  //     if (role.id === roleId) {
  //       const updatedPermissions = role.permissions.includes(permission)
  //         ? role.permissions.filter((perm) => perm !== permission)
  //         : [...role.permissions, permission];

  //       // Update the permissions on the server
  //       axios.patch(`http://localhost:5000/roles/${roleId}`, {
  //         permissions: updatedPermissions,
  //       }).then(() => {
  //         return { ...role, permissions: updatedPermissions };
  //       });
  //     }
  //     return role;
  //   });

  //   setRoles(updatedRoles); // Update the state with the new roles list
  // };

  const handlePermissionChange = (roleId, permission) => {
    const updatedRoles = roles.map((role) => {
      if (role.id === roleId) {
        const updatedPermissions = role.permissions.includes(permission)
          ? role.permissions.filter((perm) => perm !== permission)
          : [...role.permissions, permission];
  
        // Update the permissions on the server
        axios.patch(`http://localhost:5000/roles/${roleId}`, {
          permissions: updatedPermissions,
        }).then((res) => {
          // Update the state with the new role permissions
          setRoles((prev) =>
            prev.map((r) =>
              r.id === roleId ? { ...r, permissions: updatedPermissions } : r
            )
          );
        }).catch((error) => {
          console.error("Error updating role permissions:", error);
          // You can also show an error message to the user
        });
      }
      return role;
    });
  
    setRoles(updatedRoles); // Update the state with the new roles list
  };
  

  return (
    <div>
      <h2>Role Management</h2>
      <div>
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="New Role"
        />
        <button onClick={handleAddRole}>Add Role</button>
      </div>
      <ul>
        {roles.map((role) => (
          <li key={role.id}>
            <strong>{role.name}</strong>
            <div>
              {permissions.map((permission) => (
                <label key={permission}>
                  <input
                    type="checkbox"
                    checked={role.permissions.includes(permission)}
                    onChange={() => handlePermissionChange(role.id, permission)}
                  />
                  {permission.charAt(0).toUpperCase() + permission.slice(1)}
                </label>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoleManagement;
