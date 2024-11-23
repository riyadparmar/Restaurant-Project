import React, { useState, useEffect } from 'react';
import { Clock, Save } from 'lucide-react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';

const StoreHoursManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeHours, setStoreHours] = useState({
    monday: { isOpen: true, open: '09:00', close: '17:00' },
    tuesday: { isOpen: true, open: '09:00', close: '17:00' },
    wednesday: { isOpen: true, open: '09:00', close: '17:00' },
    thursday: { isOpen: true, open: '09:00', close: '17:00' },
    friday: { isOpen: true, open: '09:00', close: '17:00' },
    saturday: { isOpen: true, open: '10:00', close: '16:00' },
    sunday: { isOpen: false, open: '10:00', close: '16:00' }
  });

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 
    'thursday', 'friday', 'saturday', 'sunday'
  ];

  useEffect(() => {
    const fetchStoreHours = async () => {
      try {
        setLoading(true);
        const storeHoursQuery = query(
          collection(db, "storeHours"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const snapshot = await getDocs(storeHoursQuery);
        
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setStoreHours(data.hours);
        }
      } catch (error) {
        console.error("Error fetching store hours:", error);
        alert("Error loading store hours");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreHours();
  }, []);

  const handleTimeChange = (day, field, value) => {
    setStoreHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const toggleDayOpen = (day) => {
    setStoreHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen
      }
    }));
  };

  const saveStoreHours = async () => {
    try {
      setSaving(true);
      await addDoc(collection(db, "storeHours"), {
        hours: storeHours,
        createdAt: new Date(),
      });
      alert("Store hours saved successfully!");
    } catch (error) {
      console.error("Error saving store hours:", error);
      alert("Error saving store hours");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="text-center">Loading store hours...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Store Hours</h2>
          <button
            onClick={saveStoreHours}
            disabled={saving}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Hours'}
          </button>
        </div>

        <div className="space-y-4">
          {daysOfWeek.map(day => (
            <div key={day} className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-50 rounded-lg">
              <div className="col-span-3 font-medium capitalize">{day}</div>
              
              <div className="col-span-3">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={storeHours[day].isOpen}
                    onChange={() => toggleDayOpen(day)}
                    className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm">Open</span>
                </label>
              </div>

              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <input
                    type="time"
                    value={storeHours[day].open}
                    onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                    disabled={!storeHours[day].isOpen}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <input
                    type="time"
                    value={storeHours[day].close}
                    onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                    disabled={!storeHours[day].isOpen}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreHoursManager;