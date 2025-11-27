import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Input } from '../components/UI';
import { api } from '../services/api';
import Beams from '../components/Beams';
import { TrendingDown, HelpCircle, CheckCircle, BarChart3, Zap, Target, Clock, DollarSign } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // For demo, signup and login use same simple mock flow
    await api.login(email);
    setLoading(false);
    navigate('/');
  };

  const handleDemo = async () => {
    setLoading(true);
    await api.login('demo@fintrack.com');
    setLoading(false);
    navigate('/');
  };

  const scrollToAuth = () => {
      document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-primary-500 selection:text-white">
      {/* Header */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center fixed top-0 w-full z-50 bg-black/10 backdrop-blur-md border-b border-white/10">
         <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
                <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">FinTrack Pro</h1>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <a href="#problems" className="hover:text-primary-400 transition-colors">Why FinTrack?</a>
            <a href="#how-it-works" className="hover:text-primary-400 transition-colors">How it Works</a>
            <button onClick={scrollToAuth} className="text-white hover:text-primary-400 font-bold transition-colors">Sign In</button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
             {/* 3D Background */}
            <div className="absolute inset-0 z-0 opacity-80">
                <Beams lightColor="#1E88E5" beamWidth={3} speed={1.5} noiseIntensity={1.2} />
            </div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
                <div className="md:w-1/2 md:pr-10 text-center md:text-left">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-primary-300 text-xs font-bold rounded-full mb-6 tracking-wide shadow-lg">
                            PERSONAL FINANCE REIMAGINED
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
                            Stop wondering where your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">money went.</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0 drop-shadow-md">
                            Take control of your financial future with a tracker that is as simple as it is powerful. Secure, fast, and designed for clarity.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Button 
                                onClick={scrollToAuth} 
                                className="py-4 px-8 text-lg font-bold bg-white text-black hover:bg-gray-100 border-none shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
                            >
                                Start Tracking Free
                            </Button>
                            <Button 
                                variant="secondary" 
                                onClick={handleDemo} 
                                className="py-4 px-8 text-lg bg-transparent border border-white/30 text-white hover:bg-white/10 hover:text-white"
                            >
                                Try Demo
                            </Button>
                        </div>

                        <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-6 text-gray-400 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-primary-400" /> No credit card required
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-primary-400" /> Free forever for individuals
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Auth Card */}
                <div className="md:w-1/2 w-full max-w-md">
                    <motion.div 
                        id="auth-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
                    >
                        {/* Glow effect inside card */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                        <div className="mb-8 text-center relative z-10">
                            <h3 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Join Us'}</h3>
                            <p className="text-gray-400 text-sm">Join thousands of users mastering their finances.</p>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-5 relative z-10">
                            {!isLogin && (
                                <Input 
                                    placeholder="Full Name" 
                                    required 
                                    className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500/50" 
                                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                                />
                            )}
                            <Input 
                                placeholder="Email Address" 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500/50"
                                style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                            />
                            <Input 
                                placeholder="Password" 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500/50"
                                style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                            />
                            
                            <Button 
                                type="submit" 
                                className="w-full py-4 text-base font-bold bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 border-none shadow-lg shadow-primary-500/25" 
                                isLoading={loading}
                            >
                                {isLogin ? 'Log In to Dashboard' : 'Create Free Account'}
                            </Button>
                        </form>

                        <div className="mt-8 text-center relative z-10">
                            <button 
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-sm text-gray-400 hover:text-white font-medium transition-colors"
                            >
                                {isLogin ? "New here? Create an account" : "Already have an account? Log in"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* The Problem Section */}
        <section id="problems" className="py-24 bg-zinc-950 relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">The problem with money management</h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">Most people don't track their expenses because it's tedious, complicated, or scary. We changed that.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10', title: 'Financial Leakage', text: 'Small daily expenses like coffee, subscriptions, and fees add up to thousands per year without you noticing.' },
                        { icon: HelpCircle, color: 'text-orange-400', bg: 'bg-orange-500/10', title: 'Decision Paralysis', text: '"Can I afford this vacation?" Without clear data, every financial decision feels like a gamble.' },
                        { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', title: 'Time Consuming', text: 'Spreadsheets are powerful but painful to maintain. Bank apps are cluttered. You need something fast.' }
                    ].map((item, idx) => (
                        <motion.div 
                            key={idx}
                            whileHover={{ y: -10 }}
                            className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 hover:border-white/20 hover:bg-zinc-900 transition-all shadow-xl"
                        >
                            <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                                <item.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{item.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* How it works / Solutions */}
        <section id="how-it-works" className="py-24 bg-black text-white relative overflow-hidden">
             {/* Gradient glow */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Your Path to Financial Freedom</h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">We provide the tools to turn chaos into clarity in three simple steps.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    <div className="bg-zinc-900/80 p-10 rounded-3xl border border-white/10 hover:border-primary-500/30 transition-colors group">
                        <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-8 text-primary-400 group-hover:scale-110 transition-transform">
                            <Zap size={36} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">1. Instant Capture</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Log transactions in seconds. Our smart category prediction and simple interface mean you'll actually stick to the habit.
                        </p>
                    </div>

                    <div className="bg-zinc-900/80 p-10 rounded-3xl border border-white/10 hover:border-primary-500/30 transition-colors group">
                        <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-8 text-teal-400 group-hover:scale-110 transition-transform">
                            <BarChart3 size={36} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">2. Visual Insights</h3>
                        <p className="text-gray-400 leading-relaxed">
                            See exactly where your money goes with beautiful, auto-generated charts. Spot trends and cut waste effortlessly.
                        </p>
                    </div>

                    <div className="bg-zinc-900/80 p-10 rounded-3xl border border-white/10 hover:border-primary-500/30 transition-colors group">
                        <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-8 text-green-400 group-hover:scale-110 transition-transform">
                            <Target size={36} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">3. Reach Goals</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Set budgets and watch your savings grow. By understanding your habits, you can make changes that compound into wealth.
                        </p>
                    </div>
                </div>

                 <div className="mt-20 text-center">
                    <Button onClick={scrollToAuth} className="py-5 px-12 text-lg font-bold shadow-2xl shadow-primary-500/20">
                        Get Started Now - It's Free
                    </Button>
                 </div>
            </div>
        </section>

        <footer className="bg-zinc-950 py-12 border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                        <span className="text-white font-bold">F</span>
                    </div>
                    <span className="text-xl font-bold text-white">FinTrack Pro</span>
                </div>
                <div className="flex gap-8 text-gray-500 text-sm font-medium">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Contact Support</a>
                </div>
                <p className="text-gray-600 text-sm">© 2025 FinTrack Pro. All rights reserved.</p>
            </div>
        </footer>
      </main>
    </div>
  );
};