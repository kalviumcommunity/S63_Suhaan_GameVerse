import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import GameDetails from '../pages/GameDetails';
import SearchPage from '../pages/SearchPage';
import Discussions from '../pages/Discussions';
import Wishlist from '../pages/Wishlist';
import Settings from '../pages/Settings';
import AddGame from '../pages/AddGame';
import AdminPanel from '../pages/AdminPanel';
import Reviews from '../pages/Reviews';
import ResetPassword from '../pages/ResetPassword';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/game/:id" element={<GameDetails />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/discussions" element={<Discussions />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/add-game" element={<AddGame />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
};

export default AppRoutes;
