import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../../hooks/useAuth';
import type { Order } from '../../types/marketplace';
import { Clock, Search, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type OrderFilter = 'all' | 'active' | 'delivered' | 'completed' | 'cancelled';
type OrderRole = 'buyer' | 'seller';

const OrdersList = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderFilter>('all');
  const [roleFilter, setRoleFilter] = useState<OrderRole>('buyer');

  // Fetch orders
  const { data: orders, isLoading } = useQuery(
    ['orders', user?.uid, roleFilter, statusFilter],
    async () => {
      if (!user) return [];
      // Placeholder: return empty array or mock data
      return [];
    },
    {
      enabled: !!user
    }
  );

  // Filter orders by search query
  const filteredOrders = orders?.filter(order => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.gigTitle?.toLowerCase().includes(searchLower) ||
      order.buyerName?.toLowerCase().includes(searchLower) ||
      order.sellerName?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg overflow-hidden">
            <button
              onClick={() => setRoleFilter('buyer')}
              className={`px-4 py-2 ${
                roleFilter === 'buyer'
                  ? 'bg-ajira-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              As Buyer
            </button>
            <button
              onClick={() => setRoleFilter('seller')}
              className={`px-4 py-2 ${
                roleFilter === 'seller'
                  ? 'bg-ajira-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              As Seller
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-ajira-primary focus:ring-ajira-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderFilter)}
              className="rounded-lg border border-gray-300 focus:border-ajira-primary focus:ring-ajira-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? "No orders match your search criteria"
              : roleFilter === 'buyer'
              ? "You haven't placed any orders yet"
              : "You haven't received any orders yet"}
          </p>
          {roleFilter === 'buyer' && (
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ajira-primary hover:bg-ajira-primary-dark"
            >
              Browse Marketplace
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders?.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {order.gigTitle}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Order #{order.id.slice(-8)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    <Clock className="inline-block w-4 h-4 mr-1" />
                    {formatDistanceToNow(order.createdAt.toDate(), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {roleFilter === 'buyer' ? 'Seller' : 'Buyer'}
                  </p>
                  <p className="font-medium text-gray-900">
                    {roleFilter === 'buyer' ? order.sellerName : order.buyerName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Package</p>
                  <p className="font-medium text-gray-900">{order.packageName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium text-gray-900">
                    KES {order.price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.deliveryDate.toDate()).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {order.status === 'delivered' && roleFilter === 'buyer' && (
                <div className="mt-4 flex items-center gap-2 text-sm text-ajira-primary">
                  <span>Review delivery</span>
                  <span>→</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList; 