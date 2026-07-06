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

const initRotatingWords = () => {
  const words = [
    'Take-offs',
    'Design Drawings',
    'Shop Drawings',
    'Manufacturing Drawings',
    'Construction Drawings',
    'As Builts',
    '3D visualization'
  ];
  const textElement = document.querySelector('.rotating-word');
  if (!textElement) return;

  let current = 0;

  const updateWord = () => {
    textElement.classList.remove('visible');
    textElement.classList.add('hidden');

    setTimeout(() => {
      textElement.textContent = words[current];
      textElement.classList.remove('hidden');
      textElement.classList.add('visible');
      current = (current + 1) % words.length;
    }, 400);
  };

  updateWord();
  setInterval(updateWord, 5000);
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

const initBottomPanels = () => {
  document.querySelectorAll('.bottom-panel').forEach((panel) => {
    const button = panel.querySelector('.panel-action');
    const content = panel.querySelector('.panel-content');

    if (!button || !content) return;

    // store original label for restoration
    if (!button.dataset.origLabel) button.dataset.origLabel = button.textContent.trim();

    button.addEventListener('click', () => {
      const isActive = panel.classList.toggle('active');
      button.classList.toggle('active', isActive);
      content.classList.toggle('visible', isActive);

      if (isActive) {
        button.textContent = '✕';
        button.setAttribute('aria-label', 'Close');
      } else {
        button.textContent = button.dataset.origLabel;
        button.setAttribute('aria-label', button.dataset.origLabel || 'Open');
      }
    });
  });
};

const initProjectsGallery = () => {
  const gallery = document.querySelector('.projects-banner-track');
  const lightbox = document.querySelector('.project-lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const closeButton = lightbox?.querySelector('.lightbox-close');
  const prevButton = lightbox?.querySelector('.lightbox-prev');
  const nextButton = lightbox?.querySelector('.lightbox-next');

  if (!gallery || !lightbox || !lightboxImage || !closeButton || !prevButton || !nextButton) return;

  const imageFiles = [
    '101 Miller St 1.jpg',
    '101 Miller St 2.jpg',
    '101 Miller St 3.jpg',
    '101 Miller St 4.jpg',
    '101 Miller St 5.jpg',
    '101 Miller St 6.jpg',
    '101 Miller St 7.jpg',
    'BMW 1.jpg',
    'BMW 2.jpg',
    'Breathing Column 1.JPG',
    'Chadstone 1.jpg',
    'Chadstone 3.jpg',
    'Chadstone 5.jpg',
    'Chadstone 7.jpg',
    'MetroWest 1.jpg',
    'MetroWest 2.jpg',
    'MetroWest 3.jpg',
    'MetroWest 4.jpg',
    'MetroWest 5.jpg',
    'MetroWest 6.jpg',
    'MetroWest 7.jpg',
    'MetroWest 8.jpg',
    'MetroWest 9.jpg',
    'MSLCP.jpg',
    'Pots.jpg',
    'Standard Details (B) 1.jpg',
    'Standard Details (B) 10.jpg',
    'Standard Details (B) 11.jpg',
    'Standard Details (B) 12.jpg',
    'Standard Details (B) 13.jpg',
    'Standard Details (B) 14.jpg',
    'Standard Details (B) 15.jpg',
    'Standard Details (B) 2.jpg',
    'Standard Details (B) 3.jpg',
    'Standard Details (B) 4.jpg',
    'Standard Details (B) 5.jpg',
    'Standard Details (B) 6.jpg',
    'Standard Details (B) 7.jpg',
    'Standard Details (B) 8.jpg',
    'Standard Details (B) 9.jpg'
  ];

  const projectImages = imageFiles.map((file) => ({
    src: `Images/Project images/${file}`,
    alt: file.replace(/\.[^/.]+$/, '')
  }));

  gallery.innerHTML = '';
  const duplicatedImages = [...projectImages, ...projectImages];
  duplicatedImages.forEach((image, index) => {
    const slide = document.createElement('button');
    slide.type = 'button';
    slide.className = 'projects-banner-slide';
    slide.dataset.index = String(index % projectImages.length);
    slide.innerHTML = `<img src="${image.src}" alt="${image.alt}">`;
    gallery.appendChild(slide);
  });

  let currentIndex = 0;
  const totalCount = projectImages.length;

  const setLightboxImage = (index) => {
    currentIndex = index;
    lightboxImage.src = projectImages[currentIndex].src;
    lightboxImage.alt = projectImages[currentIndex].alt;
  };

  const openLightbox = (index) => {
    setLightboxImage(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  };

  const moveLightbox = (offset) => {
    const nextIndex = (currentIndex + offset + totalCount) % totalCount;
    setLightboxImage(nextIndex);
  };

  gallery.addEventListener('click', (event) => {
    const slide = event.target.closest('.projects-banner-slide');
    if (!slide) return;
    openLightbox(Number(slide.dataset.index));
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

initBackgroundSlides();
initRotatingWords();
initImageSlider();
initModalTriggers();
initQuoteForm();
initBottomPanels();
initProjectsGallery();
initEmailLink();
initHomePageModal();
