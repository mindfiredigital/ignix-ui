import { useEffect, useState, type JSX } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import { motion } from 'framer-motion';

import styles from './index.module.css';
import { ArrowRight, Code, Download, Github } from 'lucide-react';
import { Button } from '../components/UI/button';
import { ToastProvider } from '../components/UI/toast';
import '../css/custom.css';
import DarkVeil from '../components/UI/darkveil';
import LightVeil from '../components/UI/darkveil/lightveil';
import { Switch } from '../components/UI/switch';

const getTheme = () => {
  return document.documentElement.getAttribute('data-theme') || 'light';
};

function HomepageHeader() {
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className={clsx(styles.heroContent)}>
        {' '}
        <section className="relative">
          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full px-4 py-2 mb-8"
              style={{ animation: 'fade-up 0.8s ease-out forwards' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0.6, 0.8, 1],
                scale: [1, 1.1, 1],
                y: 0,
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
                y: 0,
              }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              <div className="group inline-flex items-center gap-4 hover:gap-5 transition-all duration-300">
                <div
                  className="inline-flex items-center gap-2 
                  backdrop-blur-lg bg-gradient-to-br from-white/20 to-white/5
                  border border-white/30 
                  rounded-2xl px-4 py-3
                  shadow-2xl shadow-black/25
                  group-hover:shadow-3xl group-hover:shadow-black/40
                  transform 
                  transition-all duration-500 ease-out
                  relative overflow-hidden"
                >
                  <img
                    src="img/logo.png"
                    alt="Ignix UI"
                    width={20}
                    height={20}
                    className="relative z-10 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex items-baseline">
                  <span
                    className="
                   transition-all duration-300 tracking-tight"
                  >
                    Ignix
                  </span>
                  <span
                    className="font-black ml-1
                     bg-gradient-to-r from-red-600 via-red-500 to-red-500 
                     bg-clip-text text-transparent
                     group-hover:from-red-500 group-hover:to-red-500
                     transition-all duration-300"
                  >
                    UI
                  </span>
                </div>
              </div>
            </motion.h1>

            <motion.p
              className="text-lg md:text-2xl mb-12 mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0.6, 0.8, 1],
                scale: [1, 1, 1],
                y: 0,
              }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            >
              Your One-Stop Frontend Solution.
              <br />
              <span className="text-red-400">Rich animations, no extra libraries needed.</span>
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-up"
              style={{ animationDelay: '0.3s' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0.6, 0.8, 1],
                scale: [1, 1, 1],
                y: 0,
              }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            >
              <Link to="/docs/introduction">
                <Button
                  size="xl"
                  className="hover:cursor-pointer bg-red-500 hover:bg-red-600 text-white"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link to="https://github.com/mindfiredigital/ignix-ui">
                <Button variant="outline" size="xl" className="hover:cursor-pointer">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </Button>
              </Link>
            </motion.div>

            {/* Code Preview */}
            <motion.div
              className="backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto animate-fade-up"
              style={{ animationDelay: '0.4s' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: [0.6, 0.8, 1],
                scale: [1, 1, 1],
                y: 0,
              }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            >
              <Switch variant='square' animation='bounce' className='scale-200 hover:scale-220' checked />
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
              transition={{ duration: 2, ease: 'easeInOut' }}
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
        </section>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  // Usage in component
  const [theme, setTheme] = useState(() => getTheme());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(getTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);
  // const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="Beautiful, animated UI components for modern web applications"
    >
      <ToastProvider>
        <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
          {/* DarkVeil background */}
          {theme === 'light' ? (
            <div
              className="display-component-display"
              style={{
                position: 'fixed',
                top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
            }}
          >
            <LightVeil speed={0.6} hueShift={50} warpAmount={1.4} />
          </div>
          ) : (
            <div
              className="display-component-display"
              style={{
                position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
            }}
          >
            <DarkVeil speed={0.6} hueShift={234} warpAmount={1.4} />
          </div>
          )}
          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <HomepageHeader />
            <main>
              <HomepageFeatures />
            </main>
          </div>
        </div>
      </ToastProvider>
    </Layout>
  );
}
