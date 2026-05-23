/* ============================================================
   LEGACY LEAGUE — script.js
   v0.1 logic is unchanged.
   v0.2 additions are clearly marked.
   ============================================================ */

'use strict';

// ── localStorage save key
const SAVE_KEY = 'legacyLeagueSave';

/* ════════════════════════════════════════════════════
   1. SCREEN SYSTEM  (v0.1 — unchanged)
   ════════════════════════════════════════════════════ */
function showScreen(screenId) {
  var allScreens = document.querySelectorAll('.screen');
  allScreens.forEach(function(screen) {
    screen.classList.add('hidden');
  });
  var target = document.getElementById(screenId);
  if (target) {
    target.classList.remove('hidden');
    window.scrollTo({ top: 0 });
  } else {
    console.error('showScreen: no screen found with id "' + screenId + '"');
  }
}

/* ════════════════════════════════════════════════════
   2. SAVE / LOAD  (v0.1 — unchanged)
   ════════════════════════════════════════════════════ */
function saveCareer(player) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(player));
  } catch (e) {
    console.warn('saveCareer: failed to save.', e);
  }
}

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
   3. PLAYER CREATION  (v0.1 — unchanged)
   ════════════════════════════════════════════════════ */
function buildPlayer(name, position, archetype, style, jerseyNumber, character, startingSchool) {
  var player = {
    name:            name,
    position:        position,
    archetype:       archetype,
    style:           style,
    jerseyNumber:    jerseyNumber,
    character:       character || null,
    startingSchool:  startingSchool || '',
    stage:           'High School',
    age:             18,
    overall:         60,
    money:           0,
    followers:       0,
    energy:          100,
    draftStock:      0,
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

  // Position modifiers
  if (position === 'Guard') {
    player.stats.handles     += 8;
    player.stats.shooting    += 6;
    player.stats.athleticism += 4;
    player.stats.finishing   -= 4;
  } else if (position === 'Wing') {
    player.stats.shooting    += 4;
    player.stats.finishing   += 4;
    player.stats.athleticism += 3;
    player.stats.defense     += 3;
  } else if (position === 'Big') {
    player.stats.finishing   += 10;
    player.stats.defense     += 8;
    player.stats.handles     -= 6;
    player.stats.shooting    -= 4;
  }

  // Archetype modifiers
  if (archetype === 'Underrated Prospect') {
    player.stats.iq          += 8;
    player.followers          = 200;
    player.hiddenPotential    = 85;
  } else if (archetype === 'Athletic Freak') {
    player.stats.athleticism += 12;
    player.stats.finishing   += 8;
    player.stats.shooting    -= 8;
    player.stats.iq          -= 4;
  } else if (archetype === 'Overseas Talent') {
    player.stats.iq          += 8;
    player.stats.shooting    += 6;
    player.followers          = 300;
  } else if (archetype === 'Raw Beginner') {
    player.stats.shooting    -= 8;
    player.stats.finishing   -= 6;
    player.stats.handles     -= 6;
    player.stats.defense     -= 4;
    player.stats.iq          -= 4;
    player.stats.athleticism -= 2;
    player.hiddenPotential    = 99;
    player.overall            = 48;
  } else if (archetype === "Coach's Kid") {
    player.stats.iq          += 12;
    player.stats.handles     += 6;
    player.stats.athleticism -= 8;
  }

  // Style modifiers
  if (style === 'Ball Handler') {
    player.stats.handles     += 6;
    player.stats.shooting    += 4;
    player.stats.finishing   -= 6;
  } else if (style === 'Rebounder') {
    player.stats.defense     += 7;
    player.stats.finishing   += 4;
    player.stats.handles     -= 4;
  } else if (style === 'Dunk Master') {
    player.stats.athleticism += 8;
    player.stats.finishing   += 8;
    player.stats.shooting    -= 4;
  } else if (style === 'Three Point Legend') {
    player.stats.shooting    += 10;
    player.stats.handles     += 3;
    player.stats.finishing   -= 5;
  } else if (style === 'Defensive Beast') {
    player.stats.defense     += 10;
    player.stats.athleticism += 4;
    player.stats.shooting    -= 4;
  } else if (style === 'All Around') {
    player.stats.shooting    += 2;
    player.stats.finishing   += 2;
    player.stats.handles     += 2;
    player.stats.defense     += 2;
  } 

  // Clamp stats 1–99
  var statKeys = Object.keys(player.stats);
  statKeys.forEach(function(key) {
    player.stats[key] = Math.max(1, Math.min(99, player.stats[key]));
  });

  // Recalculate overall
  if (archetype !== 'Raw Beginner') {
    var sum = statKeys.reduce(function(acc, key) { return acc + player.stats[key]; }, 0);
    player.overall = Math.round(sum / statKeys.length);
  }

  return player;
}

/* ════════════════════════════════════════════════════
   4. HELPERS  (v0.1 — unchanged)
   ════════════════════════════════════════════════════ */
function showMessage(elementId, text, type) {
  var el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = text;
  el.className   = 'message' + (type === 'error' ? ' error-message' : '');
}

function clearMessage(elementId) {
  var el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = '';
  el.className   = 'message';
}

function resetCreateForm() {
  document.getElementById('player-name').value   = '';
  document.getElementById('jersey-number').value = '';
  document.querySelectorAll('input[name="position"]').forEach(function(r) { r.checked = false; });
  document.querySelectorAll('input[name="archetype"]').forEach(function(r) { r.checked = false; });
  document.querySelectorAll('input[name="style"]').forEach(function(r) { r.checked = false; });
  document.querySelectorAll('input[name="character"]').forEach(function(r) { r.checked = false; });
  var schoolSelect = document.getElementById('school-select');
  if (schoolSelect) schoolSelect.selectedIndex = 0;
  document.querySelectorAll('.sel-card.selected').forEach(function(c) { c.classList.remove('selected'); });
  clearMessage('create-message');
  clearMessage('path-message');
}

/* ════════════════════════════════════════════════════
   v0.2 — NEW FUNCTIONS BELOW
   ════════════════════════════════════════════════════ */

// Global reference to the currently loaded player
var currentPlayer = null;

/* ── clamp helper ── */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/* ── recalculate overall ── */
function recalculateOverall(player) {
  var s = player.stats;
  var avg = (s.shooting + s.finishing + s.handles + s.defense + s.iq + s.athleticism) / 6;
  player.overall = Math.round(avg);
}

/* ── normalizePlayer — adds missing fields so old saves still work ── */
function normalizePlayer(player) {
  if (player.week          === undefined) player.week          = 1;
  if (player.maxWeeks      === undefined) player.maxWeeks      = 12;
  if (player.wins          === undefined) player.wins          = 0;
  if (player.losses        === undefined) player.losses        = 0;
  if (player.gamesPlayed   === undefined) player.gamesPlayed   = 0;
  if (player.totalPoints   === undefined) player.totalPoints   = 0;
  if (player.ppg           === undefined) player.ppg           = 0;
  if (player.seasonLabel   === undefined) player.seasonLabel   = 'Senior Season';
  if (player.team          === undefined) player.team          = 'Keller Central HS';
  if (player.character     === undefined) player.character     = null;
  if (player.startingSchool=== undefined) player.startingSchool= '';
  if (player.brandValue    === undefined) player.brandValue    = 0;
  if (player.investments   === undefined) player.investments   = 0;
  if (player.endorsements  === undefined) player.endorsements  = 0;
  if (player.legacyScore   === undefined) player.legacyScore   = 0;
  if (player.reputation    === undefined) player.reputation    = 'Unknown';
  if (player.injuryStatus  === undefined) player.injuryStatus  = 'Healthy';
  if (player.lastEvent     === undefined) player.lastEvent     = null;
  if (player.followers     === undefined) player.followers     = 0;
  if (player.energy        === undefined) player.energy        = 100;
  if (player.draftStock    === undefined) player.draftStock    = 0;
  if (player.money         === undefined) player.money         = 0;
  if (player.age           === undefined) player.age           = 18;
  return player;
}

var STARTING_SCHOOLS = ['Timber Creek', 'Keller Central', 'The Colony', 'Southlake Carrol', 'Frisco'];
function renderSchoolOptions() {
  var schoolSelect = document.getElementById('school-select');
  if (!schoolSelect) return;
  schoolSelect.innerHTML = '<option value="">Select a school</option>';
  STARTING_SCHOOLS.forEach(function(school) {
    var option = document.createElement('option');
    option.value = school;
    option.textContent = school;
    schoolSelect.appendChild(option);
  });
}

/* ── formatFollowers ── */
function formatFollowers(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

/* ── formatDraftStock ── */
function formatDraftStock(value) {
  if (value >= 100) return 'Lottery Hype';
  if (value >= 80)  return 'Draft Watch';
  if (value >= 60)  return 'National Prospect';
  if (value >= 40)  return 'College Interest';
  if (value >= 20)  return 'Local Prospect';
  return 'Unranked';
}

/* ── getCareerTitle ── */
function getCareerTitle(player) {
  var o = player.overall;
  if (o >= 85) return 'Future Legend';
  if (o >= 75) return 'National Prospect';
  if (o >= 65) return 'Local Star';
  if (o >= 55) return 'Rising Prospect';
  return 'Raw Prospect';
}

/* ── getArchetypeBackstory ── */
function getArchetypeBackstory(archetype) {
  switch (archetype) {
    case 'Underrated Prospect':
      return 'Small-town player nobody believes in. Hard work is the only language you speak.';
    case 'Athletic Freak':
      return 'Your body does things others can\'t even dream of. Now you just need the skills to match.';
    case 'Overseas Talent':
      return 'You crossed oceans to chase this dream. Your IQ sets you apart — now prove it on this stage.';
    case 'Raw Beginner':
      return 'Late to the game, but the ceiling is sky-high. Every rep closes the gap.';
    case "Coach's Kid":
      return 'You\'ve been in the gym your whole life. Basketball is in your blood — now make it your name.';
    default:
      return '';
  }
}

/* ── showDashboardMessage ── */
function showDashboardMessage(text, type) {
  showMessage('dashboard-message', text, type || '');
  // Auto-clear after 3 seconds
  setTimeout(function() { clearMessage('dashboard-message'); }, 3000);
}

/* ── addStoryEvent ── */
function addStoryEvent(title, body, result) {
  var feed = document.getElementById('story-feed');
  if (!feed) return;

  var card = document.createElement('div');
  card.className = 'story-event';

  var titleEl  = document.createElement('div');
  titleEl.className = 'story-event-title';
  titleEl.textContent = title;

  var bodyEl   = document.createElement('div');
  bodyEl.className = 'story-event-body';
  bodyEl.textContent = body;

  var resultEl = document.createElement('div');
  resultEl.className = 'story-event-result';
  resultEl.textContent = result;

  card.appendChild(titleEl);
  card.appendChild(bodyEl);
  card.appendChild(resultEl);

  // Insert at top of feed
  feed.insertBefore(card, feed.firstChild);

  // Keep only latest 12 events
  while (feed.children.length > 12) {
    feed.removeChild(feed.lastChild);
  }

  // Store last event on player
  if (currentPlayer) {
    currentPlayer.lastEvent = { title: title, body: body, result: result };
  }
}

/* ════════════════════════════════════════════════════
   5. updateDashboard  (replaces v0.1 version entirely)
   ════════════════════════════════════════════════════ */
function updateDashboard(player) {
  function set(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  recalculateOverall(player);

  // Header
  set('dashboard-player-name', player.name);
  set('dashboard-jersey',      '#' + player.jerseyNumber);
  set('dashboard-overall',     player.overall);
  set('dashboard-career-title', getCareerTitle(player));
  set('dashboard-stage',       player.stage || 'High School');
  set('dashboard-week',        'Week ' + player.week);
  var avatarEl = document.getElementById('dashboard-character-image');
  if (avatarEl && player.character && player.character.image) {
    avatarEl.src = player.character.image;
    avatarEl.alt = (player.character.title || 'Selected') + ' character portrait';
  }
   
  // Player info
  set('dashboard-position',      player.position);
  set('dashboard-archetype',     player.archetype);
  set('dashboard-style',         player.style);
  set('dashboard-age',           player.age);
  set('dashboard-team',          player.team);
  set('dashboard-injury-status', player.injuryStatus);
  set('dashboard-backstory',     getArchetypeBackstory(player.archetype));

  // Attributes + bars
  var stats = ['shooting', 'finishing', 'handles', 'defense', 'iq', 'athleticism'];
  stats.forEach(function(s) {
    set('stat-' + s, player.stats[s]);
    var bar = document.getElementById('bar-' + s);
    if (bar) bar.style.width = player.stats[s] + '%';
  });

  // Capital
  set('dashboard-brand-value',  player.brandValue);
  set('dashboard-investments',  '$' + player.investments);
  set('dashboard-endorsements', player.endorsements > 0 ? player.endorsements + ' deal(s)' : 'None');

  // Resources
  set('dashboard-energy',      player.energy);
  set('dashboard-money',       '$' + player.money);
  set('dashboard-followers',   formatFollowers(player.followers));
  set('dashboard-draft-stock', formatDraftStock(player.draftStock));

  // Career summary
  set('dashboard-games-played', player.gamesPlayed);
  set('dashboard-ppg',          player.ppg.toFixed(1));
  set('dashboard-reputation',   player.reputation);
  set('dashboard-legacy-score', player.legacyScore);

  // Season / week panel
  set('dashboard-season-label',  player.seasonLabel);
  set('dashboard-week-progress', 'Week ' + player.week + ' of ' + player.maxWeeks);
  set('dashboard-record',        'Record: ' + player.wins + '-' + player.losses);

  // Week progress bar
  var fill = document.getElementById('week-progress-fill');
  if (fill) fill.style.width = ((player.week / player.maxWeeks) * 100) + '%';
}

/* ════════════════════════════════════════════════════
   6. TITLE SCREEN BUTTONS  (v0.1 — mostly unchanged,
      updated to use normalizePlayer + addStoryEvent)
   ════════════════════════════════════════════════════ */
document.getElementById('new-career-btn').addEventListener('click', function() {
  clearMessage('title-message');
  resetCreateForm();
  showScreen('choose-path-screen');
});

document.getElementById('continue-career-btn').addEventListener('click', function() {
  var saved = loadCareer();
  if (saved) {
    normalizePlayer(saved);
    currentPlayer = saved;
    updateDashboard(currentPlayer);
    showScreen('dashboard-screen');
    addStoryEvent('Career Resumed', 'Welcome back. Time to get back to work.', 'Career loaded from save.');
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

document.getElementById('how-to-play-panel').addEventListener('click', function(e) {
  if (e.target === this) this.classList.add('hidden');
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.getElementById('how-to-play-panel').classList.add('hidden');
  }
});

/* ════════════════════════════════════════════════════
   7. CHOOSE PATH BUTTONS  (v0.1 — unchanged)
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
   8. CREATE PLAYER SCREEN  (v0.1 — unchanged logic,
      updated to normalize + welcome event)
   ════════════════════════════════════════════════════ */
document.getElementById('back-to-path-btn').addEventListener('click', function() {
  clearMessage('create-message');
  showScreen('choose-path-screen');
});

// Selectable radio cards visual highlight
var radioCardGroups = ['position-group', 'archetype-group', 'style-group', 'character-group'];

function bindSelectableCardGroup(groupId) {
  var group = document.getElementById(groupId);
  if (!group) return;
  var cards = group.querySelectorAll('.sel-card');
  cards.forEach(function(card) {
    card.addEventListener('click', function() {
      cards.forEach(function(c) { c.classList.remove('selected'); });
      card.classList.add('selected');
    });
  });
}

radioCardGroups.forEach(bindSelectableCardGroup);

var jerseyInput = document.getElementById('jersey-number');
if (jerseyInput) {
  jerseyInput.addEventListener('input', function() {
    var digits = this.value.replace(/\D/g, '').slice(0, 2);
    if (digits === '') { this.value = ''; return; }
    var n = Math.max(0, Math.min(99, parseInt(digits, 10)));
    this.value = String(n);
  });
}

document.getElementById('start-career-btn').addEventListener('click', function() {
  clearMessage('create-message');

  var name = document.getElementById('player-name').value.trim();
  if (!name) {
    showMessage('create-message', 'Please enter a player name.', 'error');
    document.getElementById('player-name').focus();
    return;
  }
  var positionEl  = document.querySelector('input[name="position"]:checked');
  if (!positionEl) { showMessage('create-message', 'Please choose a position.', 'error'); return; }

  var archetypeEl = document.querySelector('input[name="archetype"]:checked');
  if (!archetypeEl) { showMessage('create-message', 'Please choose an archetype.', 'error'); return; }

  var styleEl = document.querySelector('input[name="style"]:checked');
  if (!styleEl) { showMessage('create-message', 'Please choose a style.', 'error'); return; }
  var characterEl = document.querySelector('input[name="character"]:checked');
  if (!characterEl) { showMessage('create-message', 'Please choose custom character.', 'error'); return; }
  var schoolValue = document.getElementById('school-select').value;
  if (!schoolValue) { showMessage('create-message', 'Please choose a school.', 'error'); return; }

   
  var jerseyRaw = document.getElementById('jersey-number').value;
  var jersey    = jerseyRaw === '' ? 23 : parseInt(jerseyRaw, 10);
  if (isNaN(jersey) || jersey < 0 || jersey > 99) {
    showMessage('create-message', 'Jersey number must be between 0 and 99.', 'error');
    return;
  }

  var characterParts = characterEl.value.split('|');
  var selectedCharacter = {
    id: characterParts[0],
    image: characterParts[1]
  };
  var player = buildPlayer(name, positionEl.value, archetypeEl.value, styleEl.value, jersey, selectedCharacter, schoolValue);
  if (schoolValue) player.team = schoolValue;
  normalizePlayer(player);
  currentPlayer = player;
  saveCareer(currentPlayer);
  updateDashboard(currentPlayer);
  showScreen('dashboard-screen');

  // Welcome story event
  addStoryEvent(
    'Your Legacy Begins',
    'You enter your senior season with everything to prove.',
    'Train, play games, and build your name.'
  );
});

/* ════════════════════════════════════════════════════
   9. DASHBOARD ACTION BUTTONS  (v0.2 — new)
   ════════════════════════════════════════════════════ */

/* ── Train ── */
document.getElementById('train-btn').addEventListener('click', function() {
  if (!currentPlayer) return;
  if (currentPlayer.energy < 15) {
    showDashboardMessage('Not enough energy to train. Rest first.', 'error');
    return;
  }

  var statKeys   = ['shooting', 'finishing', 'handles', 'defense', 'iq', 'athleticism'];
  var pickedStat = statKeys[Math.floor(Math.random() * statKeys.length)];
  var gain       = Math.floor(Math.random() * 3) + 1; // 1–3

  currentPlayer.energy               = clamp(currentPlayer.energy - 15, 0, 100);
  currentPlayer.stats[pickedStat]    = clamp(currentPlayer.stats[pickedStat] + gain, 1, 99);
  currentPlayer.draftStock           = clamp(currentPlayer.draftStock + Math.floor(Math.random() * 3) + 1, 0, 150);
  currentPlayer.legacyScore         += 1;

  recalculateOverall(currentPlayer);
  saveCareer(currentPlayer);
  updateDashboard(currentPlayer);

  var statLabel = pickedStat.charAt(0).toUpperCase() + pickedStat.slice(1);
  addStoryEvent(
    'Training Session',
    'You put in extra work after practice.',
    '+' + gain + ' ' + statLabel + '  ·  -15 Energy'
  );
});

/* ── Play Game ── */
document.getElementById('play-game-btn').addEventListener('click', function() {
  if (!currentPlayer) return;
  if (currentPlayer.energy < 25) {
    showDashboardMessage('Not enough energy to play. Rest first.', 'error');
    return;
  }

  // Performance based on overall + randomness
  var basePoints  = Math.floor((currentPlayer.overall / 99) * 25) + 5;
  var points      = clamp(basePoints + Math.floor(Math.random() * 16) - 5, 0, 55);
  var win         = Math.random() < 0.4 + (currentPlayer.overall / 99) * 0.35;
  var followerGain = Math.floor(points * 18) + Math.floor(Math.random() * 200);
  var stockGain   = Math.floor(points / 8) + (win ? 2 : 0);

  currentPlayer.energy      = clamp(currentPlayer.energy - 25, 0, 100);
  currentPlayer.gamesPlayed += 1;
  currentPlayer.totalPoints += points;
  currentPlayer.ppg          = currentPlayer.totalPoints / currentPlayer.gamesPlayed;
  if (win) { currentPlayer.wins   += 1; } else { currentPlayer.losses += 1; }
  currentPlayer.followers   = clamp(currentPlayer.followers + followerGain, 0, 99999999);
  currentPlayer.draftStock  = clamp(currentPlayer.draftStock + stockGain, 0, 150);
  currentPlayer.legacyScore += win ? 5 : 2;
  currentPlayer.money       += Math.floor(Math.random() * 50) + 10;

  // Bump reputation at thresholds
  if (currentPlayer.gamesPlayed >= 10 && currentPlayer.reputation === 'Unknown')
    currentPlayer.reputation = 'Known Locally';
  if (currentPlayer.followers >= 5000)
    currentPlayer.reputation = 'Regional Star';
  if (currentPlayer.followers >= 50000)
    currentPlayer.reputation = 'National Buzz';

  recalculateOverall(currentPlayer);
  saveCareer(currentPlayer);
  updateDashboard(currentPlayer);

  addStoryEvent(
    'Game Night',
    'You took the floor for another high school matchup.',
    'Scored ' + points + ' pts · Team ' + (win ? 'WON' : 'lost') + ' · +' + formatFollowers(followerGain) + ' followers'
  );
});

/* ── Rest ── */
document.getElementById('rest-btn').addEventListener('click', function() {
  if (!currentPlayer) return;

  currentPlayer.energy = clamp(currentPlayer.energy + 25, 0, 100);

  saveCareer(currentPlayer);
  updateDashboard(currentPlayer);

  addStoryEvent(
    'Recovery Day',
    'You took time to recover and reset.',
    '+25 Energy'
  );
});

/* ── Social Media ── */
document.getElementById('social-media-btn').addEventListener('click', function() {
  if (!currentPlayer) return;
  if (currentPlayer.energy < 10) {
    showDashboardMessage('Not enough energy for social media. Rest first.', 'error');
    return;
  }

  var gain = Math.floor(Math.random() * 700) + 100; // 100–800
  currentPlayer.energy     = clamp(currentPlayer.energy - 10, 0, 100);
  currentPlayer.followers  = clamp(currentPlayer.followers + gain, 0, 99999999);
  currentPlayer.brandValue += 1;

  saveCareer(currentPlayer);
  updateDashboard(currentPlayer);

  addStoryEvent(
    'Social Media Push',
    'You posted highlights and connected with fans.',
    '+' + formatFollowers(gain) + ' followers  ·  -10 Energy'
  );
});

/* ── Buy Gear ── */
document.getElementById('buy-gear-btn').addEventListener('click', function() {
  if (!currentPlayer) return;
  if (currentPlayer.money < 100) {
    showDashboardMessage('Not enough money to buy gear.', 'error');
    return;
  }

  var statGain = Math.floor(Math.random() * 2) + 1;
  currentPlayer.money                 -= 100;
  currentPlayer.stats.athleticism      = clamp(currentPlayer.stats.athleticism + statGain, 1, 99);
  currentPlayer.followers              = clamp(currentPlayer.followers + 150, 0, 99999999);

  recalculateOverall(currentPlayer);
  saveCareer(currentPlayer);
  updateDashboard(currentPlayer);

  addStoryEvent(
    'New Gear',
    'You upgraded your look and confidence.',
    '-$100  ·  +' + statGain + ' Athleticism  ·  +150 followers'
  );
});

/* ── Invest Money ── */
document.getElementById('invest-money-btn').addEventListener('click', function() {
  if (!currentPlayer) return;
  if (currentPlayer.money < 250) {
    showDashboardMessage('You need at least $250 to invest.', 'error');
    return;
  }

  currentPlayer.money        -= 250;
  currentPlayer.investments  += 250;
  currentPlayer.brandValue   += 2;

  saveCareer(currentPlayer);
  updateDashboard(currentPlayer);

  addStoryEvent(
    'Smart Investment',
    'You put money aside for your future.',
    '-$250 cash  ·  +$250 invested  ·  +2 brand value'
  );
});

/* ── Build Brand ── */
document.getElementById('build-brand-btn').addEventListener('click', function() {
  if (!currentPlayer) return;
  if (currentPlayer.energy < 20) {
    showDashboardMessage('Not enough energy to build brand. Rest first.', 'error');
    return;
  }

  var brandGain    = Math.floor(Math.random() * 4) + 2;  // 2–5
  var followerGain = Math.floor(Math.random() * 800) + 200; // 200–1000

  currentPlayer.energy      = clamp(currentPlayer.energy - 20, 0, 100);
  currentPlayer.brandValue += brandGain;
  currentPlayer.followers  = clamp(currentPlayer.followers + followerGain, 0, 99999999);

  // Endorsement unlock at 5000+ followers
  if (currentPlayer.followers >= 5000 && currentPlayer.endorsements === 0) {
    currentPlayer.endorsements += 1;
    addStoryEvent(
      'First Endorsement!',
      'A local brand reached out after seeing your growth.',
      'Endorsement deal unlocked. +$200'
    );
    currentPlayer.money += 200;
  }

  saveCareer(currentPlayer);
  updateDashboard(currentPlayer);

  addStoryEvent(
    'Brand Work',
    'You spent time building your personal brand.',
    '+' + brandGain + ' brand value  ·  +' + formatFollowers(followerGain) + ' followers  ·  -20 Energy'
  );
});

/* ════════════════════════════════════════════════════
   10. WEEKLY PROGRESSION  (v0.2 — new)
   ════════════════════════════════════════════════════ */

/* ── triggerWeeklyEvent ── */
function triggerWeeklyEvent(player) {
  var events = [
    {
      title:  'Scout in the Stands',
      body:   'A college scout attended your last practice.',
      result: '+5 Draft Stock',
      apply:  function(p) { p.draftStock = clamp(p.draftStock + 5, 0, 150); }
    },
    {
      title:  'Viral Clip',
      body:   'A highlight of yours blew up online.',
      result: '+1,000 followers',
      apply:  function(p) { p.followers = clamp(p.followers + 1000, 0, 99999999); }
    },
    {
      title:  'Tough Practice',
      body:   'Coach pushed the team hard this week.',
      result: '+1 random stat  ·  -10 Energy',
      apply:  function(p) {
        var keys = ['shooting','finishing','handles','defense','iq','athleticism'];
        var k = keys[Math.floor(Math.random() * keys.length)];
        p.stats[k] = clamp(p.stats[k] + 1, 1, 99);
        p.energy   = clamp(p.energy - 10, 0, 100);
      }
    },
    {
      title:  'Minor Soreness',
      body:   'Your body needed more rest than expected.',
      result: '-10 Energy',
      apply:  function(p) { p.energy = clamp(p.energy - 10, 0, 100); }
    },
    {
      title:  "Coach's Praise",
      body:   'Your coach called you out for your effort this week.',
      result: '+3 Legacy Score  ·  +2 Draft Stock',
      apply:  function(p) { p.legacyScore += 3; p.draftStock = clamp(p.draftStock + 2, 0, 150); }
    },
    {
      title:  'Quiet Week',
      body:   'Not much happened — but you stayed focused.',
      result: '+5 Energy',
      apply:  function(p) { p.energy = clamp(p.energy + 5, 0, 100); }
    }
  ];

  var evt = events[Math.floor(Math.random() * events.length)];
  evt.apply(player);
  addStoryEvent(evt.title, evt.body, evt.result);
}

/* ── endSeason ── */
function endSeason(player) {
  player.week = 1;
  addStoryEvent(
    'Season Complete',
    'Your senior season is over. Recruiting and next-step decisions are coming soon.',
    'Final Record: ' + player.wins + '-' + player.losses + '  ·  Draft Stock: ' + formatDraftStock(player.draftStock)
  );
}

/* ── Advance Week button ── */
document.getElementById('advance-week-btn').addEventListener('click', function() {
  if (!currentPlayer) return;

  if (currentPlayer.week >= currentPlayer.maxWeeks) {
    endSeason(currentPlayer);
  } else {
    currentPlayer.week += 1;
    // Small energy recovery per week
    currentPlayer.energy = clamp(currentPlayer.energy + 10, 0, 100);
    triggerWeeklyEvent(currentPlayer);
  }

  recalculateOverall(currentPlayer);
  saveCareer(currentPlayer);
  updateDashboard(currentPlayer);
});

/* ════════════════════════════════════════════════════
   11. MANAGEMENT BUTTONS  (v0.2 — new, reset updated)
   ════════════════════════════════════════════════════ */

/* ── Save Career ── */
document.getElementById('save-career-btn').addEventListener('click', function() {
  if (!currentPlayer) return;
  saveCareer(currentPlayer);
  showDashboardMessage('Career saved.', '');
});

/* ── Back to Title from Dashboard ── */
document.getElementById('back-to-title-from-dashboard-btn').addEventListener('click', function() {
  if (currentPlayer) saveCareer(currentPlayer);
  showScreen('title-screen');
});

/* ── Reset Career (button moved to management panel, behavior same as v0.1) ── */
document.getElementById('reset-career-btn').addEventListener('click', function() {
  if (!window.confirm('Reset your career? All progress will be lost.')) return;
  try { localStorage.removeItem(SAVE_KEY); } catch(e) {}
  currentPlayer = null;
  resetCreateForm();
  showScreen('title-screen');
  clearMessage('title-message');
});

/* ════════════════════════════════════════════════════
   12. INIT  (v0.1 base, updated for v0.2)
   ════════════════════════════════════════════════════ */
(function init() {
  showScreen('title-screen');
  renderSchoolOptions();
   
  var saved = loadCareer();
  if (saved) {
    showMessage(
      'title-message',
      'Career found: ' + saved.name + ' · #' + saved.jerseyNumber,
      ''
    );
  }
})();
