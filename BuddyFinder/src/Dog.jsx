import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Dog.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const API_URL = '/pizzas';
const EMAIL_API_URL = '/api/send-email';

const Dog = ({ dogId, dogPassword }) => {
  const [dogData, setDogData] = useState(null);
  const [error, setError] = useState(null);

  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState(0);
  const [profilePicURL, setProfilePicURL] = useState('');
  const [photo1URL, setPhoto1URL] = useState('');
  const [photo2URL, setPhoto2URL] = useState('');
  const [photo3URL, setPhoto3URL] = useState('');
  const [number, setNumber] = useState(0);
  const [email, setEmail] = useState('');
  const [locationLAT, setLocationLAT] = useState(0.0);
  const [locationLONG, setLocationLONG] = useState(0.0);
  const [locationLAT1, setLocationLAT1] = useState(0.0);
  const [locationLONG1, setLocationLONG1] = useState(0.0);
  const [locationLAT2, setLocationLAT2] = useState(0.0);
  const [locationLONG2, setLocationLONG2] = useState(0.0);
  const [locationLAT3, setLocationLAT3] = useState(0.0);
  const [locationLONG3, setLocationLONG3] = useState(0.0);

  const dogPhotos = [photo1URL, photo2URL, photo3URL];

  const [showGallery, setShowGallery] = useState(false);
  const [lastSeenLocations, setLastSeenLocations] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const mapRef = useRef(null);

  const fetchDogData = () => {
    fetch(`${API_URL}/${dogId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        return response.json();
      })
      .then(data => {
        if (data.password !== dogPassword) {
          throw new Error('Invalid password');
        }
        setDogData(data);
        updateDogData(data);
      })
      .catch(error => setError(error));
  };
  
  const updateDogData = (data) => {
    const item = data;
    if (item) {
      setPassword(item.password)
      setName(item.name);
      setBreed(item.breed);
      setAge(item.age);
      setProfilePicURL(item.profilePicURL);
      setPhoto1URL(item.photo1URL);
      setPhoto2URL(item.photo2URL);
      setPhoto3URL(item.photo3URL);
      setNumber(item.number);
      setEmail(item.email);
      setLocationLAT(item.locationLAT);
      setLocationLONG(item.locationLONG);
      setLocationLAT1(item.locationLAT1);
      setLocationLONG1(item.locationLONG1);
      setLocationLAT2(item.locationLAT2);
      setLocationLONG2(item.locationLONG2);
      setLocationLAT3(item.locationLAT3);
      setLocationLONG3(item.locationLONG3);
    }
  };

  useEffect(() => {
    fetchDogData();
  }, [dogId, dogPassword]);

  useEffect(() => {
    let lat = locationLAT;
    let lng = locationLONG;
    let zoom = 13;

    if ((lat === null || lng === null) || (lat === 0 && lng === 0)) {
      lat = -30.5595; // Approximate center of South Africa
      lng = 22.9375; 
      zoom = 6; // Zoom level to show the whole country
    }

    if (mapRef.current && document.getElementById('leaflet-map')) {
      mapRef.current.setView([lat, lng], zoom);
    } else if (document.getElementById('leaflet-map')) {
      const map = L.map('leaflet-map').setView([lat, lng], zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      mapRef.current = map;
    }
  }, [locationLAT, locationLONG]);

  useEffect(() => {
    document.body.classList.add('dog-background');
    return () => {
      document.body.classList.remove('dog-background');
    };
  }, []);

  const handleLastSeenClick = () => {
    if (lastSeenLocations.length < 5) {
      const timestamp = new Date().toISOString();
  
      if ('geolocation' in navigator) {
        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLoadingLocation(false);
            const { latitude, longitude } = position.coords;
  
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
              .then(response => response.json())
              .then(data => {
                const suburb = data.address.suburb || 'Unknown';
                const city = data.address.city || 'Unknown';
                const province = data.address.state || 'Unknown';
                const location = `${suburb}, ${city}, ${province}`;
  
                setLastSeenLocations(prevLocations => {
                  const newLocations = [{ location, timestamp }, ...prevLocations];
  
                  if (newLocations.length > 3) {
                    newLocations.length = 3;
                  }
  
                  fetch(EMAIL_API_URL, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      to: 'berrievz0120@gmail.com',
                      subject: 'LastSeen Update',
                      text: `Hi, your dog has been found!\n\nLocation: ${location}\nTime: ${new Date(timestamp).toLocaleString()}`,
                    }),
                  })
                  .then(response => {
                    if (!response.ok) {
                      throw new Error('Failed to send email');
                    }
                    return response.json();
                  })
                  .then(data => {
                    console.log('Email sent successfully:', data);
                  })
                  .catch(error => {
                    console.error('Error sending email:', error);
                    alert('Failed to send email.');
                  });
  
                  return newLocations;
                });
              })
              .catch(error => {
                console.error('Error fetching location details:', error);
                alert('Failed to fetch location details.');
              });
          },
          (error) => {
            setLoadingLocation(false);
            console.error('Error getting location:', error);
            alert('Failed to get device location.');
          }
        );
      } else {
        alert('Geolocation is not supported by your browser.');
      }
    } else {
      alert('You can only add up to five last seen locations.');
    }
  };
  
  const handleLocationClick = (location, timestamp) => {
    alert(`Location: ${location}\nTime: ${new Date(timestamp).toLocaleTimeString()}\nDate: ${new Date(timestamp).toLocaleDateString()}`);
  };

  const handleGoogleMapsLink = (location) => {
    const query = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="container">
      {error && <div className="error">{error.message}</div>}
      {!error && dogData && (
        <>
          <div className="profile-section">
            <div className="profile-picture">
              <img src={profilePicURL} alt="Profile" className="profile-img" />
            </div>
            <div className="profile-info">
              <h2 className="profile-name">Name: {name}</h2>
              <p className="profile-breed">Breed: {breed}</p>
              <p className="profile-age">Age: {age}</p>
              <p className='profile-password'>pass: {password}</p>
            </div>
          </div>
          <button onClick={() => setShowGallery(!showGallery)} className="gallery-button">
            {showGallery ? 'Hide Gallery' : 'Show Gallery'}
          </button>
          <div className="gallery">
            {showGallery && dogPhotos.map((photo, index) => (
              <img key={index} src={photo} alt={`Dog Photo ${index + 1}`} className="gallery-photo" />
            ))}
          </div>
          <div className="contact-section">
            <h3>Reach Out To My Owner</h3>
            <div className="contact-buttons">
              <a href={`https://wa.me/${number}`} className="contact-link">
                <button className="contact-button whatsapp">
                  <i className="fab fa-whatsapp icon"></i>
                </button>
              </a>
              <a href={`mailto:${email}`} className="contact-link">
                <button className="contact-button gmail">
                  <i className="fa fa-envelope icon"></i>
                </button>
              </a>
              <a href={`tel:${number}`} className="contact-link">
                <button className="contact-button phone">
                  <i className="fa fa-phone icon"></i>
                </button>
              </a>
            </div>
          </div>

          <div className="last-seen-section">
            <p>If I am lost, please add my last seen location so that my human can know I am safe.</p>
            <div className="last-seen-button-wrapper">
              <button onClick={handleLastSeenClick} className="last-seen-button" disabled={loadingLocation}>
                {loadingLocation && <i className="fas fa-spinner fa-spin icon"></i>}
                {!loadingLocation && <i className="fas fa-plus icon"></i>}
                Last seen Location
              </button>
            </div>
          </div>
          {lastSeenLocations.map((location, index) => (
            <div key={index} className="location-item">
              <span>{location.location} <button onClick={() => handleLocationClick(location.location, location.timestamp)} className="location-detail-button">Details</button></span>
              <button onClick={() => handleGoogleMapsLink(location.location)} className="location-map-button">Open in Google Maps</button>
            </div>
          ))}
          <div className="territory-section">
            <hr/>
            <div className="territory-title">This is my territory</div>
          </div>
          <div id="leaflet-map" className="map"></div>
        </>
      )}
    </div>
  );
};

export default Dog;
