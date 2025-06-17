import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, COLLECTIONS } from '../../config/firebase'
import type { Gig, GigPackage, UserProfile } from '../../types/marketplace'
import { Star, Clock, RefreshCw, CheckCircle, MessageCircle, Share2, Flag, Eye, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
// @ts-ignore
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import { toast } from 'react-hot-toast'
import sampleGigs from '../../data/sampleGigs'

// Format price as KES
function formatKES(amount: number) {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

const GigDetailPage: React.FC = () => {
  const { gigId } = useParams<{ gigId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedPackage, setSelectedPackage] = useState<GigPackage['name']>('basic')
  const [requirements, setRequirements] = useState('')

  // Fetch gig details
  const { data: gig, isLoading: isLoadingGig } = useQuery(
    ['gig', gigId],
    async () => {
      if (!gigId) return null
      const docRef = doc(db, COLLECTIONS.GIGS, gigId)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) return null
      return { id: docSnap.id, ...docSnap.data() } as Gig
    }
  )

  // Fetch seller details
  const { data: seller } = useQuery(
    ['seller', gig?.sellerId],
    async () => {
      if (!gig?.sellerId) return null
      const docRef = doc(db, COLLECTIONS.USERS, gig.sellerId)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) return null
      return { id: docSnap.id, ...docSnap.data() } as UserProfile;
    },
    {
      enabled: !!gig?.sellerId
    }
  )

  // Create order mutation
  const createOrder = useMutation(
    async () => {
      if (!user || !gig || !seller) throw new Error('Missing required data');
      
      const selectedPkg = gig.packages.find(p => p.name === selectedPackage);
      if (!selectedPkg) throw new Error('Package not found');

      const orderData = {
        gigId: gig.id,
        sellerId: seller.id,
        buyerId: user.uid,
        packageName: selectedPackage,
        price: selectedPkg.price,
        quantity: 1,
        requirements,
        status: 'pending',
        paymentStatus: 'pending',
        deliveryDate: new Date(Date.now() + selectedPkg.deliveryTime * 24 * 60 * 60 * 1000),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const orderRef = await addDoc(collection(db, COLLECTIONS.ORDERS), orderData);
      return orderRef.id;
    },
    {
      onSuccess: (orderId) => {
        queryClient.invalidateQueries(['orders']);
        navigate(`/orders/${orderId}`);
        toast.success('Order created successfully!');
      },
      onError: (error) => {
        console.error('Error creating order:', error);
        toast.error('Failed to create order. Please try again.');
      }
    }
  );

  const handleOrder = () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      return;
    }
    createOrder.mutate();
  };

  if (isLoadingGig) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-8" />
              {/* Add more loading UI elements as needed */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!gig || !seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Gig Not Found</h1>
          <p className="text-gray-600 mb-4">The gig you're looking for doesn't exist.</p>
          <Link to="/marketplace" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const images = gig.images.map(url => ({
    original: url,
    thumbnail: url
  }));

  const selectedPkg = gig.packages.find(p => p.name === selectedPackage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link 
            to="/marketplace" 
            className="flex items-center text-green-600 hover:text-green-700 mb-2"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Marketplace
          </Link>
          <div className="text-sm text-gray-600">
            <span>Marketplace</span> / <span>Gigs</span> / <span className="text-gray-900">{gig.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Gig Image */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <img 
                src={gig.image} 
                alt={gig.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>

            {/* Gig Title and Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {gig.title}
              </h1>
              
              {/* Seller Info */}
              <div className="flex items-center mb-4">
                <img 
                  src={seller.photoURL} 
                  alt={seller.displayName}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{seller.displayName}</h3>
                  <p className="text-sm text-gray-600">{gig.seller.level}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold ml-1">{gig.stats.rating.toFixed(1)}</span>
                  <span className="text-gray-600 ml-1">({gig.stats.reviews})</span>
                </div>
                <div className="text-sm text-gray-600">
                  {gig.stats.views} views
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {gig.description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What you get</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gig.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Shield className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Order Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  {gig.originalPrice > gig.price && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatKES(gig.originalPrice)}
                    </span>
                  )}
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatKES(gig.price)}
                </div>
                <p className="text-gray-600">Starting price</p>
              </div>

              {/* Delivery Time */}
              <div className="flex items-center mb-6">
                <Clock className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-700">Delivery in {gig.deliveryTime} days</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleOrder}
                  disabled={createOrder.isLoading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  {createOrder.isLoading ? 'Creating Order...' : 'Continue'}
                </button>
                <button className="w-full border border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                  Contact Seller
                </button>
              </div>

              {/* Seller Stats */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-4">About the seller</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">From</span>
                    <span className="text-gray-900">{gig.seller.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response time</span>
                    <span className="text-gray-900">{gig.seller.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last seen</span>
                    <span className="text-gray-900">{gig.seller.lastSeen}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GigDetailPage 