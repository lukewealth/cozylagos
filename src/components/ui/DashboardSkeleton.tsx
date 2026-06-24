import React from 'react';
import { motion } from 'motion/react';

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-parchment p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          className="h-8 bg-charcoal/10 rounded-lg w-64"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="h-32 bg-charcoal/10 rounded-xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            className="lg:col-span-2 h-96 bg-charcoal/10 rounded-xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          />
          <motion.div
            className="h-96 bg-charcoal/10 rounded-xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </div>

        <motion.div
          className="h-64 bg-charcoal/10 rounded-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
        />
      </div>
    </div>
  );
}
