import { Zap, Paintbrush, Layers, ArrowUpRight } from 'lucide-react';
// import { SectionTitleCapsule } from './section-title';
import Link from '@docusaurus/Link';

export function WhyIgnixSection() {
  return (
    <section
      aria-labelledby="why-ignix-title"
      className='bg-primary/5'
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '4rem',
        paddingBottom: '4rem',
        paddingLeft: '1.25rem',
        paddingRight: '1.25rem',
      }}
    >
      {/* Enhanced Background with mesh gradient */}
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          opacity: 0.7,
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Enhanced Header */}
        <header style={{ textAlign: 'center', maxWidth: '868px', margin: '0 auto 3.5rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--muted-foreground)',
              marginBottom: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              background: 'color-mix(in oklab, var(--primary) 8%, transparent)',
              border: '1px solid color-mix(in oklab, var(--primary) 15%, transparent)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--primary)',
                animation: 'pulse 2s infinite',
              }}
            />
            Why developers love Ignix UI
          </div>

          <h1 className="font-semibold tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-[1.08] text-foreground text-center">Built by <span className="text-primary">developers</span>, for <span className="text-primary">developers</span></h1>

          <p
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.75rem',
              color: 'var(--muted-foreground)',
              maxWidth: '600px',
              margin: '0 auto 0',
            }}
          >
            Every component is crafted with performance, accessibility, and developer experience in
            mind.
          </p>
        </header>

        {/* Enhanced Grid with better spacing and hover effects */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '1.25rem',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem',
          }}
        >
          <FeatureCard
            icon={<Zap style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />}
            title="100+ Components"
            desc="Explore a vast collection of components, from buttons to data tables, designed for modern applications with endless customization options."
            gradient="linear-gradient(135deg, color-mix(in oklab, var(--primary) 8%, transparent), transparent)"
          />

          <FeatureCard
            icon={<Paintbrush style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />}
            title="Custom Theming"
            desc="Our fully themeable components adapt seamlessly to your brand, eliminating design debt and ensuring your UIs scale with your vision."
            gradient="linear-gradient(135deg, color-mix(in oklab, var(--primary) 8%, transparent), transparent)"
          />

          <FeatureCard
            icon={<Layers style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />}
            title="Domain-Specific Kits"
            desc="Launch faster with specialized component kits for industries like healthcare and fintech, providing ready-to-use, domain-specific UI patterns."
            gradient="linear-gradient(135deg, color-mix(in oklab, var(--primary) 8%, transparent), transparent)"
            tag="Soon"
          />
        </div>

        {/* Call to Action */}
        <Link to="/docs/introduction">
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 2rem',
                borderRadius: '9999px',
                background:
                  'linear-gradient(90deg, var(--primary), color-mix(in oklab, var(--primary) 70%, transparent))',
                color: '#fff',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px color-mix(in oklab, var(--primary) 25%, transparent)',
              }}
            >
              Explore Components
              <ArrowUpRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </Link>
      </div>

      <style>{`
                @keyframes float1 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-180deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                @media (prefers-reduced-motion: reduce) {
                    * { animation: none !important; }
                }
            `}</style>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  gradient,
  tag,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  gradient: string;
  tag?: string;
}) {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '1.5rem',
        background: 'color-mix(in oklab, var(--background) 95%, transparent)',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        transition: 'all 0.4s ease',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: gradient,
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '0.625rem',
              backgroundColor: 'var(--primary/0.08)',
              flexShrink: 0,
              marginTop: '0.125rem',
            }}
          >
            {icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <h3
                style={{
              fontSize: '1.25rem',
              fontWeight: '600',
                  color: 'var(--foreground)',
              margin: 0,
              marginRight: '0.5rem',
                }}
              >
                {title}
              </h3>
              {tag && (
                <span 
                  style={{ 
                    fontSize: '0.75rem',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--muted)',
                    color: 'var(--muted-foreground)',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tag}
                </span>
              )}
            </div>
          </div>
        </div>

        <p
          style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: 'var(--muted-foreground)',
            margin: '0 0 1.5rem 0',
            textAlign: 'justify',
            textJustify: 'inter-word',
            hyphens: 'auto',
            wordBreak: 'break-word',
            maxWidth: '100%',
          }}
        >
          {desc}
        </p>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            margin: '-0.5rem 0',
            height: '3px',
            background: 'linear-gradient(90deg, var(--primary), transparent)',
            borderRadius: '0 0 1.5rem 1.5rem',
          }}
        />
      </div>

      {/* Hover glow effect */}
      <div
        style={{
          position: 'absolute',
          inset: '-2px',
          borderRadius: '1.5rem',
          opacity: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(600px 300px at 50% 0%, color-mix(in oklab, var(--primary) 15%, transparent), transparent 60%)',
          filter: 'blur(20px)',
          transition: 'opacity 0.4s ease',
        }}
        className="hover-glow"
      />
    </div>
  );
}
