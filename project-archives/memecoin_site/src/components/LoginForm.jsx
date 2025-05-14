import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      // Store the credentials for the mining platform
      localStorage.setItem('miner_username', username)
      localStorage.setItem('miner_password', password)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect directly to the mining platform with credentials in URL
      window.location.href = '/subscription-mining?username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password)
    } catch (err) {
      console.error('Login failed:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto bg-gray-800 border border-gray-700 p-8 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">
        <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Mining Access Login
        </span>
      </h2>
      
      {error && (
        <div className="bg-red-900/50 text-red-200 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="username" 
            className="block text-gray-300 mb-2 font-medium"
          >
            Username
          </label>
          <input 
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label 
            htmlFor="password" 
            className="block text-gray-300 mb-2 font-medium"
          >
            Password
          </label>
          <input 
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        
        <button 
          type="submit"
          className="w-full btn-primary flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
              Logging in...
            </>
          ) : (
            'Access Mining Platform'
          )}
        </button>
      </form>
      
      <div className="mt-4 text-center text-sm text-gray-400">
        Need access? Purchase a subscription to receive your login details.
      </div>
    </div>
  )
}