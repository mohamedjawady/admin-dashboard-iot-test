import React, { useState, useEffect } from 'react';
import config from '../config';

const VehiclesTable = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState({ id: '', model: '', connectionInfo: '', userId: '', status: '' });
  const [vehiclesData, setVehiclesData] = useState([]);

  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    // Fetch vehicles data when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.baseURL}:3001/vehicles`, {
          method: 'GET',
          
        });
        const data = await response.json();
        setVehiclesData(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchData();
  }, [token, isModalOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedVehicle((prevVehicle) => ({ ...prevVehicle, [name]: value }));
  };

  const handleEditVehicle = (index) => {
    setEditing(true);
    setEditedVehicle(vehiclesData[index]);
    setModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${config.baseURL}:3001/vehicles/modifyVehicleStatus/${editedVehicle.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          model: editedVehicle.model,
          connection_info: editedVehicle.connectionInfo,
          user_id: editedVehicle.userId,
          status: editedVehicle.status,
        }),
      });

      if (response.ok) {
        const updatedVehicles = [...vehiclesData];
        updatedVehicles[editedVehicle.index] = editedVehicle;
        setVehiclesData(updatedVehicles);
        setEditing(false);
        setModalOpen(false);
      } else {
        console.error('Failed to save changes:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleAddVehicle = async () => {
    try {
      const response = await fetch(`${config.baseURL}:3001/vehicles/registerVehicle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          model: editedVehicle.model,
          connection_info: editedVehicle.connectionInfo,
          user_id: editedVehicle.userId,
        }),
      });

      if (response.ok) {
        const fetchData = async () => {
          try {
            const response = await fetch(`${config.baseURL}:3001/vehicles`, {
              method: 'GET',
              headers: {
                Authorization: token,
              },
            });
            const data = await response.json();
            setVehiclesData(data);
          } catch (error) {
            console.error('Error fetching vehicles:', error);
          }
        };

        fetchData();

        setModalOpen(false);
      } else {
        console.error('Failed to add vehicle:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  return (
    <>
      <table className="min-w-full bg-white">
        <tbody>
          {vehiclesData !== null && vehiclesData.map((vehicle, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b font-bold">{vehicle.id}</td>
              <td className="py-2 px-4 border-b">{vehicle.model}</td>
              <td className="py-2 px-4 border-b">{vehicle.connection_info}</td>
              <td className="py-2 px-4 border-b">{vehicle.user_id}</td>
              <td className={`py-2 px-4 border-b ${vehicle.status === 'STREAMING' ? 'text-green-500' : 'text-gray-500'}`}>
                {vehicle.status}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEditVehicle(index)}
                  className="bg-blue-300 text-white py-1 px-2 rounded focus:outline-none hover:bg-blue-500"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Vehicle Button */}
      <div className="mt-4">
        <button
          onClick={() => {
            setEditing(false);
            setEditedVehicle({ id: '', model: '', connectionInfo: '', userId: '', status: '' });
            setModalOpen(true);
          }}
          className="bg-blue-300 text-white py-2 px-4 rounded-full focus:outline-none hover:bg-blue-500 font-bold"
        >
          +
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-gray-800 bg-opacity-50 absolute inset-0"></div>
          <div className="bg-white p-8 rounded-lg z-10">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
            <form>
            {isEditing && (<div className="mb-4">
                <label htmlFor="id" className="block text-sm font-medium text-gray-600">
                  ID
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={editedVehicle.id}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>)}
              <div className="mb-4">
                <label htmlFor="model" className="block text-sm font-medium text-gray-600">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={editedVehicle.model}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="connectionInfo" className="block text-sm font-medium text-gray-600">
                  Connection Info
                </label>
                <input
                  type="text"
                  id="connectionInfo"
                  name="connectionInfo"
                  value={editedVehicle.connectionInfo}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="userId" className="block text-sm font-medium text-gray-600">
                  User ID
                </label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  value={editedVehicle.userId}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              {isEditing &&(<div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-600">
                  Status
                </label>
                <input
                  type="text"
                  id="status"
                  name="status"
                  value={editedVehicle.status}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>)}
              <button
                type="button"
                onClick={isEditing ? handleSaveEdit : handleAddVehicle}
                className="bg-blue-500 text-white py-2 px-4 rounded-full focus:outline-none font-bold"
              >
                {isEditing ? 'Save Changes' : 'Add Vehicle'}
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

export default VehiclesTable;
