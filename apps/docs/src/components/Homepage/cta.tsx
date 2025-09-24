import Link from '@docusaurus/Link';
import { Button } from '../UI/button';
import { ShineBorder } from '../UI/shine-border';
// import { SectionTitleCapsule } from './section-title';

export function CTASection() {
  return (
    <section className="w-full pt-20 pb-10 md:pb-20 px-5 relative flex flex-col justify-center items-center overflow-visible">
      {/* Gradient Card (theme-driven) */}
      <div
        className="
          relative w-full max-w-5xl px-6 md:px-10 py-10 md:py-14
          overflow-hidden rounded-3xl
          bg-[linear-gradient(to_bottom_right,_color-mix(in_oklab,var(--background),_transparent),_color-mix(in_oklab,var(--background),_transparent))]
          shadow-[0_8px_30px_rgba(0,0,0,0.12),inset_0_0_0_1px_rgba(255,255,255,0.03)]
          isolation-isolate
          before:content-[''] before:absolute before:-inset-[40%] before:pointer-events-none before:blur-[80px]
          before:mix-blend-screen before:opacity-60
          before:bg-[radial-gradient(800px_400px_at_25%_20%,_color-mix(in_oklab,var(--primary),_transparent),_transparent_60%),radial-gradient(600px_300px_at_75%_30%,_color-mix(in_oklab,var(--secondary),_transparent),_transparent_60%),radial-gradient(420px_220px_at_50%_85%,_color-mix(in_oklab,var(--muted),_transparent),_transparent_65%)]
          after:content-[''] after:absolute after:-inset-[40%] after:pointer-events-none after:blur-[100px]
          after:mix-blend-screen after:opacity-30
          after:bg-[conic-gradient(from_180deg_at_50%_50%,_color-mix(in_oklab,var(--primary),_transparent),_color-mix(in_oklab,var(--secondary),_transparent),_color-mix(in_oklab,var(--muted),_transparent),_color-mix(in_oklab,var(--primary),_transparent))]
        "
      >
        {/* Inner veil for contrast */}
        <div
          className="
            pointer-events-none absolute inset-0 rounded-3xl
            bg-[radial-gradient(1200px_600px_at_50%_35%,_transparent_30%,_rgba(0,0,0,0.08)_85%),linear-gradient(to_bottom,_rgba(0,0,0,0.05),_rgba(0,0,0,0.08))]
            dark:bg-[radial-gradient(1200px_600px_at_50%_35%,_transparent_30%,_rgba(0,0,0,0.20)_85%),linear-gradient(to_bottom,_rgba(0,0,0,0.12),_rgba(0,0,0,0.24))]
            opacity-55
          "
        />
        <ShineBorder shineColor="var(--primary)" className="rounded-3xl" borderWidth={1} duration={8} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-start items-center gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col justify-start items-center gap-6 text-center">
            <h1 className="font-semibold tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-[1.08] text-foreground text-center">Ready to <span className="text-primary">Ignite</span> your next project?</h1>
            <p className="text-foreground text-lg md:text-xl font-medium leading-relaxed max-w-3xl">
              Join thousands of developers who are building faster, shipping sooner, and creating better user experiences with Ignix UI.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link to="/docs/components/accordion">
              <Button
                className="
                  px-8 py-3 rounded-full text-lg font-semibold text-white
                  bg-[linear-gradient(90deg,_var(--primary)_0%,_color-mix(in_oklab,_var(--primary)_55%,_transparent)_100%)]
                  shadow-[0_0_0_1px_color-mix(in_oklab,_var(--primary-foreground)_15%,_transparent),0_8px_24px_color-mix(in_oklab,_var(--primary)_30%,_transparent)]
                  hover:shadow-[0_0_0_1px_color-mix(in_oklab,_var(--primary-foreground)_25%,_transparent),0_12px_36px_color-mix(in_oklab,_var(--primary)_42%,_transparent)]
                  transition-all duration-300 ease-out
                  hover:scale-[1.03] active:scale-95
                  relative overflow-hidden
                  before:absolute before:inset-0
                  before:bg-[linear-gradient(90deg,_transparent,_rgba(255,255,255,0.16),_transparent)]
                  before:translate-x-[-120%] hover:before:translate-x-[120%] before:transition-transform before:duration-700
                "
                size="lg"
              >
                Start building
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
