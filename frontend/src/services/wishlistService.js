// Wishlist service to manage wishlist operations
const WISHLIST_KEY = 'gameverse_wishlist';

// Get wishlist from localStorage
export const getWishlist = () => {
  const wishlist = localStorage.getItem(WISHLIST_KEY);
  return wishlist ? JSON.parse(wishlist) : [];
};

// Add game to wishlist
export const addToWishlist = (game) => {
  const wishlist = getWishlist();
  if (!wishlist.some(item => item.id === game.id)) {
    wishlist.push({
      id: game.id,
      name: game.name,
      background_image: game.background_image,
      rating: game.rating,
      added: new Date().toISOString()
    });
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }
  return wishlist;
};

// Remove game from wishlist
export const removeFromWishlist = (gameId) => {
  const wishlist = getWishlist();
  const updatedWishlist = wishlist.filter(game => game.id !== gameId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));
  return updatedWishlist;
};

// Check if game is in wishlist
export const isInWishlist = (gameId) => {
  const wishlist = getWishlist();
  return wishlist.some(game => game.id === gameId);
}; 