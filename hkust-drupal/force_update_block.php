<?php

use Drupal\Core\DrupalKernel;
use Symfony\Component\HttpFoundation\Request;

// ✅ Load autoloader from /web
$autoloader = require_once __DIR__ . '/web/autoload.php';

// ✅ Set correct site path for Drupal inside /web
$site_path = 'web/sites/default';

// ✅ Bootstrap Drupal
$kernel = new DrupalKernel('prod', $autoloader);
$kernel->setSitePath($site_path);
$request = Request::createFromGlobals();
$kernel->boot();
$kernel->preHandle($request);

// ✅ Define the blocks to update
$blocks = [
  'Unit 1: Science Resources' => <<<EOD
<div class="resource-item">
  <span class="resource-title">Origin Story and Big Bang</span>
  <a href="/sites/default/files/2025-05/00%20Origin%20Story%20and%20Big%20Bang.pdf" class="resource-download-link">
    <i class="fas fa-download"></i>
  </a>
</div>
<div class="resource-item">
  <span class="resource-title">Star Formation</span>
  <a href="/sites/default/files/2025-05/01%20Star%20Formation.pdf" class="resource-download-link">
    <i class="fas fa-download"></i>
  </a>
</div>
<div class="resource-item">
  <span class="resource-title">Solar System</span>
  <a href="/sites/default/files/2025-05/02%20Solar%20System.pdf" class="resource-download-link">
    <i class="fas fa-download"></i>
  </a>
</div>
<div class="resource-item">
  <span class="resource-title">Earth</span>
  <a href="/sites/default/files/2025-05/03%20Earth.pdf" class="resource-download-link">
    <i class="fas fa-download"></i>
  </a>
</div>
<div class="resource-item">
  <span class="resource-title">Summary of Module 1</span>
  <a href="/sites/default/files/2025-05/04%20Summary%20of%20Module%201.pdf" class="resource-download-link">
    <i class="fas fa-download"></i>
  </a>
</div>
<div class="resource-item">
  <span class="resource-title">Life</span>
  <a href="/sites/default/files/2025-05/05%20Life.pdf" class="resource-download-link">
    <i class="fas fa-download"></i>
  </a>
</div>
EOD,

  'Unit 2: Environment Resources' => <<<EOD
<div class="resource-item">
  <span class="resource-title">Evolution</span>
  <a href="/sites/default/files/2025-05/06%20Evolution.pdf" class="resource-download-link">
    <i class="fas fa-download"></i>
  </a>
</div>
<div class="resource-item">
  <span class="resource-title">Adaptation and Extinction</span>
  <a href="/sites/default/files/2025-05/07%20Adaptation%20and%20Extinction.pdf" class="resource-download-link">
    <i class="fas fa-download"></i>
  </a>
</div>
EOD,

  'Unit 3: Society Resources' => <<<EOD
<div class="resource-item">
  <span class="resource-title">Human</span>
  <a href="/sites/default/files/2025-05/08%20Human.pdf" class="resource-download-link">
    <i class="fas fa-download"></i>
  </a>
</div>
<div class="resource-item">
  <span class="resource-title">Introduction to human society</span>
  <a href="/sites/default/files/2025-05/09%20Introduction%20to%20human%20society.pdf" class="resource-download-link">
    <i class="fas fa-download"></i>
  </a>
</div>
EOD,
];

// ✅ Loop through and update each block
foreach ($blocks as $blockTitle => $html) {
  echo "🔄 Updating block: $blockTitle\n";

  // Find block by title
  $database = \Drupal::database();
  $blockId = $database->query(
    "SELECT id FROM block_content_field_data WHERE info = :title AND type = 'teaching_resource_category'",
    [':title' => $blockTitle]
  )->fetchField();

  if (!$blockId) {
    echo "❌ Block not found: $blockTitle\n";
    continue;
  }

  $storage = \Drupal::entityTypeManager()->getStorage('block_content');
  $block = $storage->load($blockId);

  if (!$block) {
    echo "❌ Could not load block with ID: $blockId\n";
    continue;
  }

  // Update field
  $block->set('field_resources_list', [
    'value' => $html,
    'format' => 'full_html',
  ]);
  $block->save();

  // Invalidate caches
  // \Drupal::service('cache.render')->invalidateTags(["block_content:$blockId"]);
  // \Drupal::service('cache.data')->invalidateTags(["block_content:$blockId"]);
  // \Drupal::service('cache.dynamic_page_cache')->invalidateTags(["block_content:$blockId"]);
  \Drupal::service('cache_tags.invalidator')->invalidateTags(["block_content:$blockId"]);


  echo "✅ Updated and cleared cache for block ID: $blockId\n";
}
