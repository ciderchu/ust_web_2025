<?php

namespace Drupal\my_custom_blocks\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides an About SES block.
 *
 * @Block(
 *   id = "about_ses_block",
 *   admin_label = @Translation("About SES Block"),
 *   category = @Translation("Custom Blocks"),
 * )
 */
class AboutSesBlock extends BlockBase {
    public function build() {
        // Generate a unique ID for this block instance
        $block_id = uniqid('ses-block-');
        
        $html = '
        <div class="about-ses-section py-5" id="' . $block_id . '">
          <div class="container text-center">
            <h2 class="about-ses-title mb-4">
              Science, Environment and Society: From the Big Bang to Big Data
            </h2>
            <p class="about-ses-paragraph">
              Funded by the Quality Education Fund (QEF), this project aims to revitalize junior secondary science and STEM education through a curiosity-driven, evidence-based, and understanding-oriented approach. By introducing a new interdisciplinary framework—Science, Environment and Society (SES)—the project fosters a holistic exploration of scientific concepts, environmental issues, and societal impacts.
            </p>
            <div id="toogle_more">
            <button class="ses-toggle-button btn btn-outline-primary mt-3" data-toggle="ses-content">
              More <i class="fas fa-chevron-down"></i>
            </button>
            </div>
    
            <div class="ses-extra-content about-ses-extra mt-4" style="display: none;">
              <div class="p-4">
                <h4>The project focuses on:</h4>
                <ul class="text-left mt-3">
                  <li>Implementing the SES framework to connect scientific principles with real-world contexts for junior secondary students.</li>
                  <li>Enriching science and STEM education by examining the evolution of complexity as a unifying theme across disciplines.</li>
                  <li>Highlighting the critical role of scientific approaches in analyzing information effectively.</li>
                  <li>Encouraging proactive, positive thinking toward sustainable solutions for future challenges.</li>
                  <li>Evaluating how the SES framework influences students\' motivation and proactive engagement in science, STEM, and beyond.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        ';
    
        return [
          '#type' => 'markup',
          '#markup' => $html,
          '#attached' => [
            'library' => [
              'hkust_theme/global',
              'hkust_theme/about_ses_toggle',
            ],
          ],
        ];
    }
}