import { useRef } from 'react';
import { Layers, Palette, Home, User, Settings } from 'lucide-react';
import { Card, CardContent } from '../UI/card';
import { Button } from '../UI/button';
import { useToast } from '../UI/toast/use-toast';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import Sidebar from '../UI/sidebar';
import { Slider } from '../UI/slider';
import { Switch } from '../UI/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../UI/accordion';
import Link from '@docusaurus/Link';
import { motion, useInView } from 'framer-motion';

// A small wrapper for the toast demo to use the useToast hook correctly
const ToastDemo = () => {
  const toast = useToast();
  return (
      <Button
          variant="default"
          size="lg"
          onClick={() => toast.addToast({
              message: "Hello from Ignix UI!",
              variant: 'error',
              animation: 'slide',
              icon: <InfoCircledIcon className="w-5 h-5" />
          })}
          className='m-12'
      >
          Show Toast
      </Button>
  )
};


const ComponentShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-20% 0px' });

  const showcaseItems = [
    {
      id: 'responsive-sidebar',
      title: "Responsive Sidebar",
      description: "Elegant and adaptive navigation",
      size: 'large',
      demo: (
        <div className="w-full min-h-[400px] relative overflow-hidden rounded-lg">
        <Sidebar
            links={[
                { label: 'Home', href: '#', icon: Home },
                { label: 'Profile', href: '#', icon: User },
                { label: 'Settings', href: '#', icon: Settings },
            ]}
            brandName="Ignix"
            // variant="glass"
        />
        <div className="absolute top-6 right-6 text-muted-foreground text-sm hidden lg:block">
            Main content area
        </div>
    </div>
      )
    },
    {
      id: 'themed-slider',
      title: "Themed Sliders",
      description: "From minimal to cyberpunk",
      size: 'medium',
      demo: (
        <div className="w-3/4 flex flex-col gap-4">
        <Slider defaultValue={[75]} max={100} variant="default" animationType='breathe' showValue />
        <Slider defaultValue={[50]} max={100} variant="retro" showValue />
      </div>
      )
    },
    {
      id: 'variant-buttons',
      title: "Variant-rich Buttons",
      description: "Buttons for every occasion",
      size: 'medium',
      demo: (
        <div className="flex flex-col gap-4 items-center justify-center h-full">
        <Button variant="outline" size="lg" animationVariant="scaleUp">Get Started</Button>
        <Button variant="default" animationVariant="wobble">Wobble</Button>
    </div>
      )
    },
    {
      id: 'animated-accordion',
      title: "Animated Accordion",
      description: "Customizable reveal animations",
      size: 'large',
      demo: (
        <div className="w-full min-h-[400px] p-4 flex items-center justify-center">
        <Accordion type="single" collapsible className="w-full text-foreground">
            <AccordionItem value="item-1">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent variant="bounce">
                    Yes! With multiple animation variants like bounce, slide, and flip.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Is it customizable?</AccordionTrigger>
                <AccordionContent variant="slideDown">
                    Absolutely. Tailor styles and animations to fit your brand.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent variant="fade">
                    Yes. It follows WAI-ARIA design patterns.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
      )
    },
    {
      id: 'custom-toast',
      title: "Customizable Toasts",
      description: "User feedback, delivered",
      size: 'medium',
      demo: (
        <ToastDemo />
      )
    },
    {
      id: 'stylish-switch',
      title: "Stylish Switches",
      description: "Satisfying toggle animations",
      size: 'medium',
      demo: (
        <div className="flex items-center justify-center gap-6 h-full m-14">
        <Switch variant="ios" animation="bounce" defaultChecked />
        <Switch variant="material" animation="jelly" />
        <Switch variant="slim" animation="rotate" defaultChecked />
   </div>
      )
    }
  ];

  const getBentoSize = (size: string) => {
    switch (size) {
      case 'large':
        return 'md:col-span-2 md:row-span-2';
      case 'wide':
        return 'md:col-span-2';
      case 'tall':
        return 'md:row-span-2';
      default:
        return 'md:col-span-1 md:row-span-1';
    }
  };

  return (
    <motion.section 
      ref={sectionRef} 
      className="px-4 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 20,
        transition: { duration: 0.8, ease: "easeOut" }
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-5">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-6 animate-fade-up">
            <Layers className="h-4 w-4 text-red-400" />
            <span className="text-sm">Interactive Showcase</span>
          </div>
        </div>
        
        {/* Bento Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
        >
          {showcaseItems.map((item, index) => (
            <Card 
            variant='glass'
              key={item.id}
              className={`${getBentoSize(item.size)} border-gray-700 hover:border-red-500/50 transition-all duration-500 group animate-fade-up backdrop-blur-sm relative overflow-hidden min-h-[200px]`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"></div>
              
              <CardContent className="p-6 h-full flex flex-col relative z-10">
                <div className="flex-1 flex items-center justify-center mb-4">
                  {item.demo}
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </CardContent>
              
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </Card>
          ))}
        </motion.div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 border border-gray-700/50 rounded-2xl px-8 py-4 backdrop-blur-sm animate-fade-up" style={{ animationDelay: '0.8s' }}>
            <Palette className="h-5 w-5 text-red-400" />
            <Link to="/docs/installation">
            <span >Get started with 50+ more components with endless customization possibilities</span>
            </Link>
            <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ComponentShowcase;
