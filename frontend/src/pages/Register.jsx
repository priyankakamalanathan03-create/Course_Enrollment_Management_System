import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, BookOpen, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const selectedRole = formData.role?.toLowerCase() || 'student';
      await register(formData.name, formData.email, formData.password, selectedRole);
      toast.success('Account created successfully! Welcome to CEMS Elite.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel auth-box"
      >
        <div className="auth-header">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="auth-logo-icon"
          >
            <UserPlus size={48} color="#3b82f6" />
          </motion.div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the elite learning platform</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                name="name"
                id="name"
                className="input-field with-icon"
                value={formData.name} 
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
                placeholder="John Doe"
                required 
                autoComplete="name"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                name="email"
                id="email"
                className="input-field with-icon"
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                placeholder="you@example.com"
                required 
                autoComplete="email"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                name="password"
                id="password"
                className="input-field with-icon"
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                placeholder="••••••••"
                required 
                autoComplete="new-password"
              />
            </div>
            {formData.password.length > 0 && formData.password.length < 6 && (
              <span style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem'}}>Password must be at least 6 characters</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="role">I am a:</label>
            <select 
              id="role"
              name="role"
              className="input-field"
              style={{ width: '100%', cursor: 'pointer' }}
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary auth-submit"
            disabled={isLoading}
          >
            {isLoading ? (
               <span className="flex-center">Creating Account...</span>
            ) : (
               <span className="flex-center">
                 <UserPlus size={20} className="mr-2" /> Sign Up
               </span>
            )}
          </motion.button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/" className="auth-link">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;