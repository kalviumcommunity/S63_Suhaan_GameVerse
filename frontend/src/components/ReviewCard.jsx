import React, { useEffect, useState } from 'react';
import RatingStars from '../components/RatingStars';
import axios from 'axios';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    username: '',
    comment: '',
    rating: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.username || !newReview.comment || !newReview.rating) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/reviews', newReview);
      fetchReviews();
      setNewReview({ username: '', comment: '', rating: 0 });
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Game Reviews</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-4 rounded mb-8 shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>

        <input
          type="text"
          placeholder="Your Name"
          value={newReview.username}
          onChange={(e) => setNewReview({ ...newReview, username: e.target.value })}
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 text-white"
        />

        <textarea
          placeholder="Write your thoughts..."
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 text-white h-24"
        />

        <label className="block mb-2">Rating:</label>
        <select
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: parseFloat(e.target.value) })}
          className="mb-4 px-4 py-2 rounded bg-gray-700 text-white"
        >
          <option value={0}>Select Rating</option>
          <option value={1}>1 Star</option>
          <option value={2}>2 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={5}>5 Stars</option>
        </select>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Submit Review
        </button>
      </form>

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">{review.username}</h3>
                <RatingStars rating={review.rating} />
              </div>
              <p className="text-gray-300">{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;
