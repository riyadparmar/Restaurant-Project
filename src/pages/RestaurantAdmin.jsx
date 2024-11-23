import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
} from 'firebase/firestore';

const RestaurantAdmin = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    availability: true,
    image: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const itemsCollection = collection(db, "menuItems");

  const fetchItems = async () => {
    const data = await getDocs(itemsCollection);
    setItems(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      const itemDoc = doc(db, "menuItems", editingId);
      await updateDoc(itemDoc, formData);
      setIsEditing(false);
      setEditingId(null);
    } else {
      await addDoc(itemsCollection, formData);
    }
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      availability: true,
      image: null,
    });
    fetchItems();
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    const itemDoc = doc(db, "menuItems", id);
    await deleteDoc(itemDoc);
    fetchItems();
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-7xl mx-auto">
      {/* Left side: Menu List */}
      <div className="bg-white p-6 rounded-lg shadow-md flex-1">
        <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="border rounded-lg p-4">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              <p className="font-medium">${item.price}</p>
              <p className="text-sm mb-2">Category: {item.category}</p>
              <p className={`text-sm ${item.availability ? 'text-green-600' : 'text-red-600'}`}>
                {item.availability ? 'Available' : 'Not Available'}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-500 text-white p-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Form */}
      <div className="bg-white p-6 rounded-lg shadow-md flex-1">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? 'Edit Item' : 'Add New Item'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Category</option>
                <option value="appetizer">Appetizer</option>
                <option value="main">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="flex items-center font-medium">
                <input
                  type="checkbox"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Available
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows="3"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Image</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt={formData.name}
                  className="w-full h-48 object-cover rounded-lg mt-4"
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            {isEditing ? 'Update Item' : 'Add Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantAdmin;