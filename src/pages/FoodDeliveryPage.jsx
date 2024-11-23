import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import dayjs from "dayjs";

const FoodDeliveryPage = () => {
    const [featuredItems, setFeaturedItems] = useState([]);
    const [thisWeekItems, setThisWeekItems] = useState({});
    const [selectedDay, setSelectedDay] = useState(dayjs().format("dddd").toLowerCase());
    const [storeHours, setStoreHours] = useState({});
    const today = dayjs().format("dddd").toLowerCase();
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const itemsCollection = collection(db, "menuItems");
    const weekDataCollection = collection(db, "weeklyMenus");

    const todayMenuRef = useRef(null);
    const weekMenuRef = useRef(null);

    const fetchItems = async () => {
        const data = await getDocs(itemsCollection);
        const allItems = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setFeaturedItems(allItems);

        const weekDataDoc = await getDocs(weekDataCollection);
        if (weekDataDoc.docs.length > 0) {
            setThisWeekItems(weekDataDoc.docs[0].data().menu);
        }
    };

    const fetchStoreHours = async () => {
        const storeHoursCollection = collection(db, "storeHours");
        const storeHoursData = await getDocs(storeHoursCollection);

        if (!storeHoursData.empty) {
            const latestStoreHours = storeHoursData.docs[0].data().hours;
            setStoreHours(latestStoreHours);
        }
    };

    const handleDaySelect = (day) => {
        setSelectedDay(day);
    };

    const scrollToTodayMenu = () => {
        if (todayMenuRef.current) {
            todayMenuRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const scrollToWeekMenu = () => {
        if (weekMenuRef.current) {
            weekMenuRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        fetchItems();
        fetchStoreHours();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-green-50 px-6 py-12 md:px-12 md:py-16 flex flex-col md:flex-row items-center justify-between">
                <div className="max-w-xl">
                    <div className="inline-block bg-gray-200 rounded px-2 py-1 mb-4">
                        <span className="font-bold">Explore Our Menu</span> for dine-in or takeout
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Browse the Menu Anytime, Anywhere.
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Discover our dishes and order for a delightful experience.
                    </p>

                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <button
                            key="today menu"
                            className="px-4 py-2 rounded-full bg-gray-200 hover:bg-green-700 hover:text-white"
                            onClick={scrollToTodayMenu}
                        >
                            Today's menu
                        </button>
                        <button
                            key="this week menu"
                            className="px-4 py-2 rounded-full bg-gray-200 hover:bg-green-700 hover:text-white"
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
                        return item ? <MenuItem key={item.id} item={item} /> : null;
                    })}
                </div>
            </div>

            {/* This Week's Menu */}
            <div className="px-6 py-12 md:px-12" ref={weekMenuRef}>
                <h3 className="text-2xl font-bold mb-8 border-b-4 border-orange-500 inline-block">
                    This week
                </h3>
                <div className="flex flex-wrap gap-4 justify-center">
                    {weekdays.map((day) => (
                        <button
                            key={day}
                            className={`px-4 py-2 rounded-full ${
                                day.toLowerCase() === selectedDay
                                    ? "bg-green-700 text-white"
                                    : "bg-gray-200 hover:bg-green-700 hover:text-white"
                            }`}
                            onClick={() => handleDaySelect(day.toLowerCase())}
                        >
                            {day}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {thisWeekItems[selectedDay]?.map((itemId) => {
                        const item = featuredItems.find((i) => i.id === itemId);
                        return item ? <MenuItem key={item.id} item={item} /> : null;
                    })}
                </div>
            </div>

            {/* Store Hours */}
            <div className="px-6 py-12 md:px-12">
                <h3 className="text-2xl font-bold mb-8 border-b-4 border-orange-500 inline-block">
                    Store Hours
                </h3>
                <div className="bg-green-50 rounded-lg p-6 shadow-md">
                    {/* Column Headings */}
                    <div className="flex justify-between items-center py-1 px-4 font-bold text-gray-700">
                        <span className="w-1/2 text-center">Days</span>
                        <span className="w-1/2 text-center">Timings</span>
                    </div>
                    {/* Sorted Store Hours Rows */}
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(
                        (day) => (
                            <div
                                key={day}
                                className="flex justify-between items-center py-1 px-4 hover:bg-green-100 rounded-lg"
                            >
                                <span className="w-1/2 text-center capitalize">{day}</span>
                                <span className="w-1/2 text-center text-gray-700">
                                    {storeHours[day]?.isOpen
                                        ? `${storeHours[day].open} - ${storeHours[day].close}`
                                        : "Closed"}
                                </span>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

const MenuItem = ({ item }) => {
    return (
        <div className="bg-green-50 p-4 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition">
            <div className="bg-gray-200 rounded-lg h-40 w-full mb-4">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full rounded-lg object-cover"
                />
            </div>
            <h3 className="text-lg font-bold mb-2">{item.name}</h3>
            <p className="text-sm text-gray-700">{item.description}</p>
        </div>
    );
};

export default FoodDeliveryPage;