'use client';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { AddUser, UpdateUser } from '@/app/Store/Slice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader, Menu } from 'lucide-react'; // Import loader icon
import toast, { Toaster } from 'react-hot-toast'; // Import toast for notifications
import { Button } from "@/components/ui/button";
import { Logout } from '@/app/Store/Slice';
// import UpdateUserRedux from './updateuserredux';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  // const Authenticated = useSelector((data) => data.isAuthenticated);
  const userid = useSelector((data) => data.user.id);
  const userrole = useSelector((data) => data.user.role);
  const username = useSelector((data) => data.user.username);
  const router = useRouter();
  const [loginmodalopen,setloginmodalopen]=useState(false);
  const [loginlink, setloginlink] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  
    useEffect( () => {
      const fetchuserdetails = async () => {
        const data = await fetch(`/api/user/${userid}`);
        const user = await data.json();
        dispatch(UpdateUser({id:user.id, fullname:user.fullname, username:user.username, balance:user.balance, role:user.role}))
      }
      fetchuserdetails();
    }, [userid]);
    



  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
    setIsLoading(true);

    try {
      const response = await axios.post(`/api/admin/user/login`, { username, password });

      if (response.status === 200) {
        const { data } = response;
        dispatch(
          AddUser({
            id: data.user.id,
            fullname: data.user.fullname,
            username: data.user.username,
            balance: data.user.balance || 0,
            role: data.user.role,
          })
        );

        toast.success('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          if (data.user.role === 'admin' || data.user.role === 'superadmin') {
            router.push('/admin-dashboard/Analytics');
          } else if (data.user.role === 'agent') {
            router.push('/agent-dashboard/Analytics');
          }
        }, 1500);
        //  if (data.user.role === 'agent')    
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Error logging in. Please try again later.';
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  return (
    <header className="fixed top-0 w-full h-12 md:h-16 bg-white backdrop-blur-sm text-black border-b flex items-center px-6 md:px-10 z-40">
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        {/* <h1 className="text-4xl font-bold ">
          AlHabib
        </h1> */}
        <img src='/logo/logo1.jpg' className="md:h-16 h-12 p-1"></img>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-lg">
          <a href="/" className="hover:text-blue-500">
            Home
          </a>
          <a href="#services" className="hover:text-blue-500">
            Services
          </a>
          <a href="#destinations" className="hover:text-blue-500">
            Destinations
          </a>
          <a href="#about" className="hover:text-blue-500">
            About
          </a>
          <a href="#contact" className="hover:text-blue-500">
            Contact
          </a>
          <a
            href="/"
            className="hover:text-blue-500"
            // onClick={() => setIsMobileMenuOpen(false)}
          >
            Flights
          </a>
          <a
            href="/"
            className="hover:text-blue-500"
            // onClick={() => setIsMobileMenuOpen(false)}
          >
            Hotels
          </a>
        
        </nav>
        <div className='hidden md:flex md:w-auto w-full md:mr-0 mr-4 border-black'>
        
        {username?(
          <div className='flex justify-end md:justify-center items-center gap-4'>
            {userrole==='agent'&&<a href='/admin' className='px-4 py-1 rounded-full border hover:bg-blue-100'>Dashboard</a>}
            <Button onClick={() => dispatch(Logout())} className="bg-red-600 h-8">Logout</Button>
          <div className='hidden md:flex'>{username}</div>
          </div>):(<>
          <div className=" space-x-2">
            <Button onClick={()=>{setloginmodalopen(true)}} className="bg-primary hover:bg-secondary hover:text-black border border-black w-20">
              Login
            </Button>
            
              <Modal
                isOpen={loginmodalopen}
                onRequestClose={()=>{setloginmodalopen(false)}}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 md:p-8 rounded-2xl shadow-2xl md:w-[450px] w-full "
                overlayClassName="fixed z-40 inset-0 bg-black/50 backdrop-blur-sm"
              >
                <Toaster />
                <div className="flex flex-col space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-primary">User Login</h2>
                    <p className="text-gray-600 mt-2">Welcome back! Please enter your details</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {errorMessage && (
                      <div className="text-red-500 text-sm font-medium">{errorMessage}</div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="Enter your username"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="Enter your password"
                        required
                      />
                    </div>

                    {/* <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-primary hover:text-primary/80">
              Forgot password?
            </a>
          </div> */}

                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      {isLoading ? <Loader className="animate-spin w-5 h-5" /> : 'Sign In'}
                    </button>
                  </form>

                  <button
                    onClick={()=>{setloginmodalopen(false)}}
                    className="absolute -top-2 right-4 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close modal"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </Modal>
              <a href="/User-Registeration">
              <Button className="bg-secondary text-black hover:text-white border-black border w-20">
                SignUp
              </Button>
            </a>
            </div>
           
          </>)}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="block md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
         <Menu/>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="absolute top-12 left-0 w-full bg-black/90 text-white flex flex-col items-center gap-6 py-6 md:hidden">
          <a
            href="/"
            className="hover:text-blue-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="#services"
            className="hover:text-blue-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Services
          </a>
          <a
            href="#destinations"
            className="hover:text-blue-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Destinations
          </a>
          <a
            href="#about"
            className="hover:text-blue-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </a>
          <a
            href="#contact"
            className="hover:text-blue-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </a>
          <a
            href="/"
            className="hover:text-blue-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Flights
          </a>
          <a
            href="/"
            className="hover:text-blue-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Hotels
          </a>
          {userrole==='agent'&&<a href='/admin' className='px-4 py-1 rounded-full border hover:bg-blue-100'>Dashboard</a>}
          {username?(<div className='flex justify-end md:justify-center items-center gap-4'><Button onClick={() => dispatch(Logout())} className="bg-red-600 h-8">Logout</Button>
          <div className='hidden md:flex'>{username}</div>
          </div>):(<>
          <div className=" space-x-2">
            <Button onClick={()=>{setloginmodalopen(true)}} className="bg-blue-500 hover:bg-secondary hover:text-black border border-black w-20">
              Login
            </Button>
              <a href="/User-Registeration">
              <Button className="bg-green-500 text-white hover:text-white border-black border w-20">
                SignUp
              </Button>
            </a>
            </div>
           
          </>)}
        </nav>
      )}
    </header>
  );
}
