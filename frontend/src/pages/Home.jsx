import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const trendingGames = [
    {
      id: 1,
      title: "Split Fiction",
      image: "/images/split-fiction.jpg",
      price: "$59.99",
      rating: 4.8,
      genre: "Action RPG",
      platform: "PC, PS5, Xbox"
    },
    {
      id: 2,
      title: "Cyber Realm",
      image: "/images/cyber-realm.jpg",
      price: "$49.99",
      rating: 4.5,
      genre: "Cyberpunk",
      platform: "PC, PS5"
    },
    {
      id: 3,
      title: "Epic Quest",
      image: "/images/epic-quest.jpg",
      price: "$39.99",
      rating: 4.7,
      genre: "Fantasy",
      platform: "PC, Xbox"
    }
  ];

  const recentlyAdded = [
    {
      id: 4,
      title: "Space Warriors",
      image: "/images/space-warriors.jpg",
      price: "$44.99",
      rating: 4.3,
      genre: "Sci-Fi",
      platform: "PC, PS5"
    },
    {
      id: 5,
      title: "Dragon's Legacy",
      image: "/images/dragons-legacy.jpg",
      price: "$54.99",
      rating: 4.6,
      genre: "Fantasy",
      platform: "All Platforms"
    },
    {
      id: 6,
      title: "Medieval Conquest",
      image: "/images/medieval-conquest.jpg",
      price: "$49.99",
      rating: 4.4,
      genre: "Strategy",
      platform: "PC"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        {/* Background with modern overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10"></div>
          <video 
            className="w-full h-full object-cover opacity-50"
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-8 h-full flex items-center">
          <div className="max-w-3xl space-y-8">
            <div className="inline-block px-4 py-2 bg-[#A020F0]/20 text-[#A020F0] text-sm font-medium rounded-full">
              Featured Release
            </div>
            <h1 className="text-8xl font-bold tracking-tight">
              Split<br/>Fiction
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
              Embark on an epic journey through parallel dimensions. Your choices shape reality itself in this groundbreaking narrative adventure.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/games/split-fiction" 
                className="px-8 py-4 bg-[#A020F0] hover:bg-[#8010D0] transition-colors text-lg font-medium rounded"
              >
                Play Now
              </Link>
              <button className="flex items-center gap-2 text-lg font-medium group">
                <span className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-white/20 group-hover:border-[#A020F0] transition-colors">
                  ▶
                </span>
                Watch Trailer
              </button>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-400 pt-8">
              <div className="flex items-center gap-2">
                <span className="text-[#A020F0]">★</span>
                <span>4.8/5.0</span>
              </div>
              <div>Action RPG</div>
              <div>PC, PS5, Xbox</div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent z-20"></div>
      </section>

      {/* Trending Games Section */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Trending Games</h2>
            <Link to="/browse" className="text-[#A020F0] hover:text-[#8010D0] transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingGames.map((game) => (
              <div key={game.id} className="group cursor-pointer">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                  <img 
                    src={game.image} 
                    alt={game.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <button className="w-full py-3 bg-[#A020F0] hover:bg-[#8010D0] transition-colors rounded font-medium">
                        View Game
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-medium group-hover:text-[#A020F0] transition-colors">{game.title}</h3>
                    <span className="text-[#A020F0] font-medium">{game.price}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <span className="text-[#A020F0]">★</span>
                      <span>{game.rating}</span>
                    </div>
                    <span>•</span>
                    <div>{game.genre}</div>
                    <span>•</span>
                    <div className="text-xs">{game.platform}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Recently Added</h2>
            <Link to="/browse" className="text-[#A020F0] hover:text-[#8010D0] transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentlyAdded.map((game) => (
              <div key={game.id} className="group cursor-pointer">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                  <img 
                    src={game.image} 
                    alt={game.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <button className="w-full py-3 bg-[#A020F0] hover:bg-[#8010D0] transition-colors rounded font-medium">
                        View Game
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-medium group-hover:text-[#A020F0] transition-colors">{game.title}</h3>
                    <span className="text-[#A020F0] font-medium">{game.price}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <span className="text-[#A020F0]">★</span>
                      <span>{game.rating}</span>
                    </div>
                    <span>•</span>
                    <div>{game.genre}</div>
                    <span>•</span>
                    <div className="text-xs">{game.platform}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-[#A020F0] mb-4">GameVerse</h3>
              <p className="text-gray-400">Your gateway to endless gaming adventures.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-[#A020F0] transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-[#A020F0] transition-colors">Contact</Link></li>
                <li><Link to="/support" className="hover:text-[#A020F0] transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" className="hover:text-[#A020F0] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-[#A020F0] transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#A020F0] transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-[#A020F0] transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-[#A020F0] transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; 2024 GameVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
