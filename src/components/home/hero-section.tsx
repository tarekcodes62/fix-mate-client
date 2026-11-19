'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slides = [
  {
    title: 'Broken Device?',
    highlight: 'We’ll Fix It.',
    description:
      'Find trusted technicians for your device repair. Get quality service without the hassle.',
    image:
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=2000&q=85',
    badge: 'Reliable Repair Services',
  },
  {
    title: 'Laptop Problems?',
    highlight: 'Expert Care Awaits.',
    description:
      'From slow computers to hardware issues, get your laptop back to peak performance.',
    image:
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=2000&q=85',
    badge: 'Professional Technicians',
  },
  {
    title: 'Home Appliance Issues?',
    highlight: 'We’ve Got You.',
    description:
      'Get your essential home appliances repaired by skilled professionals you can trust.',
    image:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=2000&q=85',
    badge: 'Convenient Home Repairs',
  },
];

const HeroSection = () => {
  return (
    <section className="px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: '.hero-prev',
            nextEl: '.hero-next',
          }}
          pagination={{
            clickable: true,
          }}
          loop
          speed={800}
          className="fixmate-hero-slider group relative overflow-hidden rounded-2xl sm:rounded-3xl"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative flex min-h-107.5 items-center bg-cover bg-center sm:min-h-125 lg:min-h-145"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />

                {/* Content */}
                <div className="relative z-10 max-w-3xl px-6 py-16 text-white sm:px-10 md:px-14 lg:px-20">
                  <span className="mb-5 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-sm sm:text-sm">
                    {slide.badge}
                  </span>

                  <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                    {slide.title}
                    <span className="mt-1 block text-blue-400">
                      {slide.highlight}
                    </span>
                  </h1>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
                    {slide.description}
                  </p>

                  <Link
                    href="/services"
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 sm:px-7 sm:py-3.5"
                  >
                    Explore Services
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Slider Navigation */}
          <button
            type="button"
            className="hero-prev absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-blue-600 sm:left-5 sm:h-12 sm:w-12"
            aria-label="Previous slide"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            type="button"
            className="hero-next absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-blue-600 sm:right-5 sm:h-12 sm:w-12"
            aria-label="Next slide"
          >
            <ArrowRight size={20} />
          </button>
        </Swiper>
      </div>
    </section>
  );
};

export default HeroSection;
