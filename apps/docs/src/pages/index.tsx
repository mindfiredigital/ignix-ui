import type { JSX } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import { motion } from 'framer-motion';

import styles from './index.module.css';
import { ArrowRight, Code, Download, Github } from 'lucide-react';
import { Button } from '../components/UI/button';
import { ToastProvider } from '../components/UI/toast';

function HomepageHeader() {
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className={clsx(styles.heroContent)}>
        {' '}
        <section className="relative">
          {/* Background Elements */}
          <div className="inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: [0.6, 0.8, 0.6],
                scale: [2, 1.1, 1],
                y: 0,
                x: [0, -10, 0]
              }}
              transition={{ 
                duration: 4, 
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-500/30 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: [0.5, 0.7, 0.5],
                scale: [1, 1.15, 1],
                y: 0,
                x: [0, 10, 0] 
              }}
              transition={{ 
                duration: 6, 
                ease: "easeInOut",
                delay: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                rotate: 360 
              }}
              transition={{ 
                duration: 60, 
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop"
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-purple-500/30 via-pink-500/30 to-purple-500/30 rounded-full blur-3xl"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full px-4 py-2 mb-8"
              style={{ animation: 'fade-up 0.8s ease-out forwards' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: [0.6, 0.8, 1],
                scale: [1, 1.1, 1],
                y: 0 
              }}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-muted-foreground text-sm">Now in Beta</span>
            </motion.div>

            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: [0.6, 0.8, 1],
                scale: [1, 1, 1],
                y: 0 
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}

            >
              Ignix
              <span 
                className="block bg-gradient-to-r ml-2 from-red-600 to-red-500 bg-clip-text text-transparent"
              >
                UI
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-2xl mb-12 mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: [0.6, 0.8, 1],
                scale: [1, 1, 1],
                y: 0 
              }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            >
              A modern, lightweight library of animated React components.
              <br />
              <span 
                className="text-red-400"
              >
                Beautiful by default
              </span>
              ,
              <span 
                className="text-red-400"
              >
                customizable by design
              </span>
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-up"
              style={{ animationDelay: '0.3s' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: [0.6, 0.8, 1],
                scale: [1, 1, 1],
                y: 0 
              }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            >
              <Link to="/docs/introduction">
                <Button variant="primary" size="xl" className='hover:cursor-pointer bg-red-500 hover:bg-red-600 hover:text-white'>
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link to="https://github.com/mindfiredigital/ignix-ui">
                <Button variant="outline" size="xl" className='hover:cursor-pointer'>
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </Button>
              </Link>
            </motion.div>

            {/* Code Preview */}
            <motion.div
              className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 max-w-2xl mx-auto animate-fade-up"
              style={{ animationDelay: '0.4s' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: [0.6, 0.8, 1],
                scale: [1, 1, 1],
                y: 0
              }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-gray-400 text-sm">Ignix UI Component</span>
                </div>
              </div>

              <div className="text-left font-mono text-sm">
                <div className="text-gray-500">// Use Button Directly</div>
                <div className="mt-2">
                  <span className="text-blue-400">{'<Button'}</span>
                  <span className="text-yellow-400"> variant</span>
                  <span className="text-white">=</span>
                  <span className="text-green-400">{'{primary}'}</span>
                  <span className="text-blue-400">{'>'}</span>
                </div>
                <div className="pl-4 text-gray-300">Button Text</div>
                <div>
                  <span className="text-blue-400">{'</Button>'}</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 mt-12 text-sm animate-fade-up"
              style={{ animationDelay: '0.5s' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: [0.6, 0.8, 1],
                scale: [1, 1, 1],
                y: 1,
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>npm i @mindfiredigital/ignix-ui</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>TypeScript Ready</span>
              </div>
              <div>15kb gzipped</div>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <motion.div className="absolute top-20 left-10 w-4 h-4 bg-red-500 rounded-full animate-bounce-slow opacity-60"
             initial={{ opacity: 0, y: 20 }}
             animate={{ 
               opacity: [0.6, 0.8, 0.6],
               scale: [1, 1.1,2],
               y: 0 ,
               x: [0, 10, 0]
             }}
             transition={{ 
               duration: 8, 
               ease: "easeInOut",
               repeat: Infinity,
               repeatType: "reverse"
             }}
          ></motion.div>
          <motion.div
            className="absolute top-40 right-16 w-6 h-6 bg-orange-500 rounded-full animate-float opacity-60"
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: [0.6, 0.8, 0.6],
              scale: [1, 1.1, 1],
              y: 0,
              x: [0, -10, 0]
            }}
            transition={{ 
              duration: 8, 
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          ></motion.div>
          <motion.div
            className="absolute bottom-32 left-16 w-3 h-3 bg-orange-500 rounded-full animate-bounce-slow opacity-60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0.6, 0.8, 0.6],
              scale: [1, 1.1, 1],
              y: 0 
            }}
            transition={{ 
              duration: 8, 
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          ></motion.div>
          <motion.div
            className="absolute bottom-20 right-20 w-5 h-5 bg-red-500 rounded-full animate-float opacity-60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0.6, 0.8, 0.6],
              scale: [1, 1.1, 1],
              y: 0,
              x: [0, -10, 0]
            }}
            transition={{ 
              duration: 8, 
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          ></motion.div>
        </section>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  // const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="Beautiful, animated UI components for modern web applications"
    >
      <ToastProvider>
        <HomepageHeader />
        <main>
          <HomepageFeatures />
        </main>
      </ToastProvider>
    </Layout>
  );
}