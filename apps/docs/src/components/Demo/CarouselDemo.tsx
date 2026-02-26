import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  CarouselThumbnails,
} from '@site/src/components/UI/carousel';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import VariantSelector from './VariantSelector';
import { TestimonialCard, TestimonialCardAuthor, TestimonialCardQuote, TestimonialCardRating, TestimonialCardSocialLinks } from '@site/src/components/UI/testimonial-card';
import { ButtonWithIcon } from '@site/src/components/UI/button-with-icon';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const sizeOptions = ['sm', 'md', 'lg'] as const;
const navigationVariants = ["default", "outline", "ghost"] as const;
const animationOptions = ["none", "fade", "slide", "scale", "slideUp", "slideDown", "slideLeft", "slideRight"] as const;
const dotsVariantOptions = ["dots", "lines"] as const;

type CarouselVariant = typeof navigationVariants[number];
type CarouselAnimation = typeof animationOptions[number];
type CarouselDotsVariant = typeof dotsVariantOptions[number];

// Basic Carousel Demo
export const BasicCarouselDemo = () => {
  const [animation, setAnimation] = useState<CarouselAnimation>('none');
  const [animationKey, setAnimationKey] = useState<number>(0);
  const [variant, setVariant] = useState<'default' | 'outline' | 'ghost'>('default');
  const [dotVariant, setDotVariant] = useState<'lines' | 'dots'>("lines");

  // Reset animation key when animation prop changes to trigger re-animation
  useEffect(() => {
    setAnimationKey((k) => k + 1);
  },[animation]);

  const codeString = `
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@mindfiredigital/ignix-ui';

<Carousel
  animation="${animation}"
>
  <CarouselContent split={false}>
    <CarouselItem>
      <div className="flex h-64 items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white text-4xl rounded-lg">
        1
      </div>
    </CarouselItem>
    <CarouselItem>
      <div className="flex h-64 items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-4xl rounded-lg">
        2
      </div>
    </CarouselItem>
    <CarouselItem>
      <div className="flex h-64 items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-4xl rounded-lg">
        3
      </div>
    </CarouselItem>
  </CarouselContent>
  <CarouselPrevious variant="${variant}" />
  <CarouselNext variant="${variant}" />
  <CarouselDots variant="${dotVariant}" />
</Carousel>`;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 items-center">
        <VariantSelector
          type="Animation"
          variants={[...animationOptions]}
          selectedVariant={animation}
          onSelectVariant={(value) => setAnimation(value as CarouselAnimation)}
        />
        <VariantSelector
          type="Navigation Variant"
          variants={[...navigationVariants]}
          selectedVariant={variant}
          onSelectVariant={(value) => setVariant(value as CarouselVariant)}
        />
        <VariantSelector
          type="Dots Variant"
          variants={[...dotsVariantOptions]}
          selectedVariant={dotVariant}
          onSelectVariant={(value) => setDotVariant(value as CarouselDotsVariant)}
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview" default>
          <div className="p-6 border border-gray-300 rounded-lg mt-2">
            <Carousel
              key={`card-${animationKey}`}
              animation={animation}
            >
              <CarouselContent split={false}>
                <CarouselItem>
                  <div className="flex h-64 items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white text-4xl rounded-lg">
                    1
                  </div>
                  
                </CarouselItem>
                <CarouselItem>
                  <div className="flex h-64 items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-4xl rounded-lg">
                    2
                  </div>
                </CarouselItem>
                <CarouselItem>
                 <div className="flex h-64 items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-4xl rounded-lg">
                    3
                  </div>
                </CarouselItem>
                <CarouselItem>
                 <div className="flex h-64 items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-4xl rounded-lg">
                    4
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious variant={variant}/>
              <CarouselNext variant={variant}/>
              <CarouselDots variant={dotVariant}/>
            </Carousel>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className="text-sm">
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

// Thumbnails Demo
export const ThumbnailsDemo = () => {
  const [position, setPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');
  // const [variant, setVariant] = useState<'default' | 'outline' | 'minimal'>('default');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');

  const thumbnails = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1511497584788-876760111969?w=200&h=200&fit=crop',
  ];

  const codeString = `
const thumbnails = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1511497584788-876760111969?w=200&h=200&fit=crop',
];

<Carousel autoPlay>
  <CarouselContent split={false}>
    {thumbnails.map((thumbnail, index) => (
      <CarouselItem key={index}>
        <div className="flex h-100 items-center justify-center overflow-hidden rounded-lg">
          <img
            src={thumbnail.replace("w=200&h=200", "w=800&h=400")}
            alt={\`Slide \${index + 1}\`}
            className="w-full h-full object-cover"
          />
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
  <CarouselThumbnails 
    thumbnails={thumbnails} 
    position="${position}" 
    size="${size}"
  />
</Carousel>`;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 items-center">
        <VariantSelector
          type="Position"
          variants={['top', 'bottom', 'left', 'right']}
          selectedVariant={position}
          onSelectVariant={(value) => setPosition(value as any)}
        />
        <VariantSelector
          type="Size"
          variants={[...sizeOptions]}
          selectedVariant={size}
          onSelectVariant={(value) => setSize(value as any)}
        />
      </div>
      <Tabs>
        <TabItem value="preview" label="Preview" default>
          <div className="p-6 border border-gray-300 rounded-lg mt-2">
            <Carousel autoPlay>
              <CarouselContent split={false}>
                {thumbnails.map((thumbnail, index) => (
                  <CarouselItem key={index}>
                    <div className="flex h-100 items-center justify-center overflow-hidden rounded-lg">
                      <img
                        src={thumbnail.replace("w=200&h=200", "w=800&h=400")}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselThumbnails 
                thumbnails={thumbnails} 
                position={position} 
                size={size}
              />
            </Carousel>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className="text-sm">
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

// Responsive Carousel Demo
export const ResponsiveCarouselDemo = () => {
  const testimonials = [
    {
      name: "Michael Chen",
      title: "CEO",
      company: "InnovateLabs",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      avatarAlt: "Michael Chen",
      rating: 5,
      quote: "This product has completely transformed how we work. The ease of use and powerful features make it indispensable for our team."
    },
    {
      name: "Sarah Johnson",
      title: "CTO",
      company: "TechFlow Solutions",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
      avatarAlt: "Sarah Johnson",
      rating: 5,
      quote: "Outstanding performance and reliability. Our development team has seen a 40% increase in productivity since implementing this solution."
    },
    {
      name: "David Martinez",
      title: "Product Manager",
      company: "CloudScale Inc",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      avatarAlt: "David Martinez",
      rating: 5,
      quote: "The intuitive interface and comprehensive documentation made onboarding seamless. Highly recommend to any organization."
    },
    {
      name: "Emily Rodriguez",
      title: "Design Director",
      company: "Creative Minds Studio",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      avatarAlt: "Emily Rodriguez",
      rating: 5,
      quote: "Beautiful design and exceptional user experience. It's rare to find a tool that combines functionality with such elegant aesthetics."
    },
    {
      name: "James Wilson",
      title: "Founder",
      company: "StartupHub",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      avatarAlt: "James Wilson",
      rating: 5,
      quote: "As a startup, we needed a solution that scales with us. This platform has exceeded our expectations in every way possible."
    }
  ];

  const codeString = `
const testimonials = [
  {
    name: "Michael Chen",
    title: "CEO",
    company: "InnovateLabs",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    avatarAlt: "Michael Chen",
    rating: 5,
    quote: "This product has completely transformed how we work. The ease of use and powerful features make it indispensable for our team."
  },
  {
    name: "Sarah Johnson",
    title: "CTO",
    company: "TechFlow Solutions",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    avatarAlt: "Sarah Johnson",
    rating: 5,
    quote: "Outstanding performance and reliability. Our development team has seen a 40% increase in productivity since implementing this solution."
  },
  {
    name: "David Martinez",
    title: "Product Manager",
    company: "CloudScale Inc",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    avatarAlt: "David Martinez",
    rating: 5,
    quote: "The intuitive interface and comprehensive documentation made onboarding seamless. Highly recommend to any organization."
  },
  {
    name: "Emily Rodriguez",
    title: "Design Director",
    company: "Creative Minds Studio",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    avatarAlt: "Emily Rodriguez",
    rating: 5,
    quote: "Beautiful design and exceptional user experience. It's rare to find a tool that combines functionality with such elegant aesthetics."
  },
  {
    name: "James Wilson",
    title: "Founder",
    company: "StartupHub",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    avatarAlt: "James Wilson",
    rating: 5,
    quote: "As a startup, we needed a solution that scales with us. This platform has exceeded our expectations in every way possible."
  }
];

<Carousel animation="scale">
  <CarouselContent split>
    {testimonials.map((testimonial, index) => (
      <CarouselItem key={index}>
        <TestimonialCard
          size="sm"
          variant="default"
          animation="slideUp"
          avatarPosition="bottom"
        >
          <TestimonialCardAuthor
            name={testimonial.name}
            title={testimonial.title}
            company={testimonial.company}
            avatar={testimonial.avatar}
            avatarAlt={testimonial.avatarAlt}
          />
          <TestimonialCardSocialLinks>
            <ButtonWithIcon variant="ghost" size="lg" icon={<FaFacebook />} />
            <ButtonWithIcon variant="ghost" size="lg" icon={<FaInstagram />} />
            <ButtonWithIcon variant="ghost" size="lg" icon={<FaLinkedin />} />
          </TestimonialCardSocialLinks>
          <TestimonialCardRating value={testimonial.rating} />
          <TestimonialCardQuote>
            {testimonial.quote}
          </TestimonialCardQuote>
        </TestimonialCard>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious variant="outline" />
  <CarouselNext variant="outline" />
</Carousel>`;

  return (
    <div className="space-y-4 mb-8">
      <Tabs>
        <TabItem value="preview" label="Preview" default>
          <div className="p-6 border border-gray-300 rounded-lg mt-2">
            <div className="relative px-8 sm:px-10 md:px-12 lg:px-14">
              <Carousel animation='scale'>
                <CarouselContent split>
                  {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index}>
                      <div className="flex h-full items-center justify-around mx-2">
                      <TestimonialCard
                        size="sm"
                        variant="default"
                        animation="slideUp"
                        avatarPosition="bottom"
                      >
                        <TestimonialCardAuthor
                          name={testimonial.name}
                          title={testimonial.title}
                          company={testimonial.company}
                          avatar={testimonial.avatar}
                          avatarAlt={testimonial.avatarAlt}
                        />
                        <TestimonialCardSocialLinks>
                          <ButtonWithIcon variant="ghost" size="lg" icon={<FaFacebook />} />
                          <ButtonWithIcon variant="ghost" size="lg" icon={<FaInstagram />} />
                          <ButtonWithIcon variant="ghost" size="lg" icon={<FaLinkedin />} />
                        </TestimonialCardSocialLinks>
                        <TestimonialCardRating value={testimonial.rating} />
                        <TestimonialCardQuote>
                          {testimonial.quote}
                        </TestimonialCardQuote>
                      </TestimonialCard>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious variant="outline" />
                <CarouselNext variant="outline" />
              </Carousel>
            </div>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className="text-sm">
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};
