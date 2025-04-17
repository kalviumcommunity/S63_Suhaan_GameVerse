import { useEffect, useState } from 'react';
import Header from './components/Header';
import GameList from './components/GameList';

function App() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/games') // Your backend endpoint
      .then(res => res.json())
      .then(data => setGames(data));
  }, []);

  return (
    <div>
      <Header />
      <GameList games={games} />
    </div>
  );
}

export default App;
