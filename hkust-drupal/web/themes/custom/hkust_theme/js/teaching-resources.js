/**
 * JavaScript for Teaching Resources page
 * Handles category expansion/collapse and other interactions
 */
(function ($, Drupal, once) {
    'use strict';
  
    Drupal.behaviors.teachingResourcesToggle = {
        attach: function (context, settings) {
          // Process each resource category section once
        once('resource-category-toggle', '.resource-category-section', context).forEach(function(section) {
            console.log('[Teaching Resources JS] Processing section:', section.id);
            
            // Find the header that will toggle the content
            const categoryHeader = section.querySelector('.category-header');
            const categoryContent = section.querySelector('.category-content');
            const toggleIconContainer = section.querySelector('.category-toggle');
            
            if (!categoryHeader || !categoryContent || !toggleIconContainer) {
              console.warn('[Teaching Resources JS] Missing elements in section:', section.id);
              return;
            }
            
            // Create the icon element
            const toggleIcon = document.createElement('i');
            toggleIcon.className = 'fas fa-chevron-down';
            toggleIconContainer.innerHTML = ''; // Clear any existing content
            toggleIconContainer.appendChild(toggleIcon);
            
            // Set initial state based on aria-expanded attribute
            if (categoryHeader.getAttribute('aria-expanded') === 'true') {
              toggleIcon.style.transform = 'rotate(180deg)';
            } else {
              toggleIcon.style.transform = 'rotate(0deg)';
            }
            
            // Set up click handler for category expansion
            categoryHeader.addEventListener('click', function(event) {
              // Prevent default behavior of anchor tags
              event.preventDefault();
              
              // Get current expansion state
              const isExpanded = categoryHeader.getAttribute('aria-expanded') === 'true';
              
              // Toggle the state
              categoryHeader.setAttribute('aria-expanded', !isExpanded);
              
              // Toggle the collapse using Bootstrap's collapse functionality
              $(categoryContent).collapse('toggle');
              
              // Just rotate the icon based on state
              if (!isExpanded) {
                // Expanding - rotate to up position
                toggleIcon.style.transform = 'rotate(180deg)';
              } else {
                // Collapsing - rotate to down position
                toggleIcon.style.transform = 'rotate(0deg)';
              }
            });
            
            // Listen for Bootstrap collapse events to keep icon in sync
            $(categoryContent).on('shown.bs.collapse', function() {
              toggleIcon.style.transform = 'rotate(180deg)';
              categoryHeader.setAttribute('aria-expanded', 'true');
            });
            
            $(categoryContent).on('hidden.bs.collapse', function() {
              toggleIcon.style.transform = 'rotate(0deg)';
              categoryHeader.setAttribute('aria-expanded', 'false');
            });
          });
          
        }
      };
    
    // Download functionality for resources
    Drupal.behaviors.resourceDownloads = {
        attach: function (context, settings) {
          // Check if JSZip is available
          if (typeof JSZip === 'undefined') {
            console.error('JSZip library not loaded');
            return;
          }
          
          // Handle "Download All" button clicks
          once('download-all-handler', '.btn-download-all', context).forEach(function (button) {
            $(button).on('click', function (e) {
              e.preventDefault();
              const container = $(this).closest('.category-content-inner');
              const downloadLinks = container.find('.resource-download-link');
              const categoryTitle = $(this).closest('.resource-category-section').find('.category-title').text().trim();
              
              // Show loading indicator
              const $button = $(this);
              const originalText = $button.html();
              $button.html('<i class="fas fa-spinner fa-spin"></i> Creating ZIP...');
              
              // Create new ZIP file
              const zip = new JSZip();
              let downloadCount = 0;
              const totalFiles = downloadLinks.length;
              
              if (totalFiles === 0) {
                alert('No files found to download.');
                $button.html(originalText);
                return;
              }
              
              // For each download link, fetch the file and add it to the ZIP
              downloadLinks.each(function() {
                const link = $(this).attr('href');
                const fileName = link.substring(link.lastIndexOf('/') + 1);
                
                // Use fetch to get the file
                fetch(link)
                  .then(response => response.blob())
                  .then(blob => {
                    // Add the file to the ZIP
                    zip.file(decodeURIComponent(fileName), blob);
                    downloadCount++;
                    
                    // When all files are added, generate the ZIP
                    if (downloadCount === totalFiles) {
                      generateZip();
                    }
                  })
                  .catch(error => {
                    console.error('Error fetching file:', error);
                    downloadCount++;
                    
                    // Even if there's an error, try to generate ZIP with available files
                    if (downloadCount === totalFiles) {
                      generateZip();
                    }
                  });
              });
              
              // Function to generate and download the ZIP
              function generateZip() {
                // Generate the ZIP file
                zip.generateAsync({type: 'blob'})
                  .then(function(content) {
                    
                    // Use this improved version:
                    const sanitizedTitle = categoryTitle
                    .trim()                         // Remove leading/trailing whitespace
                    .replace(/\s+/g, '_')          // Replace spaces with single underscore
                    .replace(/[^a-zA-Z0-9_]/g, '') // Remove any non-alphanumeric characters except underscore
                    .replace(/_+/g, '_')           // Replace multiple underscores with a single one
                    .replace(/^_|_$/g, '');        // Remove leading/trailing underscores
                                    
                    saveAs(content, sanitizedTitle + '_resources.zip');
                    
                    // Restore the button text
                    $button.html(originalText);
                  })
                  .catch(function(error) {
                    console.error('Error generating ZIP:', error);
                    alert('Error creating ZIP file. Please try again.');
                    $button.html(originalText);
                  });
              }
            });
          });
          
          // Handle individual resource download links
          once('resource-download-handler', '.resource-download-link', context).forEach(function (link) {
            $(link).on('click', function (e) {
              e.preventDefault();
              const fileUrl = $(this).attr('href');
              if (fileUrl) {
                // Create hidden anchor element
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = fileUrl;
                
                // Extract filename from URL
                const filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
                // Set download attribute to force download
                a.setAttribute('download', decodeURIComponent(filename));
                
                // Append to body, trigger click, and remove
                document.body.appendChild(a);
                a.click();
                
                // Clean up after a small delay to ensure download starts
                setTimeout(function() {
                  document.body.removeChild(a);
                }, 100);
              }
            });
          });
        }
      };
  })(jQuery, Drupal, once);