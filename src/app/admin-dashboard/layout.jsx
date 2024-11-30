'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './dashboard/navbar/navbar';
import Sidebar from './dashboard/sidebar/sidebar';
import { ToastContainer } from "react-toastify";
import { useSelector } from 'react-redux';
import { Providers } from '../Store/Provider';
import UserChecker from './Usercheck';

const Layout = ({ children }) => {
  // const router = useRouter();
  // const Authenticated = useSelector((data)=>data.isAuthenticated);
  // const userrole = useSelector((data)=>data.user.role);
  // useEffect(()=>{

  //   if(Authenticated){
  //     if(userrole==='Admin'){
  //       router.push('/admin-dashboard/Home')
  //     }else if(userrole==='Agent'){
  //       router.push('/admin-dashboard/Home')
  //     }
      
  //   }else{
  //     router.push('/admin')
  //   }
  // },[userrole,Authenticated])
  return (
    <Providers>
      <UserChecker/>
    <div className="flex w-full min-h-screen bg-white">
      <div className="flex w-[350px]">
        <ToastContainer />
        <Sidebar />
      </div>
      <div className="flex flex-col w-full flex-grow">
        <Navbar />
        <div className="p-2">
          {children}
        </div>
      </div>
    </div>
    </Providers>
  );
};

export default Layout;
