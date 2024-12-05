import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Permissions = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/roles').then((res) => setRoles(res.data));
  }, []);

  return (
    <div>
      <h2>Permissions Management</h2>
      <ul>
        {roles.map((role) => (
          <li key={role.id}>
            <h3>{role.name}</h3>
            <ul>
              {role.permissions.map((permission, idx) => (
                <li key={idx}>{permission}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Permissions;
