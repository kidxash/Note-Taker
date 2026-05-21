import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { written } from '../API/API'


const Loginpage = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = written();

  const [state, setState] = useState('Login');
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)

  const onSubmithandler = async (e) => {
    try {
      e.preventDefault();
      setError('');
      axios.defaults.withCredentials = true;
      if (state === 'Sign Up') {
        const response = await axios.post('http://localhost:3001/api/register', { name, email, password });
        if (response.data.success) {
          setRegistered(true);
        } else {
          setError(response.data.message || 'Registration failed. Please try again.');
        }
      } else {
        const response = await axios.post('http://localhost:3001/api/login', { email, password });
        if (response.data.success) {
          setIsLoggedIn(true);
          setUser(response.data.data);
          navigate('/');
        } else {
          setError(response.data.message || 'Login failed. Please check your credentials.');
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
    

  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 min-h-96 border border-gray-200">

        {registered ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="text-green-500 text-6xl">&#10003;</div>
            <h2 className="text-2xl font-bold text-gray-800">Account Created!</h2>
            <p className="text-gray-500 text-sm text-center">Your account has been successfully created. You can now log in.</p>
            <button
              onClick={() => { setRegistered(false); setState('Login'); }}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors mt-4"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <form className="space-y-4" onSubmit={onSubmithandler}>
              <h1 className="text-center text-3xl font-bold mb-6">{state === 'Sign Up' ? 'Create Account' : 'Login'}</h1>

              {state === 'Sign Up' && (
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors"
              >
                {state === 'Sign Up' ? 'Create Account' : 'Login'}
              </button>
              {error && (
                <p className="text-red-500 text-sm text-center mt-2">{error}</p>
              )}
            </form>
            {state === 'Sign Up' ? (
              <p className="text-gray-400 text-center text-xs mt-4">Already have an Account{' '}
                <span onClick={() => setState('Login')} className="text-blue-400 cursor-pointer underline">Login here</span>
              </p>
            ) : (
              <p className="text-gray-400 text-center text-xs mt-4">Don't have an Account?{' '}
                <span onClick={() => setState('Sign Up')} className="text-blue-400 cursor-pointer underline">Sign up</span>
              </p>
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default Loginpage