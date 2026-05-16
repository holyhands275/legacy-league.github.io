/* ============================================================
   LEGACY LEAGUE — script.js
   v0.1 — Title, Choose Path, Create Player, Dashboard
   ============================================================ */

'use strict';

// ── localStorage save key
const SAVE_KEY = 'legacyLeagueSave';

/* ════════════════════════════════════════════════════
   1. SCREEN SYSTEM
   ════════════════════════════════════════════════════ */

/**
 * showScreen(screenId)
 * Hides all screens, then shows only the one matching screenId.
 */
function showScreen(screenId) {
  const allScreens = document.querySelectorAll('.screen');
  allScreens.forEach(function(screen) {
    screen.classList.add('hidden');
  });

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.remove('hidden');
    window.scrollTo({ top: 0 });
  } else {
    console.error('showScreen: no screen found with id "' + screenId + '"');
  }
}

/* ════════════════════════════════════════════════════
   2. SAVE / LOAD
   ════════════════════════════════════════════════════ */

/**
 * saveCareer(player)
 * Saves the player object to localStorage as JSON.
 */
function saveCareer(player) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(player));
  } catch (e) {
    console.warn('saveCareer: failed to save.', e);
  }
}

/**
 * loadCareer()
 * Returns the saved player object from localStorage, or null if none exists.
 */
function loadCareer() {
  try {
    var raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('loadCareer: failed to parse saved data.', e);
    return null;
  }
}

/* ════════════════════════════════════════════════════
   3. DASHBOARD
   ════════════════════════════════════════════════════ */

/**
 * updateDashboard(player)
 * Populates the dashboard screen with the player's info.
 */
function updateDashboard(player) {
  document.getElementById('dashboard-player-name').textContent = player.name;
  document.getElementById('dashboard-position').textContent    = player.position;
  document.getElementById('dashboard-archetype').textContent   = player.archetype;
  document.getElementById('dashboard-style').textContent       = player.style;
  document.getElementById('dashboard-jersey').textContent      = '#' + player.jerseyNumber;
}

/* ════════════════════════════════════════════════════
   4. PLAYER CREATION — STAT BUILDER
   ════════════════════════════════════════════════════ */

/**
 * buildPlayer(name, position, archetype, style, jerseyNumber)
 * Creates the full player object with base stats,
 * then applies bonuses/penalties from position, archetype, and style.
 */
function buildPlayer(name, position, archetype, style, jerseyNumber) {

  // Base player object
  var player = {
    name:          name,
    position:      position,
    archetype:     archetype,
    style:         style,
    jerseyNumber:  jerseyNumber,
    stage:         'High School',
    age:           18,
    overall:       60,
    money:         0,
    followers:     0,
    energy:        100,
    draftStock:    0,
    hiddenPotential: 0,
    stats: {
      shooting:    50,
      finishing:   50,
      handles:     50,
      defense:     50,
      iq:          50,
      athleticism: 50
    }
  };

  // ── Position modifiers
  if (position === 'Guard') {
    player.stats.handles    += 8;
    player.stats.shooting   += 6;
    player.stats.athleticism += 4;
    player.stats.finishing  -= 4;
  } else if (position === 'Wing') {
    // Wing is balanced — small bumps across the board
    player.stats.shooting   += 4;
    player.stats.finishing  += 4;
    player.stats.athleticism += 3;
    player.stats.defense    += 3;
  } else if (position === 'Big') {
    player.stats.finishing  += 10;
    player.stats.defense    += 8;
    player.stats.handles    -= 6;
    player.stats.shooting   -= 4;
  }

  // ── Archetype modifiers
  if (archetype === 'Underrated Prospect') {
    player.stats.iq         += 8;
    player.followers        = 200;
    player.hiddenPotential  = 85;
  } else if (archetype === 'Athletic Freak') {
    player.stats.athleticism += 12;
    player.stats.finishing  += 8;
    player.stats.shooting   -= 8;
    player.stats.iq         -= 4;
  } else if (archetype === 'Overseas Talent') {
    player.stats.iq         += 8;
    player.stats.shooting   += 6;
    player.followers        = 300;
  } else if (archetype === 'Raw Beginner') {
    // Starts behind but highest growth potential
    player.stats.shooting   -= 8;
    player.stats.finishing  -= 6;
    player.stats.handles    -= 6;
    player.stats.defense    -= 4;
    player.stats.iq         -= 4;
    player.stats.athleticism -= 2;
    player.hiddenPotential  = 99;
    player.overall          = 48;
  } else if (archetype === "Coach's Kid") {
    player.stats.iq         += 12;
    player.stats.handles    += 6;
    player.stats.athleticism -= 8;
  }

  // ── Style / Build modifiers
  if (style === 'Small Guard') {
    player.stats.handles    += 6;
    player.stats.shooting   += 4;
    player.stats.finishing  -= 6;
  } else if (style === 'Balanced Wing') {
    // Balanced — minor improvement everywhere
    player.stats.shooting   += 2;
    player.stats.finishing  += 2;
    player.stats.handles    += 2;
    player.stats.defense    += 2;
  } else if (style === 'Athletic Wing') {
    player.stats.athleticism += 8;
    player.stats.finishing  += 6;
    player.stats.handles    -= 2;
  } else if (style === 'Big Man') {
    player.stats.defense    += 10;
    player.stats.finishing  += 8;
    player.stats.handles    -= 10;
    player.stats.shooting   -= 6;
  }

  // ── Clamp all stats to 1–99
  var statKeys = Object.keys(player.stats);
  statKeys.forEach(function(key) {
    player.stats[key] = Math.max(1, Math.min(99, player.stats[key]));
  });

  // ── Recalculate overall as average of all stats
  if (archetype !== 'Raw Beginner') {
    var sum = statKeys.reduce(function(acc, key) {
      return acc + player.stats[key];
    }, 0);
    player.overall = Math.round(sum / statKeys.length);
  }

  return player;
}

/* ════════════════════════════════════════════════════
   5. HELPERS
   ════════════════════════════════════════════════════ */

/** Show a message in a given element. Pass type 'error' or '' */
function showMessage(elementId, text, type) {
  var el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = text;
  el.className   = 'message' + (type === 'error' ? ' error-message' : '');
}

/** Clear a message area */
function clearMessage(elementId) {
  var el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = '';
  el.className   = 'message';
}

/* ════════════════════════════════════════════════════
   6. TITLE SCREEN BUTTONS
   ════════════════════════════════════════════════════ */

document.getElementById('new-career-btn').addEventListener('click', function() {
  clearMessage('title-message');
  resetCreateForm();
  showScreen('choose-path-screen');
});

document.getElementById('continue-career-btn').addEventListener('click', function() {
  var saved = loadCareer();
  if (saved) {
    updateDashboard(saved);
    showScreen('dashboard-screen');
  } else {
    showMessage('title-message', 'No saved career found. Start a new career first.', '');
  }
});

document.getElementById('how-to-play-btn').addEventListener('click', function() {
  document.getElementById('how-to-play-panel').classList.remove('hidden');
});

document.getElementById('close-how-to-play-btn').addEventListener('click', function() {
  document.getElementById('how-to-play-panel').classList.add('hidden');
});

// Close modal when clicking the backdrop
document.getElementById('how-to-play-panel').addEventListener('click', function(e) {
  if (e.target === this) {
    this.classList.add('hidden');
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.getElementById('how-to-play-panel').classList.add('hidden');
  }
});

/* ════════════════════════════════════════════════════
   7. CHOOSE PATH SCREEN BUTTONS
   ════════════════════════════════════════════════════ */

document.getElementById('back-to-title-btn').addEventListener('click', function() {
  clearMessage('path-message');
  showScreen('title-screen');
});

document.getElementById('create-own-player-btn').addEventListener('click', function() {
  clearMessage('path-message');
  showScreen('create-player-screen');
});

document.getElementById('choose-prospect-btn').addEventListener('click', function() {
  showMessage('path-message', 'Choose Prospect is coming soon.', '');
});

document.getElementById('international-player-btn').addEventListener('click', function() {
  showMessage('path-message', 'International Player is coming soon.', '');
});

document.getElementById('random-player-btn').addEventListener('click', function() {
  showMessage('path-message', 'Random Player is coming soon.', '');
});

/* ════════════════════════════════════════════════════
   8. CREATE PLAYER SCREEN
   ════════════════════════════════════════════════════ */

document.getElementById('back-to-path-btn').addEventListener('click', function() {
  clearMessage('create-message');
  showScreen('choose-path-screen');
});

// ── Visual .selected class on radio card clicks
// Handles position, archetype, and style card groups
var radioCardGroups = ['position-group', 'archetype-group', 'style-group'];

radioCardGroups.forEach(function(groupId) {
  var group = document.getElementById(groupId);
  if (!group) return;

  var cards = group.querySelectorAll('.sel-card');
  cards.forEach(function(card) {
    card.addEventListener('click', function() {
      // Remove .selected from all sibling cards in this group
      cards.forEach(function(c) { c.classList.remove('selected'); });
      // Add .selected to the clicked card
      card.classList.add('selected');
    });
  });
});

// ── Start Career — validation and player creation
document.getElementById('start-career-btn').addEventListener('click', function() {
  clearMessage('create-message');

  // Name
  var name = document.getElementById('player-name').value.trim();
  if (!name) {
    showMessage('create-message', 'Please enter a player name.', 'error');
    document.getElementById('player-name').focus();
    return;
  }

  // Position
  var positionEl = document.querySelector('input[name="position"]:checked');
  if (!positionEl) {
    showMessage('create-message', 'Please choose a position.', 'error');
    return;
  }

  // Archetype
  var archetypeEl = document.querySelector('input[name="archetype"]:checked');
  if (!archetypeEl) {
    showMessage('create-message', 'Please choose an archetype.', 'error');
    return;
  }

  // Style
  var styleEl = document.querySelector('input[name="style"]:checked');
  if (!styleEl) {
    showMessage('create-message', 'Please choose a style.', 'error');
    return;
  }

  // Jersey number — optional, default 23
  var jerseyRaw = document.getElementById('jersey-number').value;
  var jersey    = jerseyRaw === '' ? 23 : parseInt(jerseyRaw, 10);
  if (isNaN(jersey) || jersey < 0 || jersey > 99) {
    showMessage('create-message', 'Jersey number must be between 0 and 99.', 'error');
    return;
  }

  // Build the full player object with starting stats
  var player = buildPlayer(
    name,
    positionEl.value,
    archetypeEl.value,
    styleEl.value,
    jersey
  );

  // Save to localStorage
  saveCareer(player);

  // Populate and show the dashboard
  updateDashboard(player);
  showScreen('dashboard-screen');
});

/* ════════════════════════════════════════════════════
   9. DASHBOARD SCREEN — Reset
   ════════════════════════════════════════════════════ */

document.getElementById('reset-career-btn').addEventListener('click', function() {
  var confirmed = window.confirm('Reset your career? All progress will be lost.');
  if (!confirmed) return;

  // Clear localStorage
  try { localStorage.removeItem(SAVE_KEY); } catch(e) {}

  // Clear create form so a new career starts fresh
  resetCreateForm();

  // Return to title
  showScreen('title-screen');
  clearMessage('title-message');
});

/* ════════════════════════════════════════════════════
   10. HELPERS — Form Reset
   ════════════════════════════════════════════════════ */

/** resetCreateForm — clears all inputs and selected states */
function resetCreateForm() {
  document.getElementById('player-name').value    = '';
  document.getElementById('jersey-number').value  = '';

  // Uncheck all radios
  document.querySelectorAll('input[name="position"]').forEach(function(r) { r.checked = false; });
  document.querySelectorAll('input[name="archetype"]').forEach(function(r) { r.checked = false; });
  document.querySelectorAll('input[name="style"]').forEach(function(r) { r.checked = false; });

  // Remove all .selected highlights
  document.querySelectorAll('.sel-card.selected').forEach(function(c) {
    c.classList.remove('selected');
  });

  clearMessage('create-message');
  clearMessage('path-message');
}

/* ════════════════════════════════════════════════════
   11. INIT — run on page load
   ════════════════════════════════════════════════════ */
(function init() {
  // Start on the title screen
  showScreen('title-screen');

  // If a saved career exists, hint to the player
  var saved = loadCareer();
  if (saved) {
    showMessage(
      'title-message',
      'Career found: ' + saved.name + ' · #' + saved.jerseyNumber,
      ''
    );
  }
})();
