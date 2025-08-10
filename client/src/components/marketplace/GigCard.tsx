import React, { useState } from 'react';
import {
  Star,
  Heart,
  Award,
  Eye,
  ShoppingCart,
  Clock,
  User,
  Shield,
  CheckCircle,
  Verified,
  Crown,
  Zap,
  Badge,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Gig } from '../../api/marketplace';

// Enhanced seller verification system
interface SellerVerificationProps {
  seller: any;
  compact?: boolean;
}

const SellerVerificationBadge: React.FC<SellerVerificationProps> = ({
  seller,
  compact = false,
}) => {
  // Use actual seller data from API
  const isVerified = seller.verified;
  const isPro = seller.rating >= 4.5;
  const isTopRated = seller.rating >= 4.8;

  if (compact) {
    return (
      <div className='flex items-center gap-1'>
        {isVerified && <Shield className='w-3 h-3 text-ajira-secondary' />}
        {isPro && <Crown className='w-3 h-3 text-ajira-accent' />}
        {isTopRated && <Award className='w-3 h-3 text-ajira-warning' />}
      </div>
    );
  }

  return (
    <div className='flex flex-wrap items-center gap-1'>
      {isVerified && (
        <div className='flex items-center bg-ajira-secondary/10 text-ajira-secondary px-2 py-0.5 rounded-full text-xs font-medium'>
          <Shield className='w-3 h-3 mr-1' />
          Verified
        </div>
      )}
      {isPro && (
        <div className='flex items-center bg-ajira-accent/10 text-ajira-accent px-2 py-0.5 rounded-full text-xs font-medium'>
          <Crown className='w-3 h-3 mr-1' />
          Pro
        </div>
      )}
      {isTopRated && (
        <div className='flex items-center bg-ajira-warning/10 text-ajira-warning px-2 py-0.5 rounded-full text-xs font-medium'>
          <Award className='w-3 h-3 mr-1' />
          Top Rated
        </div>
      )}
      {isFeatured && (
        <div className='flex items-center bg-gradient-to-r from-purple-500/10 to-ajira-primary/10 text-purple-600 px-2 py-0.5 rounded-full text-xs font-medium'>
          <Zap className='w-3 h-3 mr-1' />
          Featured
        </div>
      )}
    </div>
  );
};

// Enhanced seller level component
const SellerLevel: React.FC<{ level: string }> = ({ level }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'New Seller':
        return 'text-gray-600 bg-gray-100';
      case 'Level 1':
        return 'text-ajira-info bg-ajira-info/10';
      case 'Level 2':
        return 'text-ajira-secondary bg-ajira-secondary/10';
      case 'Top Rated':
        return 'text-ajira-accent bg-ajira-accent/10';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(level)}`}
    >
      {level}
    </span>
  );
};

interface GigCardProps {
  gig: Gig | any;
  viewMode?: 'grid' | 'list';
}

const GigCard: React.FC<GigCardProps> = ({ gig, viewMode = 'grid' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const images = gig.images?.map((img) => img.url) || [];
  const hasMultipleImages = images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const renderSellerBadge = () => {
    if (!gig.seller?.level) return null;

    const levelColors = {
      'Level 1':
        'bg-ajira-green-100 text-ajira-green-700 border-ajira-green-200',
      'Level 2': 'bg-ajira-blue-100 text-ajira-blue-700 border-ajira-blue-200',
      'Top Rated':
        'bg-ajira-orange-100 text-ajira-orange-700 border-ajira-orange-200',
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${levelColors[gig.seller.level] || levelColors['Level 1']}`}
      >
        {gig.seller.level}
      </span>
    );
  };

  const renderVerificationBadges = () => {
    if (!gig.seller?.verifications) return null;

    return (
      <div className='flex items-center gap-1'>
        {gig.seller.verifications.includes('identity') && (
          <div className='flex items-center bg-ajira-green-100 text-ajira-green-700 px-2 py-0.5 rounded text-xs'>
            <Shield className='w-3 h-3 mr-1' />
            ID
          </div>
        )}
        {gig.seller.verifications.includes('email') && (
          <div className='flex items-center bg-ajira-blue-100 text-ajira-blue-700 px-2 py-0.5 rounded text-xs'>
            📧
          </div>
        )}
        {gig.seller.verifications.includes('phone') && (
          <div className='flex items-center bg-ajira-secondary-100 text-ajira-secondary-700 px-2 py-0.5 rounded text-xs'>
            📱
          </div>
        )}
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <div className='bg-white border border-ajira-gray-200 rounded-lg shadow-ajira hover:shadow-ajira-lg transition-all duration-300 overflow-hidden'>
        <div className='flex'>
          {/* Image */}
          <div className='relative w-64 h-40 flex-shrink-0'>
            <img
              src={images[currentImageIndex] || '/api/placeholder/280/160'}
              alt={gig.title}
              className='w-full h-full object-cover'
            />

            {/* Image Navigation */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className='absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition'
                >
                  <ChevronLeft className='w-3 h-3 text-ajira-text-primary' />
                </button>
                <button
                  onClick={nextImage}
                  className='absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition'
                >
                  <ChevronRight className='w-3 h-3 text-ajira-text-primary' />
                </button>

                {/* Dots Indicator */}
                <div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1'>
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* KiNaP's Choice Badge */}
            {gig.featured && (
              <div className='absolute top-2 left-2 bg-ajira-accent text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-md'>
                <Award className='w-3 h-3' />
                KiNaP's Choice
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              className='absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition shadow-md'
            >
              <Heart
                className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-ajira-text-muted'}`}
              />
            </button>
          </div>

          {/* Content */}
          <div className='flex-1 p-6'>
            <div className='flex justify-between items-start mb-3'>
              <div>
                <h3 className='text-lg font-semibold text-ajira-text-primary mb-2 line-clamp-2 hover:text-ajira-secondary transition'>
                  {gig.title}
                </h3>
                <p className='text-ajira-text-muted text-sm line-clamp-2 mb-3'>
                  {gig.description}
                </p>
              </div>
            </div>

            {/* Seller Info */}
            <div className='flex items-center gap-3 mb-4'>
              <div className='flex items-center gap-2'>
                <img
                  src={gig.seller?.avatar || '/api/placeholder/32/32'}
                  alt={gig.seller?.name}
                  className='w-8 h-8 rounded-full object-cover border-2 border-ajira-gray-200'
                />
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium text-ajira-text-primary'>
                      {gig.seller?.name}
                    </span>
                    {renderSellerBadge()}
                  </div>
                  {renderVerificationBadges()}
                </div>
              </div>
            </div>

            {/* Rating and Stats */}
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-1'>
                  <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                  <span className='text-sm font-medium text-ajira-text-primary'>
                    {Number(gig.stats?.rating || gig.rating || 0).toFixed(1)}
                  </span>
                  <span className='text-xs text-ajira-text-muted'>
                    ({(gig.stats?.reviews || gig.reviews || 0).toLocaleString()}
                    )
                  </span>
                </div>
                <div className='flex items-center gap-1 text-xs text-ajira-text-muted'>
                  <Clock className='w-3 h-3' />
                  <span>
                    {gig.deliveryTime ||
                      gig.packages?.[0]?.deliveryTime ||
                      '3 days'}{' '}
                    delivery
                  </span>
                </div>
              </div>

              <div className='text-right'>
                <div className='text-xs text-ajira-text-muted mb-1'>
                  Starting at
                </div>
                <div className='text-lg font-bold text-ajira-text-primary'>
                  KES{' '}
                  {(
                    gig.packages?.[0]?.price ||
                    gig.price ||
                    0
                  ).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Tags */}
            {gig.tags && gig.tags.length > 0 && (
              <div className='flex flex-wrap gap-1'>
                {gig.tags.slice(0, 3).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className='inline-block bg-ajira-light text-ajira-text-muted px-2 py-1 rounded-md text-xs'
                  >
                    {tag}
                  </span>
                ))}
                {gig.tags.length > 3 && (
                  <span className='inline-block bg-ajira-light text-ajira-text-muted px-2 py-1 rounded-md text-xs'>
                    +{gig.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className='bg-white border border-ajira-gray-200 rounded-lg shadow-ajira hover:shadow-ajira-lg transition-all duration-300 overflow-hidden group'>
      {/* Image Container */}
      <div className='relative h-48 overflow-hidden'>
        <img
          src={images[currentImageIndex] || '/api/placeholder/280/192'}
          alt={gig.title}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
        />

        {/* Image Navigation */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className='absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition opacity-0 group-hover:opacity-100'
            >
              <ChevronLeft className='w-4 h-4 text-ajira-text-primary' />
            </button>
            <button
              onClick={nextImage}
              className='absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition opacity-0 group-hover:opacity-100'
            >
              <ChevronRight className='w-4 h-4 text-ajira-text-primary' />
            </button>

            {/* Dots Indicator */}
            <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1'>
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* KiNaP's Choice Badge */}
        {gig.featured && (
          <div className='absolute top-3 left-3 bg-ajira-accent text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-md'>
            <Award className='w-3 h-3' />
            KiNaP's Choice
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className='absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition shadow-md opacity-0 group-hover:opacity-100'
        >
          <Heart
            className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-ajira-text-muted'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className='p-4'>
        {/* Seller Info */}
        <div className='flex items-center gap-2 mb-3'>
          <img
            src={gig.seller?.avatar || '/api/placeholder/24/24'}
            alt={gig.seller?.name}
            className='w-6 h-6 rounded-full object-cover border border-ajira-gray-200'
          />
          <span className='text-sm font-medium text-ajira-text-primary'>
            {gig.seller?.displayName}
          </span>
          {renderSellerBadge()}
        </div>

        {/* Title */}
        <h3 className='text-base font-semibold text-ajira-text-primary mb-2 line-clamp-2 hover:text-ajira-secondary transition'>
          {gig.title}
        </h3>

        {/* Rating */}
        <div className='flex items-center gap-1 mb-3'>
          <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
          <span className='text-sm font-medium text-ajira-text-primary'>
            {Number(gig.stats?.rating || 0).toFixed(1)}
          </span>
          <span className='text-xs text-ajira-text-muted'>
            ({(gig.stats?.reviews || 0).toLocaleString()})
          </span>
        </div>

        {/* Verification Badges */}
        <div className='mb-4'>
          <SellerVerificationBadge seller={gig.seller} />
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between mt-4 pt-3 border-t border-ajira-gray-100'>
          <div className='flex items-center gap-1 text-xs text-ajira-text-muted'>
            <Clock className='w-3 h-3' />
            <span>{gig.packages?.[0]?.deliveryTime || '3 days'} days</span>
          </div>
          <div className='text-right'>
            <div className='text-xs text-ajira-text-muted'>Starting at</div>
            <div className='text-lg font-bold text-ajira-text-primary'>
              KES{' '}
              {(
                gig.packages?.[0]?.price ||
                gig.pricing?.amount ||
                0
              ).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
