import React from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { X } from 'lucide-react';

// --- Button ---
interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', className = '', isLoading, disabled, ...props 
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white shadow-md shadow-primary-500/20 focus:ring-primary-500",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 focus:ring-red-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 focus:ring-gray-300",
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </motion.button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', style, ...props }) => (
  <div className="flex flex-col gap-1 w-full text-left">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input 
      className={`w-full px-3 py-2 bg-white text-gray-900 rounded-lg border focus:ring-2 focus:outline-none transition-colors placeholder:text-gray-400 ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'} ${className}`}
      style={{ color: '#111827', backgroundColor: '#ffffff', ...style }}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
}
  
export const Select: React.FC<SelectProps> = ({ label, error, children, className = '', style, ...props }) => (
    <div className="flex flex-col gap-1 w-full text-left">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select 
        className={`w-full px-3 py-2 bg-white text-gray-900 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'} ${className}`}
        style={{ color: '#111827', backgroundColor: '#ffffff', ...style }}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
);

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className = '', title }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}
  >
    {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
    {children}
  </motion.div>
);

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {children}
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);