import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import API from "../api";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const res = await API.post('/auth/login', formData);
    const { token, user } = res.data;
    
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
  } catch (err) {
    setError(err.response?.data?.message || 'Invalid email or password');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen  bg-[#10d7d7] flex items-center justify-center px-4 py-10 ">
      <div className="w-full max-w-md ">
        
        <div className="relative bg-[#1f2a56] rounded-md shadow-2xl overflow-visible">

          <div className="absolute z-10 left-1/2 -translate-x-1/2 -top-4">
            <div className="bg-[#11e6df] px-15 py-3 shadow-lg ">
              <h1 className="text-[#1f2a56] text-2xl font-bold tracking-wide">
                SIGN IN
              </h1>
            </div>
          </div>

          <div className="lg:h-30 h-40 bg-[#31406f] relative overflow-hidden">
            <div className="absolute top-10 left-0 w-full h-20 bg-[#44527f] rounded-[100%] opacity-60"></div>
            <div className="absolute top-16 left-0 w-full h-20 bg-[#3a476f] rounded-[100%] opacity-70"></div>
          </div>

          <div className="px-10 pb-10 pt-4 relative z-10">

            <div className="flex justify-center  -mt-20  mb-8">
              <div className="w-28 h-28 rounded-full border-4 border-gray-400 bg-[#4b567d] flex items-center justify-center">
                <User size={50} className="text-gray-300" />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400 text-red-200 text-sm p-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="bg-[#5b6486] rounded-lg flex items-center px-4 py-3">
                <User className="text-gray-300 mr-3" size={20} />

                <input
                  type="email"
                  name="email"
                  placeholder="username"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-transparent w-full outline-none text-white placeholder-gray-300"
                />
              </div>

              <div className="bg-[#5b6486] rounded-lg flex items-center px-4 py-3">
                <Lock className="text-gray-300 mr-3" size={20} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-transparent w-full outline-none text-white placeholder-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-300 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm text-[#11e6df]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#11e6df]"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="hover:underline"
                >
                  Forgot your password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#11e6df] hover:bg-cyan-300 text-[#1f2a56] font-bold py-3 rounded-xl transition duration-300 shadow-lg"
              >
                {loading ? "Signing in..." : "LOGIN"}
              </button>
            </form>

            <div className="text-center mt-6 text-gray-300 text-sm">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-[#11e6df] hover:underline"
              >
                Register
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;