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
import { Analytics, AnalyticsOutlined, Home, Money } from '@mui/icons-material';
import { UserIcon } from '@heroicons/react/24/outline';
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
  };
  useEffect(() => {
    // Optional: You can add logic here for loading user info if needed
  }, []);

  // Define menu items with roles
  const menuItems = [
    {
      title: "Book Tickets",
      path: "/agent-dashboard/Book-Ticket",
      icon: <MdHistory className="h-5 w-5" />, // Ticket or history-related icon
      roles: ["admin", "sub admin"],
    },
    {
      title: "Book Flights",
      path: "/agent-dashboard/Book-Flights",
      icon: <MdHistory className="h-5 w-5" />, // Ticket or history-related icon
      roles: ["admin", "sub admin"],
    },
    {
      title: "Add Payment",
      path: "/agent-dashboard/Add-Payment",
      icon: <PiHandDeposit className="h-5 w-5" />, // Deposit icon for payments
      roles: ["admin", "sub admin"],
    },
    {
      title: "Book Packages",
      path: "/agent-dashboard/Book-Package",
      icon: <FaGamepad className="h-5 w-5" />, // Travel-related icon
      roles: ["admin", "sub admin"],
    },
   
    {
      title: "Book Visas",
      path: "/agent-dashboard/Book-Visa",
      icon: <FaUserTie className="h-5 w-5" />, // Formal/business icon for visas
      roles: ["admin", "sub admin"],
    },
    {
      title: "My Bookings",
      path: "/agent-dashboard/My-Booking",
      icon: <BiCoinStack className="h-5 w-5" />, // Stack icon for personal bookings
      roles: ["admin", "sub admin"],
    },
    {
      title: "Settings",
      path: "/agent-dashboard/settings",
      icon: <FaCog className="h-5 w-5" />, // Settings gear icon
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
    //       path: "/agent-dashboard/settings",
    //       icon: <FaCog />,
    //       roles: ["admin"],
    //     },
    //     {
    //       title: "FAQs",
    //       path: "/agent-dashboard/faqs",
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
          className=" mb-4 w-full text-3xl flex justify-center items-center "
        >
          <img src="/logo/logo1.jpg" width={50} height={50} alt="logo" className='object-contain w-full h-20'/>
          </div>
        {/* <h2 className="text-xl font-semibold">Al Habib</h2> */}
      </div>

      {/* Menu Section */}
      <div className="flex-1 p-4 ">
        <ul className=" space-y-2">
          {/* Dynamic Menu Items */}
          <li key='home'>
                  <a href='/agent-dashboard/Analytics'>
                    <button className="flex hover:ml-3 transform transition-all duration-300 items-center p-2 hover:bg-gray-200/20 border-gray-500/20 border hover:border-gray-800 hover:border-1 rounded-md w-full">
                      <AnalyticsOutlined/>
                      <span className="ml-3 text-sm font-medium">
                        Analytics
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
          <li key='profile'>
                  <a href='/agent-dashboard/Manage-Profile'>
                    <button className="flex hover:ml-3 transform transition-all duration-300 items-center p-2 hover:bg-gray-200/20 border-gray-500/20 border hover:border-gray-800 hover:border-1 rounded-md w-full">
                      <UserIcon className='size-5'/>
                      <span className="ml-3 text-sm font-medium">
                        Manage Profile
                      </span>
                    </button>
                  </a>
                </li>
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
