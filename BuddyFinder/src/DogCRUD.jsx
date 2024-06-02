import React, { useState } from 'react';

const API_URL = '/pizzas';
const headers = {
  'Content-Type': 'application/json',
};

function DogCRUD() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [numberOfDogs, setNumberOfDogs] = useState('');

  const generateRandomPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_+=';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
  };

  const handleCreate = async () => {
    const newDogs = [];
    for (let i = 0; i < numberOfDogs; i++) {
      const password = generateRandomPassword();
      const formattedDog = {
        password: password,
        name: '',
        breed: '',
        age: null,
        photo1URL: '',
        photo2URL: '',
        photo3URL: '',
        number: null,
        email: '',
        locationLAT: null,
        locationLONG: null,
      };
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedDog),
        });
        if (!response.ok) {
          throw new Error(`Failed to create dog ${i + 1}`);
        }
        const createdDog = await response.json();
        newDogs.push(createdDog);
      } catch (error) {
        console.error('Error creating dog:', error.message);
        setError(error.message);
      }
    }
    setData([...data, ...newDogs]);
  };

  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
        <div>
          <label>
            Number of new Dogs:
            <input
              type="number"
              value={numberOfDogs}
              onChange={(e) => setNumberOfDogs(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Create Dogs</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default DogCRUD;
