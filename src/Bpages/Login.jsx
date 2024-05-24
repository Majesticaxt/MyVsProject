import React, { useEffect, useState } from 'react';
import { supabase } from '../client';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = ({ setToken }) => {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      console.log(data)
      setToken(data);
  
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        html: `<div>Welcome back, ${formData.email}!</div>`,
      }).then(() => {
        navigate('/homepage');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
      });
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
      <h1 className="font-bold text-2xl text-white mb-4">Welcome to Teslex</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-8 md:p-12 lg:p-16 xl:p-20 flex-col"
      >
        <input
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Email"
          className="block w-full p-4 pl-10 text-sm text-gray-900 mb-8 bg-gray-100"
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Password"
          className="block w-full p-4 pl-10 text-sm text-gray-900 mb-8 bg-gray-100"
        />
        <button
          type="submit"
          className="bg-[#3498db] text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
      <p className="text-white mt-8 text-lg">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
      <div className='loading-dots'>
        <span className='dot' />
        <span className='dot' />
        <span className='dot' />
      </div>
    </div>
  );
};

export default Login;