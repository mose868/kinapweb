import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, COLLECTIONS } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import type { Order, Message, Deliverable } from '../../types/marketplace';
import { Clock, Send, Upload, Download, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const OrderPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [deliverableFiles, setDeliverableFiles] = useState<File[]>([]);
  const [deliverableTitle, setDeliverableTitle] = useState('');
  const [deliverableDescription, setDeliverableDescription] = useState('');

  // Fetch order details
  const { data: order, isLoading } = useQuery(
    ['order', orderId],
    async () => {
      if (!orderId) return null;
      const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
  );

  // Send message mutation
  const sendMessage = useMutation(
    async () => {
      if (!user || !order) throw new Error('Missing required data');

      // Upload files if any
      const fileUrls = await Promise.all(
        files.map(async file => {
          const fileRef = ref(storage, `messages/${orderId}/${Date.now()}-${file.name}`);
          await uploadBytes(fileRef, file);
          return getDownloadURL(fileRef);
        })
      );

      const messageData: Partial<Message> = {
        orderId,
        senderId: user.uid,
        content: message,
        attachments: fileUrls,
        isRead: false,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, COLLECTIONS.MESSAGES), messageData);
      
      // Update order's messages array
      const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
      await updateDoc(orderRef, {
        messages: [...(order.messages || []), messageData]
      });

      return true;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['order', orderId]);
        setMessage('');
        setFiles([]);
        toast.success('Message sent successfully');
      },
      onError: (error) => {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
      }
    }
  );

  // Submit delivery mutation
  const submitDelivery = useMutation(
    async () => {
      if (!user || !order) throw new Error('Missing required data');

      // Upload deliverable files
      const fileUrls = await Promise.all(
        deliverableFiles.map(async file => {
          const fileRef = ref(storage, `deliverables/${orderId}/${Date.now()}-${file.name}`);
          await uploadBytes(fileRef, file);
          return getDownloadURL(fileRef);
        })
      );

      const deliverableData: Partial<Deliverable> = {
        orderId,
        title: deliverableTitle,
        description: deliverableDescription,
        files: fileUrls,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      // Add deliverable
      await addDoc(collection(db, COLLECTIONS.DELIVERABLES), deliverableData);

      // Update order status
      const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
      await updateDoc(orderRef, {
        status: 'delivered',
        deliveredDate: serverTimestamp(),
        deliverables: [...(order.deliverables || []), deliverableData]
      });

      return true;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['order', orderId]);
        setDeliverableFiles([]);
        setDeliverableTitle('');
        setDeliverableDescription('');
        toast.success('Delivery submitted successfully');
      },
      onError: (error) => {
        console.error('Error submitting delivery:', error);
        toast.error('Failed to submit delivery');
      }
    }
  );

  // Accept delivery mutation
  const acceptDelivery = useMutation(
    async () => {
      if (!user || !order) throw new Error('Missing required data');

      const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
      await updateDoc(orderRef, {
        status: 'completed',
        completedDate: serverTimestamp()
      });

      // Release payment to seller
      // This should trigger a cloud function to handle the payment release
      
      return true;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['order', orderId]);
        toast.success('Delivery accepted successfully');
      }
    }
  );

  // Request revision mutation
  const requestRevision = useMutation(
    async (feedback: string) => {
      if (!user || !order) throw new Error('Missing required data');

      const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
      await updateDoc(orderRef, {
        status: 'active',
        'deliverables.at(-1).status': 'rejected',
        'deliverables.at(-1).feedback': feedback
      });

      return true;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['order', orderId]);
        toast.success('Revision requested successfully');
      }
    }
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
        <p className="text-gray-600 mb-4">The order you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/orders"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ajira-primary hover:bg-ajira-primary-dark"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const isDeliverable = order.status === 'active' && user?.uid === order.sellerId;
  const canAcceptDelivery = order.status === 'delivered' && user?.uid === order.buyerId;
  const canRequestRevision = order.status === 'delivered' && user?.uid === order.buyerId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(-8)}</h1>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'completed' ? 'bg-green-100 text-green-800' :
              order.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
              order.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span className="text-gray-500">
              <Clock className="inline-block w-4 h-4 mr-1" />
              {formatDistanceToNow(order.createdAt.toDate(), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Buyer</h3>
            <p className="text-gray-900">{order.buyerName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Seller</h3>
            <p className="text-gray-900">{order.sellerName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Package</h3>
            <p className="text-gray-900">{order.packageName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Price</h3>
            <p className="text-gray-900">KES {order.price.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Delivery Date</h3>
            <p className="text-gray-900">{new Date(order.deliveryDate.toDate()).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Status</h3>
            <p className={`${
              order.paymentStatus === 'paid' ? 'text-green-600' :
              order.paymentStatus === 'pending' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </p>
          </div>
        </div>

        {order.requirements && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Requirements</h3>
            <p className="text-gray-900 whitespace-pre-line">{order.requirements}</p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>
        
        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
          {order.messages?.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${
                msg.senderId === user?.uid
                  ? 'bg-ajira-primary text-white'
                  : 'bg-gray-100 text-gray-900'
              } rounded-lg p-3`}>
                <p className="text-sm mb-1">{msg.content}</p>
                {msg.attachments?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.attachments.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline"
                      >
                        Attachment {i + 1}
                      </a>
                    ))}
                  </div>
                )}
                <span className="text-xs opacity-75">
                  {formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full rounded-lg border-gray-300 focus:border-ajira-primary focus:ring-ajira-primary"
              rows={3}
            />
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-1 text-sm text-gray-600">
                    <span>{file.name}</span>
                    <button
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="hidden"
              />
              <Upload className="w-6 h-6 text-gray-500 hover:text-ajira-primary" />
            </label>
            <button
              onClick={() => sendMessage.mutate()}
              disabled={!message.trim() && files.length === 0}
              className="bg-ajira-primary text-white p-2 rounded-lg hover:bg-ajira-primary-dark disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Deliverables</h2>

        {order.deliverables?.map((deliverable, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{deliverable.title}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                deliverable.status === 'accepted' ? 'bg-green-100 text-green-800' :
                deliverable.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {deliverable.status.charAt(0).toUpperCase() + deliverable.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-600 mb-3">{deliverable.description}</p>
            <div className="flex flex-wrap gap-2">
              {deliverable.files.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-ajira-primary hover:text-ajira-primary-dark"
                >
                  <Download size={16} />
                  <span>Download File {i + 1}</span>
                </a>
              ))}
            </div>
            {deliverable.feedback && (
              <div className="mt-3 p-3 bg-red-50 text-red-800 rounded">
                <p className="font-medium mb-1">Revision Requested</p>
                <p>{deliverable.feedback}</p>
              </div>
            )}
          </div>
        ))}

        {isDeliverable && (
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium text-gray-900 mb-3">Submit Delivery</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={deliverableTitle}
                  onChange={(e) => setDeliverableTitle(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-ajira-primary focus:ring-ajira-primary"
                  placeholder="e.g., Final Logo Design"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={deliverableDescription}
                  onChange={(e) => setDeliverableDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border-gray-300 focus:border-ajira-primary focus:ring-ajira-primary"
                  placeholder="Describe what you're delivering..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Files
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-ajira-primary">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-600">
                      Drop files here or click to upload
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setDeliverableFiles(Array.from(e.target.files || []))}
                      className="hidden"
                    />
                  </label>
                </div>
                {deliverableFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {deliverableFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{file.name}</span>
                        <button
                          onClick={() => setDeliverableFiles(files => files.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => submitDelivery.mutate()}
                disabled={!deliverableTitle || !deliverableDescription || deliverableFiles.length === 0}
                className="w-full bg-ajira-primary text-white py-2 rounded-lg hover:bg-ajira-primary-dark disabled:opacity-50"
              >
                Submit Delivery
              </button>
            </div>
          </div>
        )}

        {canAcceptDelivery && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => acceptDelivery.mutate()}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              <CheckCircle className="inline-block w-5 h-5 mr-2" />
              Accept Delivery
            </button>
            <button
              onClick={() => {
                const feedback = prompt('Please provide feedback for the revision:');
                if (feedback) requestRevision.mutate(feedback);
              }}
              className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
            >
              <AlertTriangle className="inline-block w-5 h-5 mr-2" />
              Request Revision
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage; 