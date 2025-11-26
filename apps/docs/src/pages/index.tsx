import { type ReactElement } from 'react';
import Layout from '@theme/Layout';
import { ToastProvider } from '../components/UI/toast';
import '../css/custom.css';


import React from 'react';
import { HeroSection } from '../components/Homepage/hero';
import { CTASection } from '../components/Homepage/cta';
import FeaturedComponents from '@site/src/components/Homepage/components-showcase';
import { WhyIgnixSection } from '../components/Homepage/why-ignix';
import Footer from '../components/Homepage/footer';

export default function Home(): ReactElement {
  return (
    <Layout
      title={`Home`}
      description="Beautiful, animated UI components for modern web applications"
    >
      <ToastProvider>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <HeroSection />
          <section className="relative rounded-t-3xl border border-border/60 backdrop-blur overflow-hidden
        bg-[linear-gradient(to_bottom_right,_color-mix(in_oklab,var(--background),_transparent_30%),_color-mix(in_oklab,var(--background),_transparent_10%))]
        after:bg-[radial-gradient(1200px_600px_at_50%_40%,_transparent_35%,_rgba(0,0,0,0.08)_85%)]
        after:opacity-60
        before:content-[''] before:absolute before:-inset-[35%] before:pointer-events-none before:blur-[70px]
        before:opacity-55
        before:bg-[radial-gradient(700px_360px_at_20%_15%,_color-mix(in_oklab,var(--primary),_transparent),_transparent),radial-gradient(700px_360px_at_80%_20%,_color-mix(in_oklab,var(--primary),_transparent),_transparent),radial-gradient(520px_260px_at_50%_110%,_color-mix(in_oklab,var(--primary),_transparent),_transparent)]
      "

          >
            <FeaturedComponents />
            <WhyIgnixSection />
            <CTASection />
            <Footer />
          </section>
        </div>
      </ToastProvider>
    </Layout>
  );
}
