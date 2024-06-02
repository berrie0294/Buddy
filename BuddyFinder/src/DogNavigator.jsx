import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Dog from './Dog';

const API_URL = '/pizzas';

const DogNavigator = () => {
  const { id, password } = useParams();
  const navigate = useNavigate();
  const [dogProfiles, setDogProfiles] = useState([]);
  const [currentDogIndex, setCurrentDogIndex] = useState(0);

  useEffect(() => {
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch dog profiles');
        }
        return response.json();
      })
      .then(data => {
        setDogProfiles(data);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (dogProfiles.length > 0) {
      const currentIndex = dogProfiles.findIndex(dog => dog.id === parseInt(id));
      if (currentIndex !== -1) {
        setCurrentDogIndex(currentIndex);
      } else {
        navigate('/'); // Navigate to default route if dog profile not found
      }
    }
  }, [id, dogProfiles, navigate]);

  const handleNext = () => {
    const nextIndex = (currentDogIndex + 1) % dogProfiles.length;
    const nextDogId = dogProfiles[nextIndex].id;
    const nextDogPassword = dogProfiles[nextIndex].password;
    navigate(`/dog/${nextDogId}/${nextDogPassword}`);
  };

  const handlePrevious = () => {
    const prevIndex = (currentDogIndex - 1 + dogProfiles.length) % dogProfiles.length;
    const prevDogId = dogProfiles[prevIndex].id;
    const prevDogPassword = dogProfiles[prevIndex].password;
    navigate(`/dog/${prevDogId}/${prevDogPassword}`);
  };

  if (dogProfiles.length === 0) {
    return <div>Loading...</div>;
  }

  const currentDogId = dogProfiles[currentDogIndex].id;
  const currentDogPassword = dogProfiles[currentDogIndex].password;

  return (
    <div>
      <button onClick={handlePrevious}>Previous</button>
      <button onClick={handleNext}>Next</button>
      <Dog dogId={currentDogId} dogPassword={currentDogPassword} />
    </div>
  );
};

export default DogNavigator;
