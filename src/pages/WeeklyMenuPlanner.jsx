import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  updateDoc
} from 'firebase/firestore';

const WeeklyMenuPlanner = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [weeklyMenu, setWeeklyMenu] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 
    'thursday', 'friday', 'saturday', 'sunday'
  ];

  // Fetch both menu items and current weekly menu on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch menu items
        const menuItemsSnapshot = await getDocs(collection(db, "menuItems"));
        const menuItemsData = menuItemsSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setMenuItems(menuItemsData);

        // Fetch most recent weekly menu
        const weeklyMenuQuery = query(
          collection(db, "weeklyMenus"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const weeklyMenuSnapshot = await getDocs(weeklyMenuQuery);
        
        if (!weeklyMenuSnapshot.empty) {
          const weeklyMenuData = weeklyMenuSnapshot.docs[0].data();
          setWeeklyMenu(weeklyMenuData.menu);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const saveWeeklyMenu = async () => {
  //   try {
  //     setSaving(true);
  //     await addDoc(collection(db, "weeklyMenus"), {
  //       menu: weeklyMenu,
  //       createdAt: new Date(),
  //     });
  //     alert("Weekly menu saved successfully!");
  //   } catch (error) {
  //     console.error("Error saving weekly menu:", error);
  //     alert("Error saving weekly menu");
  //   } finally {
  //     setSaving(false);
  //   }
  // };


const saveWeeklyMenu = async () => {
  try {
    setSaving(true);

    // Query the weeklyMenus collection to check if a document already exists
    const q = query(collection(db, "weeklyMenus"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // If a document is found, update it
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        menu: weeklyMenu,
        createdAt: new Date(),
      });
      alert("Weekly menu updated successfully!");
    } else {
      // If no document is found, create a new one
      await addDoc(collection(db, "weeklyMenus"), {
        menu: weeklyMenu,
        createdAt: new Date(),
      });
      alert("Weekly menu saved successfully!");
    }
  } catch (error) {
    console.error("Error saving weekly menu:", error);
    alert("Error saving weekly menu");
  } finally {
    setSaving(false);
  }
};


  const clearAllSelections = () => {
    setWeeklyMenu({
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    });
  };

  const toggleItemForDay = (itemId, day) => {
    setWeeklyMenu(prev => {
      const isItemInDay = prev[day].includes(itemId);
      if (isItemInDay) {
        return {
          ...prev,
          [day]: prev[day].filter(id => id !== itemId)
        };
      } else {
        return {
          ...prev,
          [day]: [...prev[day], itemId]
        };
      }
    });
  };

  const isItemSelectedForDay = (itemId, day) => {
    return weeklyMenu[day].includes(itemId);
  };

  const getItemsForDay = (day) => {
    return weeklyMenu[day].map(itemId => 
      menuItems.find(item => item.id === itemId)
    ).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={saveWeeklyMenu}
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Weekly Menu'}
        </button>
        <button
          onClick={clearAllSelections}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Clear All Selections
        </button>
      </div>

      {/* Weekly Menu Planning Grid */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Weekly Menu Planner</h2>
        
        <div className="grid grid-cols-8 gap-4 mb-6">
          <div className="font-bold">Items</div>
          {daysOfWeek.map(day => (
            <div key={day} className="font-bold capitalize">
              {day}
            </div>
          ))}
        </div>

        {menuItems.map(item => (
          <div key={item.id} className="grid grid-cols-8 gap-4 mb-4 items-center">
            <div className="font-medium">
              {item.name}
              <div className="text-sm text-gray-500">
                ${item.price} - {item.category}
              </div>
            </div>
            
            {daysOfWeek.map(day => (
              <div key={day} className="flex justify-center">
                <button
                  onClick={() => toggleItemForDay(item.id, day)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  {isItemSelectedForDay(item.id, day) ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-300" />
                  )}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Daily Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {daysOfWeek.map(day => (
          <div key={day} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 capitalize">{day}'s Menu</h3>
            <div className="space-y-2">
              {getItemsForDay(day).map(item => (
                <div key={item.id} className="p-2 bg-gray-50 rounded">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    ${item.price} - {item.category}
                  </div>
                </div>
              ))}
              {getItemsForDay(day).length === 0 && (
                <div className="text-gray-500 text-sm">
                  No items selected for this day
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyMenuPlanner;