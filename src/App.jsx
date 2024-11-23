import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import InquiryAdmin from './pages/InquiryAdmin'
import InquiryForm from './pages/InquiryForm'
import RestaurantAdmin from './pages/RestaurantAdmin'
import StoreHoursManager from './pages/StoreHoursManager'
import WeeklyMenuPlanner from './pages/WeeklyMenuPlanner'
import Header from './pages/Header';
import PrivateRoute from "./PrivateRoute";
import LoginPage from "./pages/LoginPage";
import FoodDeliveryPage from "./pages/FoodDeliveryPage";
import AboutUs from "./pages/AboutUs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <> <Header/><FoodDeliveryPage /></>,
  },
  {
    path: "/aboutus",
    element: <> <Header/><AboutUs /></>,
  },
  {
    path: "/contact-us",
    element: <> <Header/><InquiryForm /></>,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: "/admin/inquiry",
    element: (
      <PrivateRoute adminOnly>
        <> <Header/><InquiryAdmin /></>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/restaurant-admin",
    element: (
      <PrivateRoute adminOnly>
        <>
          <Header />
          <RestaurantAdmin />
        </>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute adminOnly>
        <>
          <Header />
          <RestaurantAdmin />
        </>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/store-hours-manager",
    element: (
      <PrivateRoute adminOnly>
        <> <Header/><StoreHoursManager /></>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/weekly-menu-planner",
    element: (
      <PrivateRoute adminOnly>
        <> <Header/><WeeklyMenuPlanner /></>
      </PrivateRoute>
    ),
  },
  {
    path: "/home",
    element: <> <Header/><FoodDeliveryPage /></>,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;