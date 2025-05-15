(function (Drupal, once) {
  Drupal.behaviors.aboutSesToggle = {
    attach: function (context, settings) {
      console.log('[About SES JS] Behavior attached');
      
      // Process each SES section once
      once('about-ses-toggle', '.about-ses-section', context).forEach(function(section) {
        console.log('[About SES JS] Processing section:', section.id);
        
        // Find button with the special class
        const toggleButton = section.querySelector('#toogle_more');
        const extraContent = section.querySelector('.ses-extra-content');
        
        console.log('[About SES JS] Button found?', !!toggleButton, toggleButton);
        console.log('[About SES JS] Content found?', !!extraContent, extraContent);
        
        if (!toggleButton || !extraContent) {
          console.warn('[About SES JS] Missing elements in section:', section.id);
          return;
        }
        
        // Ensure content is hidden initially (double protection)
        extraContent.style.display = 'none';
        
        // Set up click handler
        toggleButton.addEventListener('click', function() {
          console.log('[About SES JS] Button clicked!');
          
          if (extraContent.style.display === 'none') {
            extraContent.style.display = 'block';
            toggleButton.innerHTML = 'Less <i class="fas fa-chevron-up"></i>';
            console.log('[About SES JS] Content expanded');
          } else {
            extraContent.style.display = 'none';
            toggleButton.innerHTML = 'More <i class="fas fa-chevron-down"></i>';
            console.log('[About SES JS] Content collapsed');
          }
        });
        
        console.log('[About SES JS] Toggle setup complete for section:', section.id);
      });
    }
  };
})(Drupal, once);