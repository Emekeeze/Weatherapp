import React, { useReducer } from 'react';
import axios from 'axios';
import "../App.css";

const initialState = {
  city: '',
  weather: null,
  error: '',
  loading: false
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CITY':
      return { ...state, city: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_WEATHER':
      return { ...state, weather: action.payload, error: '', loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, weather: null, loading: false };
    case 'RESET_CITY':
      return { ...state, city: '' };
    default:
      return state;
  }
}

export default function Weather() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (state.city.trim() === '') {
      alert('Please enter a city name');
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });


    try {
      const response = await axios.post("https://weatherapp-4-6ft3.onrender.com/weather", {
        city: state.city
      });

      dispatch({ type: 'SET_WEATHER', payload: response.data });
    } catch (err) {
      console.error(err);
      dispatch({ type: 'SET_ERROR', payload: 'Could not fetch weather data' });
    } finally {
      dispatch({ type: 'RESET_CITY' });
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h2>Weather App</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="city">City name</label>
        <input
          type="text"
          placeholder="Enter city"
          required
          value={state.city}
          onChange={(e) => dispatch({ type: 'SET_CITY', payload: e.target.value })}
          style={{ padding: '8px', margin: '10px', width: '100%' }}
        />
        <input type="submit" value="Get Weather" />
      </form>

      {/* Loading spinner */}
      {state.loading && (
        <div className='loading-spinner' style={{ marginTop: '20px' }}>
          <p>Loading...</p>
          {/* Optional: use a CSS spinner here */}
        </div>
      )}

      {/* Error message */}
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}

      {/* Weather data */}
      {state.weather && !state.loading && (
        <div style={{ marginTop: '20px', }}>
          <h3>{state.weather.city}</h3>
          <p>{state.weather.temperature}°C</p>
          <p>{state.weather.description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${state.weather.icon}@2x.png`}
            alt="weather icon"
          />
        </div>
      )}
    </div>
  );
}
