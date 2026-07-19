import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { api } from '../api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await api.register("", email, password);
      // Automatically navigate to login or try logging them in
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center text-primary mb-6">
          <div className="h-12 w-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shadow-lg">
            <Code2 className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-text-primary">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Start your 14-day free trial, no credit card required.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10"
      >
        <Card className="border-border shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Sign up</CardTitle>
            <CardDescription>Enter your details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="py-2">
                  <span className="text-sm font-medium">{error}</span>
                </Alert>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-text-muted" />
                  </div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text-muted" />
                  </div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                    placeholder="Create a strong password"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-6" size="lg" isLoading={isLoading}>
                Create account
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent hover:text-accent-hover transition-colors">
            Sign in instead
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
