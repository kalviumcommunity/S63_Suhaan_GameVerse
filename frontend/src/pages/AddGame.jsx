import React, { useState } from 'react';
import axios from 'axios';

const AddGame = () => {
  const [gameData, setGameData] = useState({
    title: '',
    genre: '',
    platform: '',
    description: '',
    releaseDate: '',
    imageUrl: '',
  });

  const handleChange = (e) => {
    setGameData({ ...gameData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/games', gameData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Game added successfully!');
      setGameData({
        title: '',
        genre: '',
        platform: '',
        description: '',
        releaseDate: '',
        imageUrl: '',
      });
    } catch (err) {
      console.error('Error adding game:', err);
      alert('Failed to add game.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg w-full max-w-xl shadow-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Game</h2>

        <input
          type="text"
          name="title"
          value={gameData.title}
          onChange={handleChange}
          placeholder="Game Title"
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
          required
        />

        <input
          type="text"
          name="genre"
          value={gameData.genre}
          onChange={handleChange}
          placeholder="Genre"
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
          required
        />

        <input
          type="text"
          name="platform"
          value={gameData.platform}
          onChange={handleChange}
          placeholder="Platform (PC, PS5, Xbox...)"
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
          required
        />

        <input
          type="date"
          name="releaseDate"
          value={gameData.releaseDate}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />

        <input
          type="text"
          name="imageUrl"
          value={gameData.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
        />

        <textarea
          name="description"
          value={gameData.description}
          onChange={handleChange}
          placeholder="Game Description"
          rows="4"
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 p-3 rounded font-semibold"
        >
          Add Game
        </button>
      </form>
    </div>
  );
};

export default AddGame;
