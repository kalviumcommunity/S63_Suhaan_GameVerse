import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { searchDeals, getStores } from '../services/cheapSharkApi';
import { FaShoppingCart, FaExternalLinkAlt } from 'react-icons/fa';

const GamePrice = ({ gameTitle, gameId }) => {
  const [deals, setDeals] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(83.5); // Default USD to INR rate

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dealsData, storesData] = await Promise.all([
          searchDeals(gameTitle),
          getStores()
        ]);
        setDeals(dealsData);
        setStores(storesData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch game prices');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameTitle]);

  const getStoreInfo = (storeId) => {
    return stores.find(store => store.storeID === storeId.toString());
  };

  const convertToINR = (usdPrice) => {
    return (usdPrice * exchangeRate).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <div className="text-gray-400 text-center py-4">
        No deals available
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/50 rounded-lg p-4 space-y-3"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Best Deals</h3>
        <span className="text-sm text-gray-400">Prices in INR (₹)</span>
      </div>
      <div className="space-y-2">
        {deals.map((deal) => {
          const storeInfo = getStoreInfo(deal.storeID);
          return (
            <motion.div
              key={deal.dealID}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3"
            >
              <div className="flex items-center space-x-3">
                {storeInfo ? (
                  <div className="flex items-center space-x-2">
                    <img 
                      src={`https://www.cheapshark.com${storeInfo.images.logo}`}
                      alt={storeInfo.storeName}
                      className="w-8 h-8 object-contain"
                    />
                    <div>
                      <p className="text-white font-medium">{storeInfo.storeName}</p>
                      <p className="text-sm text-gray-400">Rating: {deal.steamRatingPercent}%</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <FaShoppingCart className="text-purple-500" />
                    <div>
                      <p className="text-white font-medium">{deal.storeName}</p>
                      <p className="text-sm text-gray-400">Rating: {deal.steamRatingPercent}%</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-green-400 font-bold">₹{convertToINR(deal.salePrice)}</p>
                  {deal.normalPrice !== deal.salePrice && (
                    <p className="text-sm text-gray-400 line-through">₹{convertToINR(deal.normalPrice)}</p>
                  )}
                </div>
                <motion.a
                  href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
                >
                  <FaExternalLinkAlt />
                </motion.a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default GamePrice; 