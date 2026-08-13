const initBackgroundSlides = () => {
  document.querySelectorAll('.hero-slide').forEach((slideSection) => {
    const slides = Array.from(slideSection.querySelectorAll('.slide'));
    let current = 0;

    const nextSlide = () => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    };

    setInterval(nextSlide, 5000);
  });
};

const initImageSlider = () => {
  document.querySelectorAll('.image-slider').forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.image-slide'));
    if (!slides.length) return;
    let current = slides.findIndex(s => s.classList.contains('active'));
    if (current === -1) current = 0;

    const nextSlide = () => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    };

    setInterval(nextSlide, 5000);
  });
};

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

const openModalById = (modalId) => {
  if (!modalId) return;
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
};

const initModalTriggers = () => {
  document.querySelectorAll('.modal-trigger').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.dataset.modal || (trigger.getAttribute('href') || '').replace('#', '');
      if (!modalId) return;

      const isHomePage = window.location.pathname.toLowerCase().endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '';
      if (!isHomePage) {
        window.location.href = `index.html?modal=${modalId}`;
        return;
      }

      openModalById(modalId);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));
  });
};

const initQuoteForm = () => {
  const quoteForm = document.getElementById('quoteForm');
  const fileInput = document.getElementById('quoteAttachments');
  const fileInfo = document.querySelector('.file-info');
  const fileButton = document.querySelector('.file-button');
  const maxTotalBytes = 25 * 1024 * 1024;

  if (!quoteForm) return;

  if (fileButton && fileInput) {
    fileButton.addEventListener('click', () => fileInput.click());
  }

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const files = Array.from(fileInput.files || []);
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);

      if (totalSize > maxTotalBytes) {
        alert('Please keep attachments to 25MB or less.');
        fileInput.value = '';
        if (fileInfo) fileInfo.textContent = 'Up to 25 MB';
        return;
      }

      if (fileInfo) {
        fileInfo.textContent = files.length
          ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
          : 'Up to 25 MB';
      }
    });
  }

  const quoteNumberKey = 'schcad_quote_counter';
  let nextQuoteNumber = Number(localStorage.getItem(quoteNumberKey) || 1000);

  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(quoteForm);
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const location = formData.get('location')?.toString().trim();
    const message = formData.get('message')?.toString().trim();
    const attachments = fileInput ? Array.from(fileInput.files || []) : [];

    if (!name || !email || !phone || !location || !message) {
      alert('Please fill in all fields before sending.');
      return;
    }

    const totalSize = attachments.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > maxTotalBytes) {
      alert('Please keep attachments to 25MB or less.');
      return;
    }

    const attachmentText = attachments.length
      ? `Attachments: ${attachments.map((file) => file.name).join(', ')}\n\n`
      : '';

    const subjectText = `QT_${nextQuoteNumber} - ${name}`;
    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent(
      `${attachmentText}Name/Company Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nLocation/City: ${location}\nMessage:\n${message}`
    );

    localStorage.setItem(quoteNumberKey, String(nextQuoteNumber + 1));
    nextQuoteNumber += 1;
    window.location.href = `mailto:hello.schcad@hotmail.com?subject=${subject}&body=${body}`;
  });
};

const initProjectsGallery = () => {
  const lightbox = document.querySelector('.project-lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const closeButton = lightbox?.querySelector('.lightbox-close');
  const prevButton = lightbox?.querySelector('.lightbox-prev');
  const nextButton = lightbox?.querySelector('.lightbox-next');

  if (!lightbox || !lightboxImage || !closeButton || !prevButton || !nextButton) return;

  // Image lists discovered in the workspace. Drawings and renders folders.
  const galleries = {
    drawings: [
      'Images/Project images/drawings/Standard Details (B) 9.jpg',
      'Images/Project images/drawings/Standard Details (B) 8.jpg',
      'Images/Project images/drawings/Standard Details (B) 7.jpg',
      'Images/Project images/drawings/Standard Details (B) 6.jpg',
      'Images/Project images/drawings/Standard Details (B) 5.jpg',
      'Images/Project images/drawings/Standard Details (B) 4.jpg',
      'Images/Project images/drawings/Standard Details (B) 3.jpg',
      'Images/Project images/drawings/Standard Details (B) 2.jpg',
      'Images/Project images/drawings/Standard Details (B) 15.jpg',
      'Images/Project images/drawings/Standard Details (B) 14.jpg',
      'Images/Project images/drawings/Standard Details (B) 13.jpg',
      'Images/Project images/drawings/Standard Details (B) 12.jpg',
      'Images/Project images/drawings/Standard Details (B) 11.jpg',
      'Images/Project images/drawings/Standard Details (B) 10.jpg',
      'Images/Project images/drawings/Standard Details (B) 1.jpg',
      'Images/Project images/drawings/Pots.jpg',
      'Images/Project images/drawings/MSLCP.jpg',
      'Images/Project images/drawings/MetroWest 9.jpg',
      'Images/Project images/drawings/MetroWest 8.jpg',
      'Images/Project images/drawings/MetroWest 7.jpg',
      'Images/Project images/drawings/MetroWest 6.jpg',
      'Images/Project images/drawings/MetroWest 5.jpg',
      'Images/Project images/drawings/MetroWest 4.jpg',
      'Images/Project images/drawings/MetroWest 3.jpg',
      'Images/Project images/drawings/MetroWest 2.jpg',
      'Images/Project images/drawings/MetroWest 1.jpg',
      'Images/Project images/drawings/BMW 2.jpg',
      'Images/Project images/drawings/BMW 1.jpg',
      'Images/Project images/drawings/101 Miller St 7.jpg',
      'Images/Project images/drawings/101 Miller St 6.jpg',
      'Images/Project images/drawings/101 Miller St 5.jpg',
      'Images/Project images/drawings/101 Miller St 4.jpg',
      'Images/Project images/drawings/101 Miller St 3.jpg',
      'Images/Project images/drawings/101 Miller St 2.jpg',
      'Images/Project images/drawings/101 Miller St 1.jpg'
    ],
    renders: [
      'Images/Project images/renders/INT PASILLO .jpg',
      'Images/Project images/renders/INT LIVING 03.jpg',
      'Images/Project images/renders/INT LIVING 02.jpg',
      'Images/Project images/renders/INT LIVING 01.jpg',
      'Images/Project images/renders/INT HALL 2.jpg',
      'Images/Project images/renders/INT HALL .jpg',
      'Images/Project images/renders/INT HAB 1.jpg',
      'Images/Project images/renders/INT COCINA 2.jpg',
      'Images/Project images/renders/INT CLOSEUP 4.jpg',
      'Images/Project images/renders/INT CLOSEUP 3.jpg',
      'Images/Project images/renders/Chadstone 7.jpg',
      'Images/Project images/renders/Chadstone 5.jpg',
      'Images/Project images/renders/Chadstone 3.jpg',
      'Images/Project images/renders/Chadstone 1.jpg',
      'Images/Project images/renders/Breathing Column 1.JPG',
      'Images/Project images/renders/37edit.jpg',
      'Images/Project images/renders/36edit.jpg',
      'Images/Project images/renders/32edit.jpg',
      'Images/Project images/renders/31edit.jpg',
      'Images/Project images/renders/30edit.jpg',
      'Images/Project images/renders/29edit.jpg',
      'Images/Project images/renders/27edit.jpg',
      'Images/Project images/renders/25edit.jpg',
      'Images/Project images/renders/24edit.jpg',
      'Images/Project images/renders/23edit.jpg',
      'Images/Project images/renders/22edit.jpg',
      'Images/Project images/renders/21edit.jpg',
      'Images/Project images/renders/19edit.jpg',
      'Images/Project images/renders/18edit.jpg',
      'Images/Project images/renders/17edit.jpg',
      'Images/Project images/renders/15edit.jpg',
      'Images/Project images/renders/01-CC-INT-CANTINA 3.jpg',
      'Images/Project images/renders/01-CC-INT-CANTINA 2.jpg',
      'Images/Project images/renders/01-CC-INT-CANTINA 1.jpg',
      'Images/Project images/renders/01-CC-EXT-QUINCHO 3.jpg',
      'Images/Project images/renders/01-CC-EXT-QUINCHO 2.jpg',
      'Images/Project images/renders/01-CC-EXT-INTER 4.jpg',
      'Images/Project images/renders/01-CC-EXT-INTER 2.jpg',
      'Images/Project images/renders/01-CC-EXT-CANTINA 2.jpg',
      'Images/Project images/renders/01-CC-EXT-CANTINA 1.jpg'
    ]
  };

  let currentGallery = null;
  let currentIndex = 0;

  const setLightboxImage = (index) => {
    const images = galleries[currentGallery] || [];
    if (!images.length) return;
    currentIndex = (index + images.length) % images.length;
    lightboxImage.src = images[currentIndex];
    lightboxImage.alt = images[currentIndex].split('/').pop();
  };

  const openLightbox = (galleryKey, startIndex = 0) => {
    if (!galleries[galleryKey] || !galleries[galleryKey].length) return;
    currentGallery = galleryKey;
    setLightboxImage(startIndex);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    currentGallery = null;
  };

  const moveLightbox = (offset) => {
    const images = galleries[currentGallery] || [];
    if (!images.length) return;
    setLightboxImage(currentIndex + offset);
  };

  // Wire up gallery buttons and previews
  document.querySelectorAll('.gallery-button').forEach((btn) => {
    const key = btn.dataset.gallery;
    const imgs = galleries[key] || [];
    const preview = btn.querySelector('.gallery-preview');
    if (imgs && imgs[0] && preview) preview.style.backgroundImage = `url('${imgs[0]}')`;
    btn.addEventListener('click', () => openLightbox(key, 0));
  });

  closeButton.addEventListener('click', closeLightbox);
  prevButton.addEventListener('click', () => moveLightbox(-1));
  nextButton.addEventListener('click', () => moveLightbox(1));

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') moveLightbox(-1);
    if (event.key === 'ArrowRight') moveLightbox(1);
  });
};

const initEmailLink = () => {
  const emailLink = document.getElementById('emailLink');
  if (!emailLink) return;

  const originalText = emailLink.textContent.trim();
  const originalTooltip = emailLink.dataset.tooltip || 'hello.schcad@hotmail.com';

  emailLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = 'hello.schcad@hotmail.com';

    navigator.clipboard.writeText(email).then(() => {
      emailLink.textContent = 'Email copied';
      emailLink.dataset.tooltip = 'Email copied';
      emailLink.classList.add('is-copied');
      setTimeout(() => {
        emailLink.textContent = originalText;
        emailLink.dataset.tooltip = originalTooltip;
        emailLink.classList.remove('is-copied');
      }, 1500);
    }).catch(() => {
      alert('Failed to copy email. Please try again.');
    });
  });
};

const initHomePageModal = () => {
  const params = new URLSearchParams(window.location.search);
  const modalId = params.get('modal');
  if (modalId) {
    openModalById(modalId);
  }
};

const initTaglineAnimation = () => {
  const taglines = document.querySelectorAll('.hero-tagline');
  if (taglines.length < 2) return;
  
  let currentIndex = 0;
  const displayDuration = 8000; // 8 seconds
  const fadeDuration = 2000; // 2 seconds for fade animation
  
  const rotateTagline = () => {
    // Remove active class from current tagline
    taglines[currentIndex].classList.remove('active');
    
    // Move to next tagline
    currentIndex = (currentIndex + 1) % taglines.length;
    
    // Add active class to new tagline
    taglines[currentIndex].classList.add('active');
  };
  
  // Rotate every 30 seconds (plus the fade animation time)
  setInterval(rotateTagline, displayDuration + fadeDuration);
};

initBackgroundSlides();
initImageSlider();
initModalTriggers();
initQuoteForm();
initProjectsGallery();
initEmailLink();
initHomePageModal();
initTaglineAnimation();
