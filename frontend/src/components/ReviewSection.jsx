import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ReviewSection({ gameId, currentUser }) {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch reviews on mount or when gameId changes
  useEffect(() => {
    setLoading(true);
    axios.get(`/api/reviews/${gameId}`)
      .then(res => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to load reviews'))
      .finally(() => setLoading(false));
  }, [gameId]);

  // Submit a new review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await axios.post(`/api/reviews/${gameId}`, {
        user: currentUser._id,
        rating,
        comment,
      });
      setComment('');
      setRating(5);
      // Refresh reviews
      const res = await axios.get(`/api/reviews/${gameId}`);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#181818]/80 backdrop-blur-xl rounded-xl p-8 shadow-lg border border-white/10">
      <h2 className="text-2xl font-bold mb-4 font-['Orbitron'] text-white">Reviews</h2>
      {/* Review Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-white/70">Your Rating:</span>
            <select
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              className="rounded px-2 py-1 bg-white/5 text-white border border-white/10 focus:border-white/20 focus:ring-1 focus:ring-white/20"
              disabled={submitting}
            >
              {[5,4,3,2,1].map(r => (
                <option key={r} value={r}>{'★'.repeat(r)}{'☆'.repeat(5-r)}</option>
              ))}
            </select>
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="w-full rounded bg-white/5 text-white border border-white/10 focus:border-white/20 focus:ring-1 focus:ring-white/20 p-2 mb-2"
            rows={3}
            placeholder="Write your review..."
            required
            disabled={submitting}
          />
          <button
            type="submit"
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded font-semibold transition-colors duration-200 ring-1 ring-white/10 focus:ring-2 focus:ring-white/20"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
          {error && <div className="text-white/70 mt-2">{error}</div>}
        </form>
      ) : (
        <div className="text-white/50 mb-6">Log in to write a review.</div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-white/50">Loading reviews...</div>
      ) : (Array.isArray(reviews) && reviews.length === 0) ? (
        <div className="text-white/50">No reviews yet. Be the first to review!</div>
      ) : (
        <ul className="space-y-6">
          {(Array.isArray(reviews) ? reviews : []).map((review) => (
            <li key={review._id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white/90">{review.user?.username || 'User'}</span>
                <span className="text-white/70">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
                <span className="text-xs text-white/50 ml-2">{new Date(review.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-white/70">{review.comment}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 