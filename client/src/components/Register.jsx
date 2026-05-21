import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, CalendarDays, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import API from '../api';

const Register = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', dob: '', email: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const checkPasswordStrength = (password) => {
    const checks = {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const passedChecks = Object.values(checks).filter(Boolean).length;
    
    let score = 0;
    let message = '';
    
    if (password.length === 0) {
      message = '';
    } else if (passedChecks <= 2) {
      score = 1;
      message = 'Weak password';
    } else if (passedChecks <= 3) {
      score = 2;
      message = 'Fair password';
    } else if (passedChecks <= 4) {
      score = 3;
      message = 'Good password';
    } else {
      score = 4;
      message = 'Strong password!';
    }
    
    return { score, message, ...checks };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validatePassword = () => {
    const { password, confirmPassword } = formData;
    
    if (passwordStrength.score < 3) {
      setError('Please use a stronger password. Include at least 8 characters, uppercase, lowercase, number, and special character.');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    setLoading(true);
    try {
      const { confirmPassword, ...data } = formData;
      const res = await API.post('/auth/register', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    const colors = {
      0: 'bg-gray-400',
      1: 'bg-red-500',
      2: 'bg-orange-500',
      3: 'bg-yellow-500',
      4: 'bg-green-500'
    };
    return colors[passwordStrength.score] || 'bg-gray-400';
  };

  const getStrengthWidth = () => {
    return `${(passwordStrength.score / 4) * 100}%`;
  };

  return (
    <div className="min-h-screen bg-[#10d7d7] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md ">
        <div className="relative bg-[#1f2a56] rounded-md shadow-2xl overflow-visible">

          <div className="absolute z-10 left-1/2 -translate-x-1/2 -top-5">
            <div className="bg-[#11e6df] px-15 py-3 shadow-lg">
              <h1 className="text-[#1f2a56] text-2xl font-bold tracking-wide">
                CREATE ACCOUNT
              </h1>
            </div>
          </div>

          <div className="h-40 bg-[#31406f] relative overflow-hidden">
            <div className="absolute top-10 left-0 w-full h-20 bg-[#44527f] rounded-[100%] opacity-60"></div>
            <div className="absolute top-16 left-0 w-full h-20 bg-[#3a476f] rounded-[100%] opacity-70"></div>
          </div>

          <div className="px-10 pb-10 pt-4 relative z-10">
            <div className="flex justify-center -mt-20 mb-8">
              <div className="w-28 h-28 rounded-full border-4 border-gray-400 bg-[#4b567d] flex items-center justify-center">
                <User size={50} className="text-gray-300" />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400 text-red-200 text-sm p-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-[#5b6486] rounded-lg flex items-center px-4 py-3">
                <User className="text-gray-300 mr-3" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-transparent w-full outline-none text-white placeholder-gray-300"
                />
              </div>

              <div className="bg-[#5b6486] rounded-lg flex items-center px-4 py-3">
                <CalendarDays className="text-gray-300 mr-3" size={20} />
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="bg-transparent w-full outline-none text-white placeholder-gray-300"
                />
              </div>

              <div className="bg-[#5b6486] rounded-lg flex items-center px-4 py-3">
                <User className="text-gray-300 mr-3" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-transparent w-full outline-none text-white placeholder-gray-300"
                />
              </div>

              <div className="space-y-2">
                <div className="bg-[#5b6486] rounded-lg flex items-center px-4 py-3">
                  <Lock className="text-gray-300 mr-3" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-transparent w-full outline-none text-white placeholder-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-gray-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {formData.password.length > 0 && (
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                        style={{ width: getStrengthWidth() }}
                      ></div>
                    </div>
                    <p className={`text-xs ${
                      passwordStrength.score === 4 ? 'text-green-400' :
                      passwordStrength.score === 3 ? 'text-yellow-400' :
                      passwordStrength.score === 2 ? 'text-orange-400' :
                      'text-red-400'
                    }`}>
                      {passwordStrength.message}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div className={`flex items-center gap-1 ${passwordStrength.hasMinLength ? 'text-green-400' : 'text-gray-400'}`}>
                        {passwordStrength.hasMinLength ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        <span>Min 8 characters</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasUpperCase ? 'text-green-400' : 'text-gray-400'}`}>
                        {passwordStrength.hasUpperCase ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        <span>Uppercase letter</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasLowerCase ? 'text-green-400' : 'text-gray-400'}`}>
                        {passwordStrength.hasLowerCase ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        <span>Lowercase letter</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
                        {passwordStrength.hasNumber ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        <span>Number</span>
                      </div>
                      <div className={`flex items-center gap-1 col-span-2 ${passwordStrength.hasSpecialChar ? 'text-green-400' : 'text-gray-400'}`}>
                        {passwordStrength.hasSpecialChar ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        <span>Special character (!@#$%^&*)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[#5b6486] rounded-lg flex items-center px-4 py-3">
                <Lock className="text-gray-300 mr-3" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="bg-transparent w-full outline-none text-white placeholder-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2 text-gray-300 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <XCircle size={12} />
                  Passwords do not match
                </p>
              )}
              
              {formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword && formData.password.length > 0 && (
                <p className="text-green-400 text-xs flex items-center gap-1">
                  <CheckCircle size={12} />
                  Passwords match
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#11e6df] hover:bg-cyan-300 text-[#1f2a56] font-bold py-3 rounded-xl transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Register'}
              </button>
            </form>

            <div className="text-center mt-6 text-gray-300 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#11e6df] hover:underline"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;