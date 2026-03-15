import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-8xl font-black text-primary mb-4">404</h1>
      <p className="text-gray-400 text-xl mb-6">This page doesn't exist.</p>
      <Link
        to="/"
        className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-colors"
      >
        Go Home
      </Link>
    </motion.div>
  );
}
