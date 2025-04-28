import React, { useEffect, useState } from 'react';
import { getWishlist, removeFromWishlist } from '../services/wishlistService';
import { FaTrash, FaStar, FaBell } from 'react-icons/fa';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const handleRemove = (id) => {
    removeFromWishlist(id);
    setWishlist(getWishlist());
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-0">
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-3xl font-bold mb-1">My Wishlist</h2>
        <p className="text-gray-400 mb-8">{wishlist.length} game{wishlist.length !== 1 ? 's' : ''}</p>
        <div className="space-y-6">
          {wishlist.length === 0 && (
            <div className="text-gray-500 text-center py-16">No games in your wishlist yet.</div>
          )}
          {wishlist.map((game) => (
            <div key={game.id} className="flex bg-[#18181b] rounded-lg overflow-hidden shadow-md relative group hover:shadow-lg transition-shadow">
              <img src={game.background_image} alt={game.name} className="w-40 h-48 object-cover flex-shrink-0" />
              <div className="flex-1 flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold leading-tight">{game.name}</span>
                    <span className="flex items-center gap-1 text-sm text-gray-400 font-semibold ml-2"><FaStar className="text-yellow-400" /> {game.rating || 'N/A'}</span>
                    <span className="text-xs text-gray-400 ml-2">PC</span>
                    <span className="text-xs text-gray-400 ml-2">{game.released ? new Date(game.released).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 mt-2">
                    <span className="text-2xl font-bold">${game.price || '59.99'}</span>
                    {game.discount && (
                      <span className="line-through text-gray-400 text-lg">${game.oldPrice}</span>
                    )}
                    {game.discount && (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded ml-1">{game.discount}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <FaBell className="mr-1 text-blue-400" /> Price alert
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <a href={game.steamUrl || '#'} target="_blank" rel="noopener noreferrer" className="bg-[#23232b] text-gray-200 px-4 py-2 rounded hover:bg-[#31313a] transition-colors text-sm">View on Steam</a>
                  <a href={game.buyUrl || '#'} target="_blank" rel="noopener noreferrer" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors text-sm">Buy Now</a>
                </div>
              </div>
              <button onClick={() => handleRemove(game.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"><FaTrash /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
