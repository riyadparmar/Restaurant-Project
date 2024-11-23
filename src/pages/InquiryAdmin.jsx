import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';

const InquiryAdmin = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "inquiries"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const inquiriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      setInquiries(inquiriesData);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    try {
      const inquiryRef = doc(db, "inquiries", inquiryId);
      await updateDoc(inquiryRef, {
        status: newStatus
      });
      fetchInquiries();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (inquiryId) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await deleteDoc(doc(db, "inquiries", inquiryId));
        fetchInquiries();
      } catch (error) {
        console.error("Error deleting inquiry:", error);
      }
    }
  };

  const filteredInquiries = filter === 'all' 
    ? inquiries 
    : inquiries.filter(inquiry => inquiry.status === filter);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Inquiries Management</h2>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Inquiries</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No inquiries found</div>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <div 
                key={inquiry.id} 
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{inquiry.name}</h3>
                    <p className="text-sm text-gray-600">{inquiry.email}</p>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">
                        {inquiry.category}
                      </span>
                      <span className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded
                        ${inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' : ''}
                        ${inquiry.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${inquiry.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}`}
                      >
                        {inquiry.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(inquiry.id, 'in-progress')}
                      className="p-2 hover:bg-yellow-100 rounded-full"
                      title="Mark as In Progress"
                    >
                      <CheckCircle className="w-5 h-5 text-yellow-500" />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(inquiry.id, 'resolved')}
                      className="p-2 hover:bg-green-100 rounded-full"
                      title="Mark as Resolved"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(inquiry.id)}
                      className="p-2 hover:bg-red-100 rounded-full"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{inquiry.description}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Submitted: {inquiry.timestamp?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryAdmin;