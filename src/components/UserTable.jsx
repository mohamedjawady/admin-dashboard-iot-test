import React, { useEffect, useState } from 'react';
import config from '../config';

const UserTable = () => {
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ username: '', access_level: '', connection_info: '', password: '' });
  const [usersData, setUsersData] = useState([]);
  
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    // Fetch users data when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.baseURL}:3000/users/`, {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        setUsersData(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, [token, usersData]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleEditUser = (index) => {
    setEditing(true);
    setEditedUser({ ...usersData[index], index });
    setModalOpen(true);
  };


  const handleSaveEdit = async () => {
    try {
      // Add validation logic if needed
      const response = await fetch(`${config.baseURL}:3000/admin/${editedUser.username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          username: editedUser.username,
          password: editedUser.password,
          connection_info: editedUser.connectionInfo,
          access_level: editedUser.accessLevel,
        }),
      });
  
      if (response.ok) {
        const updatedUsers = [...usersData];
        updatedUsers[editedUser.index] = { ...editedUser };
        setUsersData(updatedUsers);
        setEditing(false);
        setModalOpen(false);
      } else {
        console.error('Failed to save changes:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };
  

  const handleAddUser = async () => {
    try {
      // Add validation logic if needed
      const response = await fetch(`${config.baseURL}:3000/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(editedUser),
      });
  
      if (response.ok) {
        // Fetch the updated list of users after adding a new user
        const fetchData = async () => {
          try {
            const response = await fetch(`${config.baseURL}:3000/users/`, {
              method: 'GET',
              headers: {
                Authorization: token,
              },
            });
            const data = await response.json();
            setUsersData(data);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };
  
        fetchData();
  
        setModalOpen(false);
      } else {
        console.error('Failed to add user:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };



  return (
    <>
      <table className="min-w-full bg-white">
        <tbody>
          {usersData.map((user, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b font-bold">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.access_level}</td>
              <td className="py-2 px-4 border-b">{user.connection_info}</td>
              <td className="py-2 px-4 border-b">{"xxxx" + user.password.substr(4)}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEditUser(index)}
                  className="bg-blue-300 text-white py-1 px-2 rounded focus:outline-none hover:bg-blue-500"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add User Button */}
      <div className="mt-4">
        <button
          onClick={() => {
            setEditing(false);
            setEditedUser({ username: '', accessLevel: '', connectionInfo: '' });
            setModalOpen(true);
          }}
          className="bg-blue-500 text-white py-2 px-4 rounded-full focus:outline-none font-bold"
        >
          +
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-gray-800 bg-opacity-50 absolute inset-0"></div>
          <div className="bg-white p-8 rounded-lg z-10">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit User' : 'Add User'}</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={editedUser.username}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="accessLevel" className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="text"
                  id="password"
                  name="password"
                  value={editedUser.password}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="accessLevel" className="block text-sm font-medium text-gray-600">
                  Access Level
                </label>
                <input
                  type="text"
                  id="accessLevel"
                  name="accessLevel"
                  value={editedUser.accessLevel}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <button
                type="button"
                onClick={isEditing ? handleSaveEdit : handleAddUser}
                className="bg-blue-500 text-white py-2 px-4 rounded-full focus:outline-none font-bold"
              >
                {isEditing ? 'Save Changes' : 'Add User'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setEditing(false);
                }}
                className="ml-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserTable;
