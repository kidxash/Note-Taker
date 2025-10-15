import React from 'react'
import { useState } from 'react'

const Loginpage = () => {



  cosnt 

  const [state, setState] = useState('Sign Up');
  const [name, setName  ] = useState('')
  const [email, setEmail  ] = useState('')
  const [password, setPassword  ] = useState('')

  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 h-96 border border-gray-200">
        <h1 className="text-center text-3xl font-bold mb-6">Sign Up</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Loginpage