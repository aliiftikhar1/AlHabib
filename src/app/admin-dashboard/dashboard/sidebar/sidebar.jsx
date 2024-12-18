"use client";
import { useState, useEffect } from 'react';
import {
  FaSignOutAlt,
  FaChevronDown,
  FaUsers,
  FaGamepad,
  FaMoneyCheckAlt,
  FaCog,
  FaQuestionCircle,
  FaUserTie, // Import the new icon for Account Management
} from 'react-icons/fa';
import { PiHandDeposit } from "react-icons/pi";
import { PiHandWithdraw } from "react-icons/pi";
import { BiCoinStack } from "react-icons/bi";
import { CiBank } from "react-icons/ci";
import { useRouter } from 'next/navigation';
import { MdHistory } from "react-icons/md";
import { Analytics, AnalyticsOutlined, Home } from '@mui/icons-material';
import { UserIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Logout } from '@/app/Store/Slice';
const Sidebar = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('Guest'); // Default values
  const [userRole, setUserRole] = useState('admin'); // Default role
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const router = useRouter();

  const toggleDropdown = (key) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleLogout = () => {
    dispatch(Logout());
    // Perform any additional actions on logout if needed
    window.location.href = '/';
  };

  useEffect(() => {
    // Optional: You can add logic here for loading user info if needed
  }, []);

  // Define menu items with roles
  const menuItems = [
    {
      title: "Admin Management",
      path: "/admin-dashboard/Admin-Management",
      icon: <FaUsers className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
    },
    {
      title: "Agents Management",
      path: "/admin-dashboard/Agent-Management",
      icon: <FaUsers className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
    },
    {
      title: "Bookings Management",
      path: "/admin-dashboard/Booking-Management",
      icon: <BiCoinStack className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
    },
    {
      title: "Payment Requests",
      path: "/admin-dashboard/Payment-Management",
      icon: <BiCoinStack className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
    },

    {
      title: "Package Management",
      path: "/admin-dashboard/Package-Management",
      icon: <FaGamepad className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
    },


    {
      title: "Visa Management",
      path: "/admin-dashboard/Visa-Management",
      icon: <PiHandDeposit className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
    },

    {
      title: "Ticket Management",
      path: "/admin-dashboard/Ticket-Management",
      icon: <PiHandDeposit className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
    },



    {
      title: "Ledgers",
      path: "/admin-dashboard/Ledgers",
      icon: <PiHandWithdraw className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
    },
  
    {
      title: "Settings",
      path: "/admin-dashboard/settings",
      icon: <FaCog className="h-5 w-5" />,
      roles: ["admin"],
    },
  ];

  
  const dropdownMenuItems = [
    // {
    //   title: "Settings",
    //   roles: ["admin"], // Only admin can see this dropdown
    //   list: [
    //     {
    //       title: "System Settings",
    //       path: "/admin-dashboard/settings",
    //       icon: <FaCog />,
    //       roles: ["admin"],
    //     },
    //     {
    //       title: "FAQs",
    //       path: "/admin-dashboard/faqs",
    //       icon: <FaQuestionCircle />,
    //       roles: ["admin", "sub admin"],
    //     },
    //   ],
    // },
  ];

  return (
    <div className="bg-white text-gray-800 w-full min-h-screen flex flex-col border">
      {/* Profile Section */}
      <div className="px-6 pt-2 text-center">
        <div
          className=" mx-auto mb-4 size-24 text-3xl flex justify-center items-center rounded-full border"
        >AL</div>
        <h2 className="text-xl font-semibold">Al Habib</h2>
      </div>

      {/* Menu Section */}
      <div className="flex-1 p-4 ">
        <ul className=" space-y-2">
          {/* Dynamic Menu Items */}
          <li key='home'>
                  <a href='/admin-dashboard/Analytics'>
                    <button className="flex hover:ml-3 transform transition-all duration-300 items-center p-2 hover:bg-gray-200/20 border-gray-500/20 border hover:border-gray-800 hover:border-1 rounded-md w-full">
                      <AnalyticsOutlined/>
                      <span className="ml-3 text-sm font-medium">
                        Analytics
                      </span>
                    </button>
                  </a>
                </li>

                <li key='profile'>
                  <a href='/admin-dashboard/Manage-Profile'>
                    <button className="flex hover:ml-3 transform transition-all duration-300 items-center p-2 hover:bg-gray-200/20 border-gray-500/20 border hover:border-gray-800 hover:border-1 rounded-md w-full">
                      <UserIcon className='size-5'/>
                      <span className="ml-3 text-sm font-medium">
                        Manage Profile
                      </span>
                    </button>
                  </a>
                </li>
          {menuItems.map(
            (item) =>
              item.roles.includes(userRole) && (
                <li key={item.title}>
                  <a href={item.path}>
                    <button className="flex hover:ml-3 transform transition-all duration-300 items-center p-2 hover:bg-gray-200/20 border-gray-500/20 border hover:border-gray-800 hover:border-1 rounded-md w-full">
                      {item.icon}
                      <span className="ml-3 text-sm font-medium">
                        {item.title}
                      </span>
                    </button>
                  </a>
                </li>
              )
          )}

          {/* Dropdown Menu */}
          {dropdownMenuItems.map(
            (category, index) =>
              category.roles.includes(userRole) && (
                <li key={category.title}>
                  <button
                    className="flex items-center w-full p-3 hover:bg-blue-700 rounded-md focus:outline-none"
                    onClick={() => toggleDropdown(index)}
                  >
                    <span className="ml-3 text-sm font-medium">
                      {category.title}
                    </span>
                    <FaChevronDown
                      className={`h-4 w-4 ml-auto transform transition-transform duration-200 ${
                        isDropdownOpen[index] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isDropdownOpen[index] && (
                    <ul className="ml-6 mt-2 space-y-2">
                      {category.list.map(
                        (item) =>
                          item.roles.includes(userRole) && (
                            <li key={item.title}>
                              <a href={item.path}>
                                <button className="flex items-center p-2 hover:bg-blue-700 rounded-md w-full">
                                  {item.icon}
                                  <span className="ml-3 text-sm font-medium">
                                    {item.title}
                                  </span>
                                </button>
                              </a>
                            </li>
                          )
                      )}
                    </ul>
                  )}
                </li>
              )
          )}

          {/* Logout Button */}
          <li className="mt-6">
            <button
              className="flex hover:ml-3 transform transition-all duration-300 items-center p-3 hover:bg-gray-200/20 border-gray-500/20 border hover:border-gray-800 hover:border-1 rounded-md w-full"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="h-5 w-5" />
              <span className="ml-3 text-sm font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
