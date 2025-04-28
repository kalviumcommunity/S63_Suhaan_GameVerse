import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <img src={game.image} alt={game.title} className="w-full h-40 object-cover rounded" />
      <h2 className="text-xl font-bold mt-2 text-white">{game.title}</h2>
      <p className="text-sm text-gray-300">{game.genre}</p>
      <Link to={`/games/${game._id}`} className="text-blue-400 hover:underline block mt-2">View Details</Link>
    </div>
  );
};

export default GameCard;
