'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Palette, Heart, Code, Rocket } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/Button';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <motion.div
              className="p-4 rounded-2xl bg-gradient-blue shadow-2xl"
              animate={{
                boxShadow: [
                  '0 20px 40px rgba(59, 130, 246, 0.3)',
                  '0 20px 60px rgba(37, 99, 235, 0.5)',
                  '0 20px 40px rgba(59, 130, 246, 0.3)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]"
          >
            About MoodCraft AI
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Transforming emotions into art, one wallpaper at a time
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass dark:glass-dark rounded-2xl p-8 mb-8"
        >
          <div className="flex items-start space-x-4">
            <motion.div
              className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Heart className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                MoodCraft AI bridges the gap between human emotions and digital art. 
                We believe that every emotion deserves to be expressed beautifully. 
                Our advanced AI technology analyzes the emotional content of your images 
                and generates stunning wallpapers that capture the essence of your mood.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Technology */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass dark:glass-dark rounded-2xl p-8 mb-8"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Technology
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                MoodCraft AI is powered by cutting-edge machine learning models that:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Analyze facial expressions and image composition to detect emotions
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Generate premium wallpapers using our A+C (Smooth Gradient + Cinematic Effects) engine
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Provide high-quality, unique wallpapers tailored to your emotional state
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {[
            {
              icon: Palette,
              title: 'Beautiful Design',
              description: 'Modern, responsive interface with glassmorphism and smooth animations',
              color: 'from-blue-400 to-cyan-500',
            },
            {
              icon: Code,
              title: 'Open Architecture',
              description: 'Built with Next.js 14, TypeScript, and TailwindCSS for performance and scalability',
              color: 'from-cyan-500 to-blue-600',
            },
            {
              icon: Rocket,
              title: 'Fast & Reliable',
              description: 'Optimized for speed with efficient image processing and API integration',
              color: 'from-blue-500 to-indigo-600',
            },
            {
              icon: Sparkles,
              title: 'AI-Powered',
              description: 'Advanced emotion detection and wallpaper generation using state-of-the-art AI',
              color: 'from-blue-600 to-cyan-600',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass dark:glass-dark rounded-xl p-6 relative overflow-hidden group"
            >
              {/* Animated gradient background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8 + index * 0.1 + 0.1, type: 'spring' }}
                className={`relative w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-3 mb-4 shadow-lg`}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
              </motion.div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center glass dark:glass-dark rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Ready to Create?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start generating beautiful wallpapers that reflect your emotions
          </p>
          <Link href="/upload">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
