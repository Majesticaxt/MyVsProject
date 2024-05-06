import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [acc, setAcc] = useState('')

  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['#3498db', '#4682b4', '#5774a9', '#686f8a', '#7a7e95'];

  useEffect(() => {
    setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 2000);
  }, [colors.length]);

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const accountNumber = Math.floor(Math.random() * 1000000000).toString().padStart(10, '0');
      setAcc(accountNumber);


      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            account_number: acc,
            account_balance: 0,
          },
        },
      });
      setAcc(accountNumber);
      if (error) throw error;
      alert("Check your email for verification link");
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div
      className="h-screen flex justify-center items-center flex-col"
      style={{
        backgroundColor: colors[colorIndex],
        transition: 'background-color 0.5s ease-in-out',
      }}
    >
      <h1 className=' font-bold text-2xl text-white mb-4'>Welcome</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-8 md:p-12 lg:p-16 xl:p-20"
      >
        <input
          type="text"
          name="fullName"
          onChange={handleChange}
          placeholder="Full Name"
          className="block w-full p-4 pl-10 text-sm bg-gray-100 text-gray-900 mb-8"
        />
        <input
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Email"
          className="block w-full p-4 pl-10 text-sm bg-gray-100 text-gray-900 mb-8"
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Password"
          className="block w-full p-4 pl-10 text-sm bg-gray-100 text-gray-900 mb-8"
        />
        <button
          type="submit"
          className="bg-[#3498db] text-white font-bold py-2 px-4 rounded"
        >
          Sign Up
        </button>
      </form>
      <p className='text-white mt-8 text-lg'>Already have an account? <Link to="/">Login</Link></p>
      <div className='loading-dots'>
        <span className='dot' />
        <span className='dot' />
        <span className='dot' />
      </div>
    </div>
  );
};

export default SignUp;