import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { collection, addDoc, doc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { db, COLLECTIONS } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Review, Order } from '../../types/marketplace';

interface ReviewFormProps {
  order: Order;
  onSuccess?: () => void;
}

const ReviewForm = ({ order, onSuccess }: ReviewFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const submitReview = useMutation(
    async () => {
      if (!user) throw new Error('User not authenticated');

      const reviewData: Partial<Review> = {
        gigId: order.gigId,
        orderId: order.id,
        buyerId: user.uid,
        buyerName: user.displayName || 'Anonymous',
        buyerAvatar: user.photoURL,
        rating,
        comment,
        createdAt: serverTimestamp()
      };

      // Add review
      const reviewRef = await addDoc(collection(db, COLLECTIONS.REVIEWS), reviewData);

      // Update order status
      const orderRef = doc(db, COLLECTIONS.ORDERS, order.id);
      await updateDoc(orderRef, {
        status: 'completed',
        completedDate: serverTimestamp()
      });

      // Update gig statistics
      const gigRef = doc(db, COLLECTIONS.GIGS, order.gigId);
      await updateDoc(gigRef, {
        rating: rating, // This should be an average in a real application
        reviews: increment(1),
        completedOrders: increment(1)
      });

      return reviewRef.id;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['order', order.id]);
        queryClient.invalidateQueries(['gig', order.gigId]);
        toast.success('Review submitted successfully');
        onSuccess?.();
      },
      onError: (error) => {
        console.error('Error submitting review:', error);
        toast.error('Failed to submit review');
      }
    }
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Rate Your Experience
      </h2>

      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-6">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => setRating(value)}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(null)}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 ${
                (hoveredRating !== null ? value <= hoveredRating : value <= rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating} out of 5 stars
        </span>
      </div>

      {/* Review Comment */}
      <div className="mb-6">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Review
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this service..."
          className="w-full rounded-lg border-gray-300 focus:border-ajira-primary focus:ring-ajira-primary"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={() => submitReview.mutate()}
        disabled={!comment.trim() || submitReview.isLoading}
        className="w-full bg-ajira-primary text-white py-2 rounded-lg hover:bg-ajira-primary-dark disabled:opacity-50"
      >
        {submitReview.isLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
};

export default ReviewForm; 