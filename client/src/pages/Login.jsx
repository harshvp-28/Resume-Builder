import { Lock, Mail, User2Icon } from 'lucide-react'
import React from 'react'
import api from '../configs/api'
import { useDispatch } from 'react-redux'
import { login } from '../app/Features/authSlice'
import toast from 'react-hot-toast'

const Login = () => {
    const dispatch=useDispatch()

    const query=new URLSearchParams(window.location.search)
    const urlState=query.get('state')
    const [state, setState] = React.useState(urlState || "login")
    
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const {data} = await api.post(`/api/users/${state}` , formData)
            dispatch(login(data))
            localStorage.setItem('token',data.token)
            toast.success(data.message)
        } catch(error) {
            toast(error?.response?.data?.message || error.message)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-green-100 via-white to-green-200 px-4">
        <form 
          onSubmit={handleSubmit} 
          className="sm:w-[380px] w-full text-center border border-gray-200 rounded-3xl px-8 py-10 bg-white/90 backdrop-blur-xl shadow-2xl"
        >
            <h1 className="text-gray-900 text-3xl font-semibold">
              {state === "login" ? "Welcome Back" : "Create Account"}
            </h1>

            <p className="text-gray-500 text-sm mt-2 mb-6">
              Please {state} to continue
            </p>

            {state !== "login" && (
                <div className="flex items-center mt-4 w-full bg-gray-50 border border-gray-300 h-12 rounded-xl pl-4 gap-2 focus-within:border-green-500 transition">
                    <User2Icon size={16} className="text-gray-500" />
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Full Name" 
                      className="w-full bg-transparent border-none outline-none text-sm" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    />
                </div>
            )}

            <div className="flex items-center mt-4 w-full bg-gray-50 border border-gray-300 h-12 rounded-xl pl-4 gap-2 focus-within:border-green-500 transition">
                <Mail size={16} className="text-gray-500" />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email Address" 
                  className="w-full bg-transparent border-none outline-none text-sm" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
            </div>

            <div className="flex items-center mt-4 w-full bg-gray-50 border border-gray-300 h-12 rounded-xl pl-4 gap-2 focus-within:border-green-500 transition">
                <Lock size={16} className="text-gray-500" />
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Password" 
                  className="w-full bg-transparent border-none outline-none text-sm" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                />
            </div>

            <div className="mt-4 text-right">
                <button className="text-sm text-green-600 hover:underline" type="reset">
                  Forgot password?
                </button>
            </div>

            <button 
              type="submit" 
              className="mt-6 w-full h-11 rounded-xl text-white font-medium bg-linear-to-r from-green-500 to-emerald-500 hover:scale-[1.02] active:scale-95 transition-transform shadow-lg"
            >
                {state === "login" ? "Login" : "Sign up"}
            </button>

            <p 
              onClick={() => setState(prev => prev === "login" ? "register" : "login")} 
              className="text-gray-500 text-sm mt-5 cursor-pointer"
            >
              {state === "login" ? "Don't have an account?" : "Already have an account?"} 
              <span className="text-green-600 hover:underline ml-1">Click here</span>
            </p>
        </form>
    </div>
  )
}

export default Login
