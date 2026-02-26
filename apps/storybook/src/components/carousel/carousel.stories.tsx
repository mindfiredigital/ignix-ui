
import type { Meta, StoryObj } from "@storybook/react";
import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  CarouselThumbnails,
  CarouselContent,
} from ".";
import { 
  TestimonialCard,
  TestimonialCardAuthor, 
  TestimonialCardQuote, 
  TestimonialCardRating,
  TestimonialCardSocialLinks 
} from "../../templates/patterns/testimonial-card"
import { ButtonWithIcon } from "../button-with-icon";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

/* -------------------------------------------------------------------------- */
/*                                   STORY                                    */
/* -------------------------------------------------------------------------- */

// Basic carousel with arrows
export const Basic: Story = {
  render: () => (
    <Carousel loop={false}>
      <CarouselContent>
        <CarouselItem>
          <div className="flex h-64 items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-4xl">
            Slide One
          </div>
        </CarouselItem>

        <CarouselItem>
          <div className="flex h-64 items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-4xl">
            Slide Two
          </div>
        </CarouselItem>

        <CarouselItem>
          <div className="flex h-64 items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white text-4xl">
            Slide Three
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
};

// Carousel with dots indicator
export const WithDots: Story = {
  render: () => (
    <Carousel loop={false}>
      <CarouselContent>
        <CarouselItem>
          <div className="flex h-64 items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-4xl">
            Slide One
          </div>
        </CarouselItem>

        <CarouselItem>
          <div className="flex h-64 items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-4xl">
            Slide Two
          </div>
        </CarouselItem>

        <CarouselItem>
          <div className="flex h-64 items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white text-4xl">
            Slide Three
          </div>
        </CarouselItem>
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  ),
};

// Auto-play carousel
export const AutoPlay: Story = {
  render: () => (
    <Carousel autoPlay={true} interval={1500} animation="fade">
      <CarouselContent>
        <CarouselItem>
          <div className="flex h-64 items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-4xl">
            Slide One
          </div>
        </CarouselItem>

        <CarouselItem>
          <div className="flex h-64 items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-4xl">
            Slide Two
          </div>
        </CarouselItem>

        <CarouselItem>
          <div className="flex h-64 items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white text-4xl">
            Slide Three
          </div>
        </CarouselItem>
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  )
};

// Non-looping carousel (stops at ends)
export const NoLoop: Story = {
  render: () => (
    <Carousel loop={false} autoPlay>
      <CarouselContent>
        {[1, 2, 3, 4].map((n) => (
          <CarouselItem key={n}>
            <div className="flex h-64 items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white text-4xl rounded-lg">
              Slide {n}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  ),
};

// Carousel with thumbnails
export const WithThumbnails: Story = {
  render: () => {
    const thumbnails = [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&h=1200&fit=crop",
    ];

    return (
      <Carousel autoPlay>
        <CarouselContent>
          {thumbnails.map((thumbnail, index) => (
            <CarouselItem key={index}>
              <div className="flex h-128 items-center justify-center overflow-hidden rounded-lg">
                <img
                  src={thumbnail.replace("w=200&h=200", "w=800&h=400")}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselThumbnails thumbnails={thumbnails} position="bottom" variant="minimal"/>
      </Carousel>
    );
  },
};

// Carousel with dots at start (left)
export const DotsAtStart: Story = {
  render: () => (
    <div className="h-[400px]">
      <Carousel className="h-full" loop={false}>
        <CarouselContent>
          {[1, 2, 3, 4].map((n) => (
            <CarouselItem key={n}>
              <div className="flex h-full items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-4xl rounded-lg">
                Slide {n}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots position="left" variant="dots"/>
      </Carousel>
    </div>
  ),
};

// Animation Examples
export const FadeAnimation: Story = {
  render: () => (
    <Carousel autoPlay loop={false} animation="fade">
      <CarouselContent>
        {[1, 2, 3, 4].map((n) => (
          <CarouselItem key={n}>
            <div className="flex h-64 items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white text-4xl rounded-lg">
              Slide {n}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  ),
};

export const SlideUpAnimation: Story = {
  render: () => (
    <Carousel animation="slideUp" transitionDuration={500}>
      <CarouselContent>
        {[1, 2, 3, 4].map((n) => (
          <CarouselItem key={n}>
            <div className="flex h-64 items-center justify-center bg-gradient-to-r from-pink-500 to-rose-600 text-white text-4xl rounded-lg">
              Slide Up {n}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  ),
};

// Split carousel - shows 3 items at once
export const SplitCarousel: Story = {
  render: () => (
    <Carousel animation="scale">
      <CarouselContent split>
        {[1, 2, 3, 4, 5].map((n) => (
          <CarouselItem key={n}>
            <div className="flex h-full items-center justify-around mx-2">
              <TestimonialCard
                size="md"
                variant="default"
                animation="none"
                avatarPosition="top"
              >
                <TestimonialCardAuthor
                name={`Michael Chen`+n}
                title="CEO"
                company="InnovateLabs"
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                avatarAlt="Ryan P."
                />

                <TestimonialCardSocialLinks>
                  <ButtonWithIcon variant="ghost" size="lg" icon={<FaFacebook />} />
                  <ButtonWithIcon variant="ghost" size="lg" icon={<FaInstagram />} />
                  <ButtonWithIcon variant="ghost" size="lg" icon={<FaLinkedin />} />
                </TestimonialCardSocialLinks>

                <TestimonialCardRating value={5} />

                <TestimonialCardQuote>
                  This product has completely transformed how we work. The ease of use and powerful features make it indispensable for our team.
                </TestimonialCardQuote>

              </TestimonialCard>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

