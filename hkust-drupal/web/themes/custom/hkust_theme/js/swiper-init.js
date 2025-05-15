/**
 * Swiper initialization for HKUST hero banner with improved slide handling
 */

console.log('Swiper script loaded');

(function ($, Drupal, once) {
  'use strict';

  /**
   * Initialize the hero banner Swiper
   */
  Drupal.behaviors.heroSwiper = {
    attach: function (context, settings) {
      // Use Drupal's once function to ensure initialization happens only once
      once('hero-swiper', '.hero-swiper', context).forEach(function (element) {
        // Check if Swiper is available
        if (typeof Swiper === 'undefined') {
          console.error('Swiper library not loaded');
          return;
        }

        // Ensure swiper-wrapper is the direct parent of swiper-slide
        const slides = element.querySelectorAll('.swiper-slide');
        const wrapper = element.querySelector('.swiper-wrapper');

        // Safety check to ensure elements exist
        if (!slides.length || !wrapper) {
          console.error('Required Swiper structure not found');
          return;
        }

        console.log('Initializing Swiper for hero banner...');
        console.log('Number of slides found:', slides.length);

        // Only enable loop mode if we have enough slides (3 or more)
        const useLoop = slides.length >= 3;

        if (!useLoop) {
          console.log('Loop mode disabled due to insufficient slides (need at least 3)');
        }

        // Force proper slide structure before initialization
        slides.forEach(function (slide) {
          // Only move slides that aren't directly under swiper-wrapper
          if (slide.parentElement !== wrapper) {
            wrapper.appendChild(slide);
          }

          // Force proper styling to ensure single image display
          slide.style.width = '100%';
          slide.style.display = 'block';

          // Find images within slide and ensure proper sizing
          const images = slide.querySelectorAll('img');
          images.forEach(function (img) {
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
          });
        });

        // Initialize Swiper with proper settings
        const heroSwiper = new Swiper(element, {
          init: false, // Manual initialization to ensure all DOM manipulations are complete
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 0,
          loop: useLoop,
          autoplay: slides.length > 1
            ? {
                delay: 5000,
                disableOnInteraction: false,
              }
            : false,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          effect: 'fade',
          fadeEffect: {
            crossFade: true,
          },
          speed: 800,
          grabCursor: slides.length > 1,
          watchOverflow: true,
          observer: true,
          observeParents: true,
          observeSlideChildren: true,
          on: {
            init: function () {
              console.log('Swiper initialized successfully with', slides.length, 'slides');
            },
            slideChange: function () {
              // console.log('Slide changed to index', this.activeIndex);
            },
          },
        });

        // Hide navigation elements if only one slide
        if (slides.length <= 1) {
          const navigation = element.querySelectorAll('.swiper-button-next, .swiper-button-prev, .swiper-pagination');
          navigation.forEach(function (nav) {
            nav.style.display = 'none';
          });
        }

        // Initialize swiper after all manipulations
        heroSwiper.init();

        console.log('Hero Swiper fully initialized');
      });
    },
  };
})(jQuery, Drupal, once);
