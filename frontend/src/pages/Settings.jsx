import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FaSun, FaMoon, FaBell, FaLock, FaEnvelope, FaGlobe, FaCog, FaArrowLeft } from 'react-icons/fa';
import { getSettings, updateSettings } from '../services/settingsService';
import { toast } from 'react-toastify';

const Settings = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { user, token } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    language: 'English',
    privacy: 'Public',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const userSettings = await getSettings(token);
        setSettings(userSettings);
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSettings();
    }
  }, [token]);

  const handleChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettings(settings, token);
      toast.success('Settings saved successfully');
      navigate(-1);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#1a1a1a] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-b from-[#181818] to-[#1a1a1a] shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <FaArrowLeft className="text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-purple-100">Customize your GameVerse experience</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Theme Settings */}
            <div className="bg-gradient-to-b from-[#181818] to-[#1a1a1a] rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  {isDarkMode ? (
                    <FaMoon className="text-purple-600 dark:text-purple-300 text-xl" />
                  ) : (
                    <FaSun className="text-purple-600 dark:text-purple-300 text-xl" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Theme</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors border border-gray-200 dark:border-gray-600"
              >
                {isDarkMode ? (
                  <>
                    <FaSun className="text-yellow-500" />
                    <span className="font-medium">Switch to Light Mode</span>
                  </>
                ) : (
                  <>
                    <FaMoon className="text-blue-500" />
                    <span className="font-medium">Switch to Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Notification Settings */}
            <div className="bg-gradient-to-b from-[#181818] to-[#1a1a1a] rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FaBell className="text-blue-600 dark:text-blue-300 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage your notification preferences</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-600 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Enable Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notifications}
                    onChange={(e) => handleChange('notifications', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-gradient-to-b from-[#181818] to-[#1a1a1a] rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FaLock className="text-green-600 dark:text-green-300 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Control your profile visibility</p>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-600 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Visibility</label>
                <select
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  value={settings.privacy}
                  onChange={(e) => handleChange('privacy', e.target.value)}
                >
                  <option value="Public">Public</option>
                  <option value="Friends">Friends Only</option>
                  <option value="Private">Private</option>
                </select>
              </div>
            </div>

            {/* Email Settings */}
            <div className="bg-gradient-to-b from-[#181818] to-[#1a1a1a] rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <FaEnvelope className="text-red-600 dark:text-red-300 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Email Preferences</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage your email notifications</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-600 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Email Updates</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.emailUpdates}
                    onChange={(e) => handleChange('emailUpdates', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Language Settings */}
            <div className="bg-gradient-to-b from-[#181818] to-[#1a1a1a] rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <FaGlobe className="text-yellow-600 dark:text-yellow-300 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Language</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred language</p>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-600 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Language</label>
                <select
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 