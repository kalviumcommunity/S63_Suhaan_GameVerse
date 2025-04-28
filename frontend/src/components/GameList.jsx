import React, { useEffect, useState } from 'react';
import GameCard from './GameCard';

const GameList = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/games');
        const data = await res.json();
        setGames(data);
      } catch (error) {
        console.error('Failed to fetch games:', error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {games.map(game => (
        <GameCard key={game._id} game={game} />
      ))}
    </div>
  );
};

export default GameList;
