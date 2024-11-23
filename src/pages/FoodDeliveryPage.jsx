import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import dayjs from 'dayjs';

const FoodDeliveryPage = () => {
    const [featuredItems, setFeaturedItems] = useState([]);
    const [thisWeekItems, setThisWeekItems] = useState({});
    const [selectedDay, setSelectedDay] = useState(dayjs().format('dddd').toLowerCase());

    const today = dayjs().format('dddd').toLowerCase();
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const itemsCollection = collection(db, "menuItems");
    const weekDataCollection = collection(db, "weeklyMenus");

    const todayMenuRef = useRef(null);
    const weekMenuRef = useRef(null);

    const fetchItems = async () => {
        const data = await getDocs(itemsCollection);
        const allItems = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setFeaturedItems(allItems);

        const weekDataDoc = await getDocs(weekDataCollection);
        if (weekDataDoc.docs.length > 0) {
            setThisWeekItems(weekDataDoc.docs[0].data().menu);
        }
    };

    const handleDaySelect = (day) => {
        setSelectedDay(day);
    };

    const scrollToTodayMenu = () => {
        if (todayMenuRef.current) {
            todayMenuRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToWeekMenu = () => {
        if (weekMenuRef.current) {
            weekMenuRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-[#FFF8E7] px-6 py-12 md:px-12 md:py-16 flex flex-col md:flex-row items-center justify-between">
                <div className="max-w-xl">
                    <div className="inline-block bg-gray-200 rounded px-2 py-1 mb-4">
                        <span className="font-bold">Explore Our Menu</span> for dine-in or takeout
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Browse the Menu Anytime, Anywhere.</h2>
                    <p className="text-gray-600 mb-6">Discover our dishes and order for a delightful experience.</p>

                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <button
                            key="today menu"
                            className="px-4 py-2 rounded-full bg-[#8B1C24] text-white hover:bg-[#DAA520]"
                            onClick={scrollToTodayMenu}
                        >
                            Today's menu
                        </button>
                        <button
                            key="this week menu"
                            className="px-4 py-2 rounded-full bg-[#8B1C24] text-white hover:bg-[#DAA520]"
                            onClick={scrollToWeekMenu}
                        >
                            This week's menu
                        </button>
                    </div>
                </div>
            </div>

            {/* Today's Items */}
            <div className="px-6 py-12 md:px-12" ref={todayMenuRef}>
                <h3 className="text-2xl font-bold mb-8 border-b-4 border-orange-500 inline-block">
                    Today's Items
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {thisWeekItems[today]?.map((itemId) => {
                        const item = featuredItems.find((i) => i.id === itemId);
                        return item ? (
                            <MenuItem key={item.id} item={item} />
                        ) : null;
                    })}
                </div>
            </div>
            <div className="px-6 py-12 md:px-12" ref={weekMenuRef}>
                <h3 className="text-2xl font-bold mb-8 border-b-4 border-orange-500 inline-block">
                    This week
                </h3>
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {weekdays.map((day) => (
                            <button
                                key={day}
                                className={`px-4 py-2 rounded-full ${day.toLowerCase() === selectedDay
                                        ? 'bg-green-700 text-white'
                                        : 'bg-gray-200 hover:bg-green-700 hover:text-white'
                                    }`}
                                onClick={() => handleDaySelect(day.toLowerCase())}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                    <button className="px-4 py-2 rounded-full bg-[#8B1C24] text-white hover:bg-[#DAA520]">
                        All Days
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {thisWeekItems[selectedDay]?.map((itemId) => {
                        const item = featuredItems.find((i) => i.id === itemId);
                        return item ? (
                            <MenuItem key={item.id} item={item} />
                        ) : null;
                    })}
                </div>
            </div>
        </div >
    );
};

const MenuItem = ({ item }) => {
    return (
        <div className="bg-green-50 rounded-lg p-4">
            <div className="relative mb-4">
                <img
                    src={item.image || "/api/placeholder/200/200"}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg"
                />
                <span className="absolute top-2 right-2 bg-[#8B1C24] text-white px-2 py-1 rounded">
                    ${item.price}
                </span>
            </div>

            <h4 className="font-bold mb-2">{item.name}</h4>
            <p className="text-sm text-gray-600 mb-4">{item.description}</p>
        </div>
    );
};

export default FoodDeliveryPage;