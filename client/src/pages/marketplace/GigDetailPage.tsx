import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, COLLECTIONS } from '../../config/firebase'
import type { Gig, GigPackage, UserProfile } from '../../types/marketplace'
import { Star, Clock, RefreshCw, CheckCircle, MessageCircle, Share2, Flag, Eye } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
// @ts-ignore
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import { toast } from 'react-hot-toast'

// Format price as KES
function formatKES(amount: number) {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

const GigDetailPage = () => {
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gig not found</h2>
          <p className="text-gray-600 mb-4">The gig you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ajira-primary hover:bg-ajira-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ajira-primary"
          >
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-gray-500 mb-4">
            <Link to="/marketplace" className="hover:text-ajira-primary">Marketplace</Link>
            <span className="mx-2">›</span>
            <Link to={`/marketplace?category=${gig.category}`} className="hover:text-ajira-primary">{gig.category}</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{gig.subcategory}</span>
          </nav>

          {/* Title and Stats */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{gig.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <Link to={`/profile/${seller.id}`} className="flex items-center gap-2">
              <img
                src={seller.photoURL}
                alt={seller.displayName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="text-sm font-medium text-gray-900">{seller.displayName}</h4>
                <p className="text-xs text-gray-500">Level 1 Seller</p>
              </div>
            </Link>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="font-medium">{gig.stats.rating.toFixed(1)}</span>
                <span className="text-gray-400 ml-1">({gig.stats.reviews})</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{gig.stats.views} views</span>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="mb-8">
            <ImageGallery
              items={images}
              showPlayButton={false}
              showFullscreenButton={true}
              showNav={true}
              thumbnailPosition="bottom"
            />
          </div>

          {/* Description */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Gig</h2>
            <p className="text-gray-600 whitespace-pre-line">{gig.description}</p>
          </section>

          {/* About the Seller */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About The Seller</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <img
                  src={seller.photoURL}
                  alt={seller.displayName}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{seller.displayName}</h3>
                  <p className="text-gray-600 mb-2">{seller.bio}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{seller.stats?.rating.toFixed(1) || 'N/A'} ({seller.stats?.reviews || 'N/A'})</span>
                    </div>
                    <span>•</span>
                    <span>{seller.stats?.completedOrders || 'N/A'} Orders Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQs */}
          {gig.faqs && gig.faqs.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {gig.faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Pricing Packages */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {/* Package Selector */}
              <div className="flex border-b border-gray-200">
                {gig.packages.map((pkg) => (
                  <button
                    key={pkg.name}
                    onClick={() => setSelectedPackage(pkg.name)}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                      selectedPackage === pkg.name
                        ? 'bg-ajira-primary text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1)}
                  </button>
                ))}
              </div>

              {/* Selected Package Details */}
              {selectedPkg && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatKES(selectedPkg.price)}
                    </span>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{selectedPkg.deliveryTime} days</span>
                      </div>
                      <div className="flex items-center">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        <span>{selectedPkg.revisions} revisions</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{selectedPkg.description}</p>

                  <div className="space-y-3 mb-6">
                    {selectedPkg.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                      Requirements
                    </label>
                    <textarea
                      id="requirements"
                      rows={4}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-ajira-primary focus:border-ajira-primary"
                      placeholder="Tell the seller what you need..."
                    />
                  </div>

                  <button
                    onClick={handleOrder}
                    disabled={createOrder.isLoading}
                    className="w-full bg-ajira-primary hover:bg-ajira-primary-dark text-white py-3 rounded-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createOrder.isLoading ? 'Creating Order...' : `Continue (${formatKES(selectedPkg.price)})`}
                  </button>

                  <div className="flex items-center justify-center space-x-4">
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-ajira-primary">
                      <MessageCircle className="w-5 h-5" />
                      <span>Contact Seller</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-ajira-primary">
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-ajira-primary">
                      <Flag className="w-5 h-5" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GigDetailPage 