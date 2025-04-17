function GameCard({ game }) {
  return (
    <div className="game-card">
      <h2>{game.title}</h2>
      <p>{game.description}</p>
      <p>🎮 Genre: {game.genre}</p>
    </div>
  );
}
export default GameCard;
