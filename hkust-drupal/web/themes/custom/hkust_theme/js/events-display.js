/**
 * Events carousel behavior - showing only 3 cards initially
 */
(function ($, Drupal, once) {
  'use strict';

  Drupal.behaviors.eventsSwiper = {
    attach: function (context, settings) {
      once('events-swiper', '.events-swiper', context).forEach(function(element) {
        console.log('Initializing Events Swiper');
        
        // Check if Swiper is available
        if (typeof Swiper === 'undefined') {
          console.error('Swiper library not loaded');
          return;
        }
        
        // Override Swiper's CSS with specific width values
        const customStyles = document.createElement('style');
        customStyles.textContent = `
          .events-swiper .swiper-slide {
            width: calc((100% - 60px) / 3) !important;
            max-width: calc((100% - 60px) / 3) !important;
            flex: 0 0 calc((100% - 60px) / 3) !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
          
          @media (max-width: 991px) {
            .events-swiper .swiper-slide {
              width: calc((100% - 20px) / 2) !important;
              max-width: calc((100% - 20px) / 2) !important;
              flex: 0 0 calc((100% - 20px) / 2) !important;
            }
          }
          
          @media (max-width: 767px) {
            .events-swiper .swiper-slide {
              width: 100% !important;
              max-width: 100% !important;
              flex: 0 0 100% !important;
            }
          }
        `;
        document.head.appendChild(customStyles);
        
        // Initialize Swiper with strict settings for 3 cards
        const eventsSwiper = new Swiper(element, {
          slidesPerView: 3,
          slidesPerGroup: 1,
          spaceBetween: 30,
          loop: false,
          allowTouchMove: true,
          preventInteractionOnTransition: false,
          watchOverflow: true,
          observeParents: true,
          observer: true,
          navigation: {
            nextEl: '.events-nav-next',
            prevEl: '.events-nav-prev',
          },
          // Force 3/2/1 slides per view based on screen size
          breakpoints: {
            992: {
              slidesPerView: 3,
              spaceBetween: 30
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20
            },
            0: {
              slidesPerView: 1,
              spaceBetween: 10
            }
          },
          on: {
            beforeInit: function() {
              console.log('Before init');
              
              // Set initial width for all slides to ensure correct layout
              const slides = element.querySelectorAll('.swiper-slide');
              slides.forEach(function(slide) {
                slide.style.width = 'calc((100% - 60px) / 3)';
              });
            },
            init: function() {
              console.log('Events Swiper initialized');
              const slides = this.slides;
              
              // Show navigation buttons if needed
              const nextButton = document.querySelector('.events-nav-next');
              const prevButton = document.querySelector('.events-nav-prev');
              
              if (nextButton && slides.length > 3) {
                nextButton.style.display = 'flex';
              } else if (nextButton) {
                nextButton.style.display = 'none';
              }
              
              if (prevButton) {
                prevButton.style.display = 'none'; // Initially hidden
              }
              
              // Force container width to ensure proper display
              const swiperContainer = this.el;
              swiperContainer.style.overflow = 'hidden';
              
              // Add special class to slides beyond the 3rd to hide them initially
              for (let i = 3; i < slides.length; i++) {
                slides[i].classList.add('hidden-initially');
              }
            },
            slideChange: function() {
              // Show/hide prev button based on position
              const prevButton = document.querySelector('.events-nav-prev');
              if (prevButton) {
                prevButton.style.display = this.activeIndex > 0 ? 'flex' : 'none';
              }
              
              // Show/hide next button based on position
              const nextButton = document.querySelector('.events-nav-next');
              if (nextButton) {
                const slidesPerView = this.params.slidesPerView;
                const hideNextAt = this.slides.length - slidesPerView;
                nextButton.style.display = this.activeIndex >= hideNextAt ? 'none' : 'flex';
              }
            }
          }
        });
      });
    }
  };
})(jQuery, Drupal, once);