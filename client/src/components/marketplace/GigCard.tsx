import { Link } from 'react-router-dom'
import { Star, Clock, RefreshCw, Heart, Eye } from 'lucide-react'
import type { Gig } from '../../types/marketplace'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { motion } from 'framer-motion'

interface GigCardProps {
  gig: Gig
  onSave?: (gigId: string) => void
  saved?: boolean
}

const GigCard = ({ gig, onSave, saved }: GigCardProps) => {
  const { user } = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const basicPackage = gig.packages.find(p => p.name === 'basic')
  const formattedPrice = basicPackage ? `KES ${basicPackage.price.toLocaleString()}` : 'Price not available'

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    if (!user) return
    
    setIsSaving(true)
    try {
      const savedGigsRef = doc(db, 'users', user.uid)
      await updateDoc(savedGigsRef, {
        savedGigs: saved ? arrayRemove(gig.id) : arrayUnion(gig.id)
      })
      onSave?.(gig.id)
    } catch (error) {
      console.error('Error saving gig:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Link 
      to={`/marketplace/gigs/${gig.id}`}
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200"
      >
        {/* Gig Image */}
        <div className="aspect-video relative overflow-hidden">
          <img
            src={gig.images[0]}
            alt={gig.title}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          {user && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  saved ? 'text-red-500 fill-current' : 'text-gray-600'
                }`}
              />
            </button>
          )}
          {gig.video && (
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Video
            </div>
          )}
        </div>

        {/* Seller Info */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={gig.sellerAvatar || '/default-avatar.png'}
              alt="Seller"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                {gig.sellerName}
              </h4>
              <p className="text-xs text-gray-500">
                Level 1 Seller
              </p>
            </div>
          </div>

          <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
            {gig.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="font-medium">{gig.stats.rating.toFixed(1)}</span>
              <span className="text-gray-400 ml-1">
                ({gig.stats.reviews})
              </span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{gig.stats.views}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>{basicPackage?.deliveryTime} days</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Starting at</p>
                <p className="text-base font-semibold text-gray-900">
                  {formattedPrice}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info on Hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/60 text-white p-4 flex flex-col justify-end opacity-0 hover:opacity-100 transition-opacity">
            <h3 className="text-lg font-semibold mb-2">{gig.title}</h3>
            <p className="text-sm line-clamp-2 mb-4">{gig.description}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{basicPackage?.deliveryTime} days</span>
                </div>
                <div className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  <span>{basicPackage?.revisions} revisions</span>
                </div>
              </div>
              <span className="font-semibold">{formattedPrice}</span>
            </div>
          </div>
        )}
      </motion.div>
    </Link>
  )
}

export default GigCard 