"use client";
import { Person } from "@mui/icons-material";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MdNotifications, MdOutlineChat, MdPublic, MdSearch } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Logout } from "@/app/Store/Slice";
const Navbar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [userdropdown,setuserdropdown]= useState(false)

  return (
    <header className="flex items-center justify-between bg-white p-3  border-b border-t border-r  h-16">
      <div className="flex items-center">
        <div className="text-gray-800 text-xl font-bold capitalize ml-5">
          {pathname.split("/").pop() === "Submittions" ? (
            <>
            Submissions
            </>
          ):(
            <>
            {pathname.split("/").pop()}
            </>
          )}
         
        </div>
      </div>
      <div className="flex items-center px-5 ">
        <div className="flex items-center bg-white  p-1 rounded-lg h-10">
          <p className="text-xl px-4">agent@gmail.com</p>
          {/* <MdSearch className="text-black" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-black ml-2"
          /> */}
        </div>
        {/* <div className="relative ">
          <MdOutlineChat size={28} />
        </div>
        <div className="relative ">
          <MdNotifications size={28} />
        </div>
        <div className="relative  mr-4">
          <MdPublic size={28} />
        </div> */}
        <div className="relative">
          <button onClick={()=>{setuserdropdown(!userdropdown)}} className="rounded-full border hover:border hover:border-blue-500 p-2">
          <Person className="text-2xl"/>
          </button>
          {userdropdown &&(
            <>
            <div className="absolute top-full bg-white px-3 py-3 right-0 flex flex-col border">
              <button onClick={()=>dispatch(Logout())} className="border border-gray-300/0 hover:border-gray-800 px-2 py-1 rounded">
                Logout
              </button>
            </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
