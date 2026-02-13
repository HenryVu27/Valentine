/* ============================================
   Valentine's Day Interactive Website
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Section Management ---
  const sections = document.querySelectorAll('.section');
  let currentSection = 0;

  function showSection(index) {
    sections.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    currentSection = index;
  }

  function nextSection() {
    if (currentSection < sections.length - 1) {
      showSection(currentSection + 1);
    }
  }

  // Start with landing
  showSection(0);

  // --- Image Lazy Loading ---
  document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
      img.addEventListener('error', () => img.classList.add('loaded'));
    }
  });

  // ============================================
  // SECTION 1: ENVELOPE
  // ============================================
  const envelopeWrapper = document.querySelector('.envelope-wrapper');
  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', () => {
      if (envelopeWrapper.classList.contains('opened')) return;
      envelopeWrapper.classList.add('opened');
      setTimeout(() => nextSection(), 1200);
    });
  }

  // ============================================
  // SECTION 2: LOVE LETTER (TYPEWRITER)
  // ============================================
  const letterBody = document.querySelector('.letter-body');
  const letterText = letterBody ? letterBody.dataset.text : '';
  const letterPhoto = document.querySelector('.letter-photo');
  const letterContinue = document.querySelector('#letter .btn-continue');
  let typewriterStarted = false;

  function startTypewriter() {
    if (typewriterStarted || !letterBody) return;
    typewriterStarted = true;

    letterBody.innerHTML = '<span class="typewriter-cursor"></span>';
    let charIndex = 0;

    function typeChar() {
      if (charIndex < letterText.length) {
        const cursor = letterBody.querySelector('.typewriter-cursor');
        const textNode = document.createTextNode(letterText[charIndex]);
        letterBody.insertBefore(textNode, cursor);
        charIndex++;
        const delay = letterText[charIndex - 1] === '.' ? 200 :
                      letterText[charIndex - 1] === ',' ? 120 : 38;
        setTimeout(typeChar, delay);
      } else {
        // Typing done — show photo and continue button
        const cursor = letterBody.querySelector('.typewriter-cursor');
        if (cursor) {
          setTimeout(() => {
            cursor.style.opacity = '0';
            setTimeout(() => cursor.remove(), 500);
          }, 1500);
        }
        setTimeout(() => {
          if (letterPhoto) letterPhoto.classList.add('visible');
        }, 600);
        setTimeout(() => {
          if (letterContinue) letterContinue.classList.add('visible');
        }, 1200);
      }
    }

    setTimeout(typeChar, 800);
  }

  // Observe when letter section becomes active
  const letterSection = document.getElementById('letter');
  if (letterSection) {
    const observer = new MutationObserver(() => {
      if (letterSection.classList.contains('active')) {
        startTypewriter();
      }
    });
    observer.observe(letterSection, { attributes: true, attributeFilter: ['class'] });
  }

  if (letterContinue) {
    letterContinue.addEventListener('click', nextSection);
  }

  // ============================================
  // SECTION 3: FLOWER GARDEN
  // ============================================
  const flowerCards = document.querySelectorAll('.flower-card');
  const flowerModal = document.querySelector('.flower-modal');
  const flowerModalCard = document.querySelector('.flower-modal-card');
  const gardenComplete = document.querySelector('.garden-complete');
  const gardenProgress = document.querySelector('.garden-progress');
  let bloomedCount = 0;
  const totalFlowers = flowerCards.length;

  flowerCards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('bloomed')) {
        // Show modal with photo and reason
        showFlowerModal(card);
        return;
      }
      card.classList.add('bloomed');
      bloomedCount++;
      updateGardenProgress();

      // Show modal after bloom animation
      setTimeout(() => showFlowerModal(card), 400);
    });
  });

  function showFlowerModal(card) {
    if (!flowerModal) return;
    const reason = card.dataset.reason;
    const photo = card.dataset.photo;
    const modalReason = flowerModal.querySelector('.flower-modal-reason');
    const modalPhoto = flowerModal.querySelector('.flower-modal-photo');

    if (modalReason) modalReason.textContent = reason;
    if (modalPhoto) {
      modalPhoto.src = photo;
      modalPhoto.classList.remove('loaded');
      if (modalPhoto.complete) modalPhoto.classList.add('loaded');
      else modalPhoto.onload = () => modalPhoto.classList.add('loaded');
    }

    flowerModal.classList.add('active');
  }

  // Close modal
  if (flowerModal) {
    flowerModal.addEventListener('click', (e) => {
      if (e.target === flowerModal || e.target.classList.contains('flower-modal-close')) {
        flowerModal.classList.remove('active');
      }
    });
  }

  function updateGardenProgress() {
    if (gardenProgress) {
      gardenProgress.textContent = `${bloomedCount} of ${totalFlowers} flowers bloomed`;
    }
    if (bloomedCount >= totalFlowers && gardenComplete) {
      setTimeout(() => gardenComplete.classList.add('visible'), 500);
    }
  }

  const gardenContinue = document.querySelector('#garden .btn-continue');
  if (gardenContinue) {
    gardenContinue.addEventListener('click', nextSection);
  }

  // ============================================
  // SECTION 4: TREASURE HUNT
  // ============================================
  const huntCards = document.querySelectorAll('.hunt-card');
  const huntDots = document.querySelectorAll('.hunt-dot');
  let huntStep = 0;

  function showHuntStep(step) {
    huntCards.forEach((card, i) => {
      card.classList.remove('active', 'exiting');
      if (i === step) {
        setTimeout(() => card.classList.add('active'), 50);
      } else if (i < step) {
        card.classList.add('exiting');
      }
    });
    huntDots.forEach((dot, i) => {
      dot.classList.remove('active', 'completed');
      if (i === step) dot.classList.add('active');
      else if (i < step) dot.classList.add('completed');
    });
    huntStep = step;
  }

  // "Found it!" buttons
  document.querySelectorAll('.btn-hunt-found').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.hunt-card');
      const response = card.querySelector('.hunt-card-response');
      const nextBtn = card.querySelector('.btn-hunt-next');

      if (response) {
        response.classList.add('visible');
      }
      btn.style.display = 'none';
      if (nextBtn) {
        setTimeout(() => nextBtn.classList.add('visible'), 600);
      }
    });
  });

  // Next step buttons
  document.querySelectorAll('.btn-hunt-next').forEach(btn => {
    btn.addEventListener('click', () => {
      showHuntStep(huntStep + 1);
    });
  });

  // Passcode input (Step 3)
  const huntInput = document.querySelector('.hunt-input');
  const huntSubmit = document.querySelector('.hunt-submit');
  if (huntSubmit && huntInput) {
    const submitAnswer = () => {
      const answer = huntInput.value.trim().toLowerCase();
      if (answer === 'lime') {
        // Correct!
        const card = huntInput.closest('.hunt-card');
        const response = card.querySelector('.hunt-card-response');
        if (response) {
          response.textContent = 'Yes! You got it! 🎉';
          response.classList.add('visible');
        }
        huntInput.disabled = true;
        huntSubmit.disabled = true;
        const nextBtn = card.querySelector('.btn-hunt-next');
        if (nextBtn) {
          setTimeout(() => nextBtn.classList.add('visible'), 600);
        }
      } else {
        // Wrong
        huntInput.classList.add('shake');
        const card = huntInput.closest('.hunt-card');
        const response = card.querySelector('.hunt-card-response');
        if (response) {
          response.textContent = 'Look again! 👀';
          response.classList.add('visible');
        }
        setTimeout(() => huntInput.classList.remove('shake'), 500);
        huntInput.value = '';
        huntInput.focus();
      }
    };

    huntSubmit.addEventListener('click', submitAnswer);
    huntInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitAnswer();
    });
  }

  // Final reveal (Step 4) — trigger confetti
  const huntSection = document.getElementById('hunt');
  if (huntSection) {
    const observer = new MutationObserver(() => {
      const finalCard = huntCards[huntCards.length - 1];
      if (finalCard && finalCard.classList.contains('active')) {
        setTimeout(() => launchConfetti(), 400);
      }
    });
    // Observe the last hunt card for class changes
    if (huntCards.length > 0) {
      observer.observe(huntCards[huntCards.length - 1], { attributes: true, attributeFilter: ['class'] });
    }
  }

  // Hunt → Roulette continue
  const huntContinue = document.querySelector('#hunt .btn-hunt-continue');
  if (huntContinue) {
    huntContinue.addEventListener('click', nextSection);
  }

  // Initialize first hunt step
  const huntSectionEl = document.getElementById('hunt');
  if (huntSectionEl) {
    const obs = new MutationObserver(() => {
      if (huntSectionEl.classList.contains('active')) {
        showHuntStep(0);
      }
    });
    obs.observe(huntSectionEl, { attributes: true, attributeFilter: ['class'] });
  }

  // ============================================
  // SECTION 5: RESTAURANT ROULETTE
  // ============================================
  const canvas = document.querySelector('.wheel-canvas');
  const spinBtn = document.querySelector('.btn-spin');
  const resultText = document.querySelector('.roulette-result');

  const restaurants = [
    'Doma Seolleongtang',
    'Sushi Masa',
    'Shoo Loong Kan',
    'Ham Ji Bak',
    "Thai's Thumbz",
    'Maht Gaek'
  ];

  const segmentColors = [
    '#F4A0B5', // Pink
    '#F5EDE3', // Beige
    '#F8D0D8', // Blush
    '#D4A574', // Gold
    '#C77D8A', // Deep Rose
    '#FFF8F0'  // Cream
  ];

  const segmentTextColors = [
    '#FFFFFF',
    '#5C4033',
    '#5C4033',
    '#FFFFFF',
    '#FFFFFF',
    '#5C4033'
  ];

  let currentRotation = 0;
  let isSpinning = false;
  const WINNER_INDEX = 0; // Doma Seolleongtang

  function drawWheel(ctx, size) {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 8;
    const segmentAngle = (2 * Math.PI) / restaurants.length;

    // Apply current rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((currentRotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    restaurants.forEach((name, i) => {
      const startAngle = i * segmentAngle - Math.PI / 2;
      const endAngle = startAngle + segmentAngle;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = segmentColors[i];
      ctx.fill();

      // Segment border
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.fillStyle = segmentTextColors[i];
      ctx.font = `600 ${size < 300 ? '11' : '13'}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Break long names into two lines
      const words = name.split(' ');
      if (words.length > 1 && name.length > 10) {
        const mid = Math.ceil(words.length / 2);
        const line1 = words.slice(0, mid).join(' ');
        const line2 = words.slice(mid).join(' ');
        ctx.fillText(line1, radius * 0.6, -7);
        ctx.fillText(line2, radius * 0.6, 9);
      } else {
        ctx.fillText(name, radius * 0.6, 0);
      }
      ctx.restore();
    });

    // Outer ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(212, 165, 116, 0.6)';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.restore();
  }

  function initWheel() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    drawWheel(ctx, rect.width);
  }

  function spinWheel() {
    if (isSpinning || !canvas) return;
    isSpinning = true;
    if (spinBtn) spinBtn.disabled = true;
    if (resultText) {
      resultText.classList.remove('visible');
      resultText.textContent = '';
    }

    const segmentAngle = 360 / restaurants.length;
    // Calculate where winner segment needs to land (at the top/pointer)
    // Pointer is at top (270 degrees in standard math, or 0 in our rotated system)
    // Segment 0 starts at top and goes clockwise
    // To land on segment 0, the middle of segment 0 should be at the pointer
    const winnerCenter = WINNER_INDEX * segmentAngle + segmentAngle / 2;
    // We want the pointer (at top = 0deg) to point to the winner
    // Final rotation: 360 - winnerCenter (to bring winner to top)
    const targetOffset = 360 - winnerCenter;

    // Randomize: 5-8 full spins + target offset + small random variance within the winning segment
    const fullSpins = (5 + Math.floor(Math.random() * 4)) * 360;
    const variance = (Math.random() - 0.5) * (segmentAngle * 0.6); // Stay within segment
    const totalRotation = fullSpins + targetOffset + variance;

    const startRotation = currentRotation;
    const endRotation = startRotation + totalRotation;
    const duration = 4000 + Math.random() * 1000;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for realistic deceleration
      const eased = 1 - Math.pow(1 - progress, 3);

      currentRotation = startRotation + totalRotation * eased;

      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const size = canvas.width / dpr;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      drawWheel(ctx, size);
      ctx.restore();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        currentRotation = endRotation % 360;
        isSpinning = false;
        if (spinBtn) spinBtn.disabled = false;

        // Show result
        if (resultText) {
          resultText.textContent = `${restaurants[WINNER_INDEX]}! It's a date! 🎉`;
          resultText.classList.add('visible');
        }
        launchConfetti();
      }
    }

    requestAnimationFrame(animate);
  }

  if (spinBtn) {
    spinBtn.addEventListener('click', spinWheel);
  }

  // Init wheel when roulette section becomes active
  const rouletteSection = document.getElementById('roulette');
  if (rouletteSection) {
    const obs = new MutationObserver(() => {
      if (rouletteSection.classList.contains('active')) {
        setTimeout(initWheel, 100);
      }
    });
    obs.observe(rouletteSection, { attributes: true, attributeFilter: ['class'] });
  }

  // Handle resize
  window.addEventListener('resize', () => {
    if (rouletteSection && rouletteSection.classList.contains('active')) {
      initWheel();
    }
  });

  // ============================================
  // CONFETTI
  // ============================================
  function launchConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#F4A0B5', '#F8D0D8', '#D4A574', '#C77D8A', '#F5EDE3', '#ff6b8a', '#ffb3c6'];
    const shapes = ['square', 'circle'];

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = 6 + Math.random() * 8;

      piece.style.left = `${Math.random() * 100}%`;
      piece.style.width = `${size}px`;
      piece.style.height = `${shape === 'circle' ? size : size * 1.5}px`;
      piece.style.background = color;
      piece.style.borderRadius = shape === 'circle' ? '50%' : '2px';
      piece.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      piece.style.animationDelay = `${Math.random() * 0.5}s`;

      container.appendChild(piece);
    }

    setTimeout(() => container.remove(), 5000);
  }
});
