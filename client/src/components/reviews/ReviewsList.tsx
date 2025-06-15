import { useState } from 'react';
import { useQuery } from 'react-query';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, COLLECTIONS } from '../../config/firebase';
import { Star, ThumbsUp, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Review } from '../../types/marketplace';

interface ReviewsListProps {
  gigId: string;
  showFilters?: boolean;
}

const ReviewsList = ({ gigId, showFilters = true }: ReviewsListProps) => {
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful'>('recent');

  // Fetch reviews
  const { data: reviews, isLoading } = useQuery(
    ['reviews', gigId, ratingFilter],
    async () => {
      const reviewsRef = collection(db, COLLECTIONS.REVIEWS);
      const constraints = [
        where('gigId', '==', gigId),
        orderBy(sortBy === 'recent' ? 'createdAt' : 'helpfulVotes', 'desc')
      ];

      if (ratingFilter !== null) {
        constraints.push(where('rating', '==', ratingFilter));
      }

      const q = query(reviewsRef, ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    }
  );

  // Calculate rating distribution
  const ratingDistribution = reviews?.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>) || {};

  const totalReviews = reviews?.length || 0;
  const averageRating = totalReviews > 0
    ? reviews?.reduce((sum, review) => sum + review.rating, 0)! / totalReviews
    : 0;

  const getDate = (createdAt: any) => {
    if (createdAt && typeof createdAt.toDate === 'function') {
      return createdAt.toDate();
    }
    return new Date();
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={`w-5 h-5 ${
                      value <= Math.round(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-8">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-lg shadow-sm p-4">
          {/* Rating Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filter by:</span>
            <select
              value={ratingFilter === null ? 'all' : ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value === 'all' ? null : Number(e.target.value))}
              className="rounded-lg border-gray-300 focus:border-ajira-primary focus:ring-ajira-primary"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'helpful')}
              className="rounded-lg border-gray-300 focus:border-ajira-primary focus:ring-ajira-primary"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-600">
            Be the first to review this service
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews?.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {review.buyerAvatar ? (
                    <img
                      src={review.buyerAvatar}
                      alt={review.buyerName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xl text-gray-600">
                        {review.buyerName[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {review.buyerName}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Star
                            key={value}
                            className={`w-4 h-4 ${
                              value <= review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(getDate(review.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <p className="text-gray-600 mb-4">{review.comment}</p>

              {/* Review Actions */}
              <div className="flex items-center gap-4 text-sm">
                <button className="flex items-center gap-1 text-gray-600 hover:text-ajira-primary">
                  <ThumbsUp size={16} />
                  <span>Helpful</span>
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-red-500">
                  <Flag size={16} />
                  <span>Report</span>
                </button>
              </div>

              {/* Seller Response */}
              {review.response && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Seller's Response
                  </p>
                  <p className="text-sm text-gray-600">
                    {review.response}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList; 