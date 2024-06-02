import React, { useState, useEffect } from 'react';
import DogCRUD from './DogCRUD';
import QR from './QR';
import './Admin.css'; // Importing the CSS file

const Admin = () => {
  const [dogs, setDogs] = useState([]);
  const [error, setError] = useState(null);
  const [dogId, setDogId] = useState('');
  const [editDog, setEditDog] = useState(null);

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    try {
      const response = await fetch(`/pizzas${dogId ? `/${dogId}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dogs');
      }
      const data = await response.json();
      setDogs(data instanceof Array ? data : [data]);
    } catch (error) {
      setError('Error fetching dogs');
      console.error('Error fetching dogs:', error);
    }
  };

  const handleGetAllDogs = () => {
    setDogId('');
    fetchDogs();
  };

  const handleGetDogById = () => {
    if (!dogId) {
      setError('Please enter a valid dog ID');
      return;
    }
    fetchDogs();
  };

  const handleDeleteDog = async (id) => {
    try {
      const response = await fetch(`/pizzas/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete dog');
      }
      setDogs(dogs.filter(dog => dog.id !== id));
    } catch (error) {
      console.error('Error deleting dog:', error);
      setError('Error deleting dog');
    }
  };

  const handleCreateDog = async (count) => {
    try {
      const newDogs = [];
      for (let i = 0; i < count; i++) {
        const response = await fetch('/pizzas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: '', breed: '', age: null, password: '', lat: null, long: null }), // Set values to null or blank
        });
        if (!response.ok) {
          throw new Error(`Failed to create dog ${i + 1}`);
        }
        const createdDog = await response.json();
        newDogs.push(createdDog);
      }
      setDogs([...dogs, ...newDogs]);
    } catch (error) {
      console.error('Error creating dog:', error);
      setError('Error creating dog');
    }
  };

  const handleUpdateDog = async (updatedDog) => {
    try {
      const response = await fetch(`/pizzas/${updatedDog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDog),
      });
      if (!response.ok) {
        throw new Error('Failed to update dog');
      }
      const updatedDogs = dogs.map(dog => dog.id === updatedDog.id ? updatedDog : dog);
      setDogs(updatedDogs);
      setEditDog(null); // Clear the edit form after updating
    } catch (error) {
      console.error('Error updating dog:', error);
      setError('Error updating dog');
    }
  };

  const handleEditClick = (dog) => {
    setEditDog(dog);
  };

  return (
    <div className="admin-container"> {/* Applying the class name */}
      <h1>Admin Panel</h1>
      <hr />
      <div className="get-dogs-section">
        <div className="get-dog-by-id">
          <input
            type="text"
            placeholder="Enter Dog ID"
            value={dogId}
            onChange={(e) => setDogId(e.target.value)}
          />
          <button className="action-button" onClick={handleGetDogById}>Get Dog by ID</button>
        </div>
        <div className="get-all-dogs">
          <button className="action-button" onClick={handleGetAllDogs}>Get All Dogs</button>
        </div>
      </div>
      <ul className="dogs-list"> {/* Applying the class name */}
        {dogs.map(dog => (
          <li className="dog-item" key={dog.id}> {/* Applying the class name */}
            <span>{dog.id} : {dog.name}</span>
          </li>
        ))}
      </ul>
      {error && <p>Error: {error}</p>}

      <hr />
      <h2 className="section-title">Create Dog</h2> {/* Applying the class name */}
      <DogCRUD onCreate={handleCreateDog} />

      <hr />
      <h2 className="section-title">Update Dogs</h2> {/* Applying the class name */}
      {dogs.map(dog => (
        <div className="dog-item" key={dog.id}> {/* Applying the class name */}
          <span>{dog.id} : {dog.name}</span>
          <button className="action-button" onClick={() => handleEditClick(dog)}>Change Details</button> {/* Applying the class name */}
        </div>
      ))}

      {editDog && (
        <div className="edit-dog-form">
          <h3>Edit Dog</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdateDog(editDog);
          }}>
            <label>
              Name:
              <input
                type="text"
                value={editDog.name}
                onChange={(e) => setEditDog({ ...editDog, name: e.target.value })}
              />
            </label>
            <label>
              Breed:
              <input
                type="text"
                value={editDog.breed}
                onChange={(e) => setEditDog({ ...editDog, breed: e.target.value })}
              />
            </label>
            <label>
              Age:
              <input
                type="number"
                value={editDog.age}
                onChange={(e) => setEditDog({ ...editDog, age: parseInt(e.target.value) })}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={editDog.password}
                onChange={(e) => setEditDog({ ...editDog, password: e.target.value })}
              />
            </label>
            <label>
              Latitude:
              <input
                type="number"
                step="0.0001"
                value={editDog.lat}
                onChange={(e) => setEditDog({ ...editDog, lat: parseFloat(e.target.value) })}
              />
            </label>
            <label>
              Longitude:
              <input
                type="number"
                step="0.0001"
                value={editDog.long}
                onChange={(e) => setEditDog({ ...editDog, long: parseFloat(e.target.value) })}
              />
            </label>
            <button className="action-button" type="submit">Update Dog</button> {/* Applying the class name */}
          </form>
        </div>
      )}

      <hr />
      <h2 className="section-title">Delete Dogs</h2> {/* Applying the class name */}
      {dogs.map(dog => (
        <div className="dog-item" key={dog.id}> {/* Applying the class name */}
          <span>{dog.id} : {dog.name}</span>
          <button className="action-button" onClick={() => handleDeleteDog(dog.id)}>Delete</button> {/* Applying the class name */}
        </div>
      ))}

      <hr />
      <h2 className="section-title">Generate QR Codes</h2> {/* Applying the class name */}
      <QR />
    </div>
  );
};

export default Admin;
