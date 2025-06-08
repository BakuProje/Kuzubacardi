function initParticles() {
  // Cek apakah device mobile
  const isMobile = window.innerWidth < 768;
  
  // Jika mobile, tidak perlu inisialisasi canvas
  if (isMobile) return;
  
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const particles = [];
  const particleCount = 50;
  
  function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  updateCanvasSize();
  
  // Throttle resize event
  let resizeTimeout;
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateCanvasSize, 100);
  });

  // Inisialisasi particles dengan ukuran yang lebih kecil untuk mobile
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 0.3 : 0.5),
      vy: (Math.random() - 0.5) * (window.innerWidth < 768 ? 0.3 : 0.5),
      size: Math.random() * (window.innerWidth < 768 ? 1.5 : 2) + 1,
      opacity: Math.random() * 0.3 + 0.2
    });
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16, 185, 129, ${particle.opacity})`;
      ctx.fill();
    });
    
    animationFrameId = requestAnimationFrame(animate);
  }
  
  // Pause animation when page is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animate();
    }
  });
  
  animate();
}

initParticles();

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMobileMenu = document.getElementById('close-mobile-menu');

function toggleMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const isOpen = mobileMenu.classList.contains('translate-y-0');
  
  if (isOpen) {
    mobileMenu.classList.remove('translate-y-0');
    mobileMenu.classList.add('-translate-y-full');
    document.body.style.overflow = '';
  } else {
    mobileMenu.classList.remove('-translate-y-full');
    mobileMenu.classList.add('translate-y-0');
    document.body.style.overflow = 'hidden';
  }
}

document.getElementById('mobile-menu-btn').addEventListener('click', toggleMenu);
document.getElementById('close-mobile-menu').addEventListener('click', toggleMenu);

document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', toggleMenu);
});

let touchStartY = 0;
let touchEndY = 0;

document.getElementById('mobile-menu').addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
});

document.getElementById('mobile-menu').addEventListener('touchmove', e => {
  touchEndY = e.touches[0].clientY;
  
  if (touchStartY - touchEndY > 50) {
    toggleMenu();
  }
});

document.getElementById('mobile-menu').addEventListener('click', e => {
  if (e.target.classList.contains('mobile-menu')) {
    toggleMenu();
  }
});

function copyText(text, label = "Teks") {
  navigator.clipboard.writeText(text).then(() => {
    showNotification(`${label} berhasil disalin!`);
  }).catch(() => {
    fallbackCopy(text);
  });
}

function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showNotification("Teks berhasil disalin!");
  } catch (err) {
    console.error('Failed to copy text');
  }
  document.body.removeChild(textArea);
}

function showNotification(message) {
  const notification = document.getElementById('copy-notification');
  notification.style.transform = 'translateX(0)';
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
  }, 2000);
}

const btnConnect = document.getElementById("btn-connect");
btnConnect.addEventListener("click", () => {
  const CONNECTSection = document.querySelector('#CONNECT');
  const navHeight = document.querySelector('nav').offsetHeight;
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  document.querySelector('#nav-CONNECT').classList.add('active');
  
  CONNECTSection.style.transition = 'box-shadow 0.3s ease';
  CONNECTSection.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.3)';
  
  const targetPosition = CONNECTSection.offsetTop - navHeight - 20;
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
  
  btnConnect.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.5)';
  
  setTimeout(() => {
    CONNECTSection.style.boxShadow = 'none';
    btnConnect.style.boxShadow = '';
  }, 1000);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});


function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const observerOptions = {
  threshold: 0.1,
  rootMargin: '50px',
};

const handleIntersection = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      requestAnimationFrame(() => {
        entry.target.classList.add('animate');
      });
      observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(handleIntersection, observerOptions);


const smoothScroll = (target, duration) => {
  const targetPosition = target.getBoundingClientRect().top;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const animation = currentTime => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  const ease = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  requestAnimationFrame(animation);
};

function updateProgressBar(element) {
  const value = parseInt(element.getAttribute('data-value'));
  const max = parseInt(element.closest('.group').getAttribute('data-max'));
  const percentage = (value / max) * 100;
  const progressBar = element.closest('.group').querySelector('.progress-bar');
  progressBar.style.width = `${percentage}%`;
}

document.querySelectorAll('.stat-value').forEach(updateProgressBar);

function updateStat(selector, newValue) {
  const statElement = document.querySelector(selector);
  if (statElement) {
    statElement.textContent = newValue;
    statElement.setAttribute('data-value', newValue);
    updateProgressBar(statElement);
  }
}


function updateActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navHeight = document.querySelector('nav').offsetHeight;
  const scrollPosition = window.scrollY + navHeight + 100;

  let currentSection = null;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - navHeight;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
      currentSection = section;
    }
  });

  if (currentSection) {
    const sectionId = currentSection.getAttribute('id');
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
  }
}

let lastScrollTime = 0;
const scrollThrottle = 100;

window.addEventListener('scroll', () => {
  const now = Date.now();
  
  if (now - lastScrollTime >= scrollThrottle) {
    lastScrollTime = now;
  updateActiveSection();
  }
});

document.querySelectorAll('.social-button-fixed').forEach(button => {
  button.addEventListener('mouseover', function() {
    this.style.transform = 'translateY(-5px)';
  });
  
  button.addEventListener('mouseout', function() {
    this.style.transform = 'translateY(0)';
  });
});

let videoList = [
  './img/video1.mp4',
  './img/video2.mp4',
  './img/video3.mp4'
];
let currentVideo = 0;
const carouselVideo = document.getElementById('carousel-video');
const prevBtn = document.getElementById('prev-video');
const nextBtn = document.getElementById('next-video');

function showVideo(idx) {
  if (videoList.length === 0) return;
  
  carouselVideo.style.opacity = '0';
  
    setTimeout(() => {
    currentVideo = (idx + videoList.length) % videoList.length;
    
    while (carouselVideo.firstChild) {
      carouselVideo.removeChild(carouselVideo.firstChild);
    }
    
    const videoSource = document.createElement('source');
    videoSource.src = videoList[currentVideo];
    videoSource.type = 'video/mp4';
    carouselVideo.appendChild(videoSource);
    
    carouselVideo.loop = true;
    carouselVideo.muted = !galleryPopup || galleryPopup.classList.contains('opacity-0');
    carouselVideo.load();
    
    const playPromise = carouselVideo.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Autoplay was prevented:", error);
      });
    }
    
    carouselVideo.style.opacity = '1';
    
    updateVideoProgress();
  }, 300);
}

function updateVideoProgress() {
  const progressBar = document.getElementById('video-progress');
  carouselVideo.addEventListener('timeupdate', () => {
    const progress = (carouselVideo.currentTime / carouselVideo.duration) * 100;
    progressBar.style.width = `${progress}%`;
  });
}

const toggleMute = document.getElementById('toggle-mute');

toggleMute.addEventListener('click', () => {
  carouselVideo.muted = !carouselVideo.muted;
  toggleMute.querySelector('i').className = carouselVideo.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
  toggleMute.classList.toggle('bg-emerald-500');
});

function showGallery() {
  const galleryPopup = document.getElementById('gallery-popup');
  galleryPopup.classList.remove('opacity-0', 'pointer-events-none');
  galleryPopup.querySelector('.relative').classList.remove('scale-95');
  document.body.style.overflow = 'hidden';
  
  if (videoList.length > 0) {
    showVideo(currentVideo);
    const playPromise = carouselVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setTimeout(() => {
          carouselVideo.muted = false;
        }, 100);
      }).catch(error => {
        console.log("Autoplay with audio was prevented:", error);
      });
    }
  }
}

function hideGallery() {
  const galleryPopup = document.getElementById('gallery-popup');
  galleryPopup.classList.add('opacity-0', 'pointer-events-none');
  galleryPopup.querySelector('.relative').classList.add('scale-95');
  document.body.style.overflow = '';
  
  if (carouselVideo) {
    carouselVideo.muted = true;
    carouselVideo.pause();
  }
}

function showDonasi() {
  const donasiPopup = document.getElementById('donasi-popup');
  donasiPopup.classList.remove('opacity-0', 'pointer-events-none');
  donasiPopup.querySelector('.relative').classList.remove('scale-95');
  document.body.style.overflow = 'hidden';
}

function hideDonasi() {
  const donasiPopup = document.getElementById('donasi-popup');
  donasiPopup.classList.add('opacity-0', 'pointer-events-none');
  donasiPopup.querySelector('.relative').classList.add('scale-95');
  document.body.style.overflow = '';
}

document.getElementById('open-gallery').addEventListener('click', showGallery);
document.getElementById('close-gallery').addEventListener('click', hideGallery);

document.querySelectorAll('a[href="#donasi"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showDonasi();
  });
});

document.getElementById('close-donasi').addEventListener('click', hideDonasi);

document.getElementById('donasi-popup').addEventListener('click', (e) => {
  if (e.target === document.getElementById('donasi-popup')) {
    hideDonasi();
  }
});


window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideGallery();
    hideDonasi();
  }
});

async function loadFirebaseVideos() {
  try {
    const listRef = storage.ref('videos');
    const res = await listRef.listAll();
    const urls = [];
    for (const itemRef of res.items) {
      const url = await itemRef.getDownloadURL();
      urls.push(url);
    }
    videoList = [
      './img/video1.mp4',
      './img/video2.mp4',
      './img/video3.mp4',
      ...urls
    ];
    showVideo(0);
  } catch (err) {
    console.error("Error loading Firebase videos:", err);
    showVideo(0);
  }
}

const openUploadModal = document.getElementById('open-upload-modal');
const modalUpload = document.getElementById('modal-upload');
const closeUploadModal = document.getElementById('close-upload-modal');
const videoUpload = document.getElementById('video-upload');
const btnUploadVideo = document.getElementById('btn-upload-video');
const uploadStatus = document.getElementById('upload-status');
const uploadDrop = document.getElementById('upload-drop');

const galleryPopup = document.getElementById('gallery-popup');
const openGallery = document.getElementById('open-gallery');
const closeGallery = document.getElementById('close-gallery');

function hideGallery() {
  galleryPopup.classList.add('opacity-0', 'pointer-events-none');
  galleryPopup.querySelector('.relative').classList.add('scale-95');
  document.body.style.overflow = '';
  
  if (carouselVideo) {
    carouselVideo.muted = true;
    carouselVideo.pause();
  }
}

function showGallery() {
  galleryPopup.classList.remove('opacity-0', 'pointer-events-none');
  galleryPopup.querySelector('.relative').classList.remove('scale-95');
  document.body.style.overflow = 'hidden';
  
  if (videoList.length > 0) {
    showVideo(currentVideo);
    const playPromise = carouselVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setTimeout(() => {
          carouselVideo.muted = false;
        }, 100);
      }).catch(error => {
        console.log("Autoplay with audio was prevented:", error);
      });
    }
  }
}

openGallery.addEventListener('click', showGallery);
closeGallery.addEventListener('click', hideGallery);

function showUploadModal() {
  modalUpload.classList.remove('opacity-0', 'pointer-events-none');
  modalUpload.querySelector('.bg-slate-900').classList.remove('scale-95');
  document.body.style.overflow = 'hidden';
}

function hideUploadModal() {
  modalUpload.classList.add('opacity-0', 'pointer-events-none');
  modalUpload.querySelector('.bg-slate-900').classList.add('scale-95');
  document.body.style.overflow = '';
}

openUploadModal.addEventListener('click', showUploadModal);
closeUploadModal.addEventListener('click', hideUploadModal);
modalUpload.addEventListener('mousedown', (e) => {
  if (e.target === modalUpload) hideUploadModal();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideGallery();
    hideUploadModal();
  }
});

document.getElementById('prev-video-btn').addEventListener('click', () => {
  showVideo(currentVideo - 1);
});

document.getElementById('next-video-btn').addEventListener('click', () => {
  showVideo(currentVideo + 1);
});

carouselVideo.style.transition = 'opacity 0.3s ease-in-out';

function showVideo(idx) {
  if (videoList.length === 0) return;
  
  carouselVideo.style.opacity = '0';
  
  setTimeout(() => {
    currentVideo = (idx + videoList.length) % videoList.length;
    
    while (carouselVideo.firstChild) {
      carouselVideo.removeChild(carouselVideo.firstChild);
    }
    
    const videoSource = document.createElement('source');
    videoSource.src = videoList[currentVideo];
    videoSource.type = 'video/mp4';
    carouselVideo.appendChild(videoSource);
    
    carouselVideo.loop = true;
    carouselVideo.muted = !galleryPopup || galleryPopup.classList.contains('opacity-0');
    carouselVideo.load();
    
    const playPromise = carouselVideo.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Autoplay was prevented:", error);
      });
    }
    
    carouselVideo.style.opacity = '1';
    
    updateVideoProgress();
  }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
  loadFirebaseVideos().then(() => {
    if (videoList.length > 0) {
      showVideo(0);
    }
  });
});

const donasiPopup = document.getElementById('donasi-popup');
const closeDonasi = document.getElementById('close-donasi');
const donasiLink = document.querySelector('a[href="#donasi"]');

function showDonasi() {
  donasiPopup.classList.remove('opacity-0', 'pointer-events-none');
  donasiPopup.querySelector('.relative').classList.remove('scale-95');
  document.body.style.overflow = 'hidden';
}

function hideDonasi() {
  donasiPopup.classList.add('opacity-0', 'pointer-events-none');
  donasiPopup.querySelector('.relative').classList.add('scale-95');
  document.body.style.overflow = '';
}

donasiLink.addEventListener('click', (e) => {
  e.preventDefault();
  showDonasi();
});

closeDonasi.addEventListener('click', hideDonasi);

donasiPopup.addEventListener('click', (e) => {
  if (e.target === donasiPopup) {
    hideDonasi();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideGallery();
    hideUploadModal();
    hideDonasi();
  }
});

const qrContainer = document.getElementById('qr-container');
const qrZoomPopup = document.getElementById('qr-zoom-popup');
const closeQrZoom = document.getElementById('close-qr-zoom');

function showQRZoom(imgSrc) {
  const popup = document.getElementById('qr-zoom-popup');
  const image = popup.querySelector('img');
  

  image.src = imgSrc;
  

  popup.style.display = 'flex';
  setTimeout(() => {
    popup.style.opacity = '1';
    popup.style.pointerEvents = 'auto';
    popup.querySelector('div').style.transform = 'scale(1)';
  }, 10);

  document.getElementById('close-qr-zoom')?.addEventListener('click', () => {
    popup.style.opacity = '0';
    popup.style.pointerEvents = 'none';
    popup.querySelector('div').style.transform = 'scale(0.95)';
    setTimeout(() => {
      popup.style.display = 'none';
    }, 300);
  });

  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.style.opacity = '0';
      popup.style.pointerEvents = 'none';
      popup.querySelector('div').style.transform = 'scale(0.95)';
      setTimeout(() => {
        popup.style.display = 'none';
      }, 300);
    }
  });
}

function togglePopup() {
  const popup = document.getElementById('bacardi-host-popup');
  if (popup.classList.contains('active')) {
    popup.classList.remove('active');
  } else {
    popup.classList.add('active');
    
    // Tambahkan tombol Newget
    const btnContainer = popup.querySelector('.btn-container');
    if (!document.getElementById('newget-btn')) {
      const newgetBtn = document.createElement('button');
      newgetBtn.id = 'newget-btn';
      newgetBtn.className = 'bacardi-host-btn';
      newgetBtn.innerHTML = `
        <i class="fas fa-book-open"></i>
        <span>Newget</span>
      `;
      newgetBtn.addEventListener('click', showNewgetPopup);
      btnContainer.appendChild(newgetBtn);
    }
  }
}

function toggleAppHost() {
  const modal = document.getElementById('appHostModal');
  if (modal.classList.contains('hidden')) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  } else {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

function copyText(text, label = "Teks") {
  navigator.clipboard.writeText(text).then(() => {
    showNotification(`${label} berhasil disalin!`);
  }).catch(() => {
    fallbackCopy(text);
  });
}

function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = "fixed top-24 right-6 glass px-6 py-4 rounded-xl shadow-xl border border-emerald-500/30 transform transition-all duration-300 z-[9999]";
  notif.innerHTML = `
  <div class="flex items-center gap-3">
    <i class="fas fa-check-circle text-emerald-400 text-xl"></i>
    <span class="text-white font-medium">${message}</span>
  </div>`;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

document.getElementById('download-host')?.addEventListener('click', () => {
  const content = `15.235.166.218 growtopia1.com
15.235.166.218 growtopia2.com
15.235.166.218 www.growtopia1.com
15.235.166.218 www.growtopia2.com
15.235.166.218 RvLnd.here`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'BacardiPS.txt';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
});


document.addEventListener('DOMContentLoaded', () => {
  const galleryLinks = document.querySelectorAll('a[href="#galeri"]');
  galleryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showGallery();
    });
  });

  const donasiLinks = document.querySelectorAll('a[href="#donasi"]');
  donasiLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showDonasi();
    });
  });
});

function handleScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Observe elements yang perlu animasi
  document.querySelectorAll('.stat-card, .staff-stats, .connect-card').forEach(el => {
    if (!el.classList.contains('animate')) {
      observer.observe(el);
    }
  });
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateActiveSection();
      handleScrollAnimations();
      ticking = false;
    });
    ticking = true;
  }
});

document.addEventListener('DOMContentLoaded', handleScrollAnimations);

document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.stat-card, .staff-stats, .connect-card').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
});

  const firebaseConfig = {
    apiKey: "AIzaSyAy0DhNhsNpGYFg7YJ1f6kvUYcDw08-GGk",
    authDomain: "bacardips-4e2c0.firebaseapp.com",
    databaseURL: "https://bacardips-4e2c0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bacardips-4e2c0",
    storageBucket: "bacardips-4e2c0.firebasestorage.app",
    messagingSenderId: "655282827033",
    appId: "1:655282827033:web:9656b7d6bd60e59de65f88",
    measurementId: "G-19NSYW9DSP"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  function updateStats(data) {
    console.log('Received data:', data);

    document.querySelectorAll('.stat-card').forEach(card => {
      const type = card.getAttribute('data-type');
      if (type && data[type] !== undefined) {
        const valueElement = card.querySelector('.text-4xl');
        if (valueElement) {
          valueElement.textContent = data[type];
        }
      }
    });

    document.querySelectorAll('.group\\/stat').forEach(stat => {
      const type = stat.getAttribute('data-type');
      if (type && data[type] !== undefined) {
        const valueElement = stat.querySelector('.stat-value');
        if (valueElement) {
          valueElement.textContent = data[type];
          valueElement.setAttribute('data-value', data[type]);
        }
      }
    });

    const serverStatus = document.querySelector('.group\\/server');
    if (serverStatus && data.serverStatus) {
      const statusIcon = serverStatus.querySelector('.w-4');
      const statusText = serverStatus.querySelector('span:last-child');
      
      if (statusIcon && statusText) {
        switch(data.serverStatus) {
          case 'online':
            statusIcon.className = 'w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse';
            statusText.textContent = 'Online';
            statusText.className = 'text-emerald-400 font-bold';
            break;
          case 'maintenance':
            statusIcon.className = 'w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse';
            statusText.textContent = 'Maintenance';
            statusText.className = 'text-yellow-400 font-bold';
            break;
          case 'offline':
            statusIcon.className = 'w-4 h-4 bg-gradient-to-r from-red-400 to-rose-500 rounded-full';
            statusText.textContent = 'Offline';
            statusText.className = 'text-red-400 font-bold';
            break;
        }
      }
    }
  }

  db.ref('serverStats').on('value', (snapshot) => {
    const data = snapshot.val() || {};
    console.log('Database updated:', data);
    updateStats(data);
  });

const aiChatButton = document.getElementById('ai-chat-button');
const aiChatContainer = document.getElementById('ai-chat-container');
const closeAiChat = document.getElementById('close-ai-chat');
const chatMessages = document.getElementById('chat-messages');
const aiChatForm = document.getElementById('ai-chat-form');
const aiChatInput = document.getElementById('ai-chat-input');

const OPENROUTER_API_KEY = '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';

function toggleAiChat() {
  const aiChatContainer = document.getElementById('ai-chat-container');
  const aiChatButton = document.getElementById('ai-chat-button').querySelector('button');
  
  aiChatContainer.classList.toggle('active');
  
  if (aiChatContainer.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

function addMessage(content, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'flex items-start gap-3 message-in mb-4';
  
  messageDiv.innerHTML = `
    <div class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ${isUser ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'border-2 border-emerald-500/30'}">
      ${isUser ? 
        `<div class="w-full h-full flex items-center justify-center">
          <i class="fas fa-user text-white"></i>
         </div>` : 
        `<img src="https://files.catbox.moe/prbsze.png" alt="BacardiPS AI" class="w-full h-full object-cover">`
      }
    </div>
    <div class="flex-1 ${isUser ? 'user-message' : 'ai-message'} rounded-xl p-4 text-slate-300">
      ${formatMessage(content)}
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatMessage(content) {
  content = content.replace(/\n\n/g, '<br><br>');
  content = content.replace(/•/g, '<br>• ');
  content = content.replace(/\*\*(.*?)\*\*/g, '<span class="text-emerald-400 font-semibold">$1</span>');
  
  return content;
}

function getSpecialResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('newget') || lowerMessage === '/newget') {
    return `**Panduan Newget BacardiPS** 🎮

<div class="mt-2 bg-slate-800/50 p-4 rounded-xl border border-emerald-500/30">
  <img src="./img/newget.png" 
       alt="Panduan Newget" 
       class="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-all"
       onclick="showNewgetPopup(); event.stopPropagation();">
  <div class="text-sm text-center mt-2 text-slate-400">Klik gambar untuk memperbesar</div>
</div>

💡 **Informasi Newget:**
• Item yang player daapat saat pertama kali login

<button onclick="showNewgetPopup()" 
        class="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full justify-center">
  <i class="fas fa-book-open"></i>
  <span>Lihat Panduan Lengkap</span>
</button>`;
  }

  if (lowerMessage.includes('donasi') || 
      lowerMessage.includes('donate') || 
      lowerMessage.includes('sumbang') ||
      lowerMessage.includes('saweria')) {
    return `**Donasi BacardiPS** 💖

Terima kasih atas minat Anda untuk mendukung BacardiPS! Anda dapat melakukan donasi melalui:

1️⃣ **QRIS / E-Wallet:**
<div class="mt-2 bg-slate-800/50 p-4 rounded-xl border border-emerald-500/30">
  <img src="./img/qr.jpg" 
       alt="QR Code Donasi" 
       class="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-all"
       onclick="showQRZoom(this.src); event.stopPropagation();">
  <div class="text-sm text-center mt-2 text-slate-400">Klik QR untuk memperbesar</div>
</div>

2️⃣ **Saweria:**
<button onclick="window.open('https://saweria.co/BacardiPS', '_blank')" 
        class="mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full justify-center">
  <i class="fas fa-heart text-xl"></i>
  <span>Donasi via Saweria</span>
</button>

💡 **Keuntungan Donasi:**
• Dapat Berkah
• Membantu Server Berkembang

Terima kasih atas dukungan Anda! 🙏`;
  }
  
  if (lowerMessage.includes('event') || 
      lowerMessage.includes('acara') || 
      lowerMessage.includes('kegiatan')) {
    return `**Event BacardiPS** 🎮

Berikut adalah event-event yang tersedia di server kami:

1️⃣ **Event Fishing**
• Event memancing untuk mendapatkan Diamond Lock
• Cek reward dengan command /sellfish

2️⃣ **Event BFG (Break For Gems)**
• Break block farmable (chand, lgrid, pepper, pot)
• Dapatkan Gems dan hadiah tambahan (DL, BGL, Exp Potion)

3️⃣ **Event Geiger**
• Cari sinyal untuk crystal dengan hadiah:
• Red/Green Crystal: 10 DL
• Blue Crystal: 15 DL
• Black Crystal: 1 BGL
• White Crystal: 3 BGL

4️⃣ **Event SSU (Spirit Storage Unit)**
• Masukkan ghost jar ke spirit storage
• Capai % tinggi untuk dapat Dreamcatcher Staff (DCS)
• 1 DCS = 1 Blue Gem Lock

5️⃣ **Password Door (PwDoor)**
• Tebak password untuk dapat hadiah
• Hadiah ditentukan pembuat PwDoor

6️⃣ **Dice Game**
• Game menang kalah dengan hadiah dari host

7️⃣ **Event WOTD (World Of The Day)**
• Design world terbaik
• Prize 100.000-150.000
• Berlangsung 5-22 Juni

<button onclick="smoothScroll(document.getElementById('event'), 1000)" class="mt-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full justify-center">
  <i class="fas fa-calendar-alt"></i>
  <span>Lihat Detail Event</span>
</button>`;
  }

  if (lowerMessage.includes('cara main') || 
      lowerMessage.includes('cara login') || 
      lowerMessage.includes('cara bermain') ||
      lowerMessage.includes('cara masuk') ||
      lowerMessage.includes('gimana main') ||
      lowerMessage.includes('how to play')) {
    return `**Selamat datang di BacardiPS!** 🎮

Untuk mulai bermain BacardiPS, ikuti langkah-langkah berikut:

1️⃣ **Download & Install Host:**
• Klik tombol "**Bacardi Host**" di halaman utama
• Pilih host sesuai device Anda (Android/iOS/Windows)

2️⃣ **Cara Login Detail:**
• Silakan kunjungi bagian "**CONNECT**" di menu atas
• Pilih panduan sesuai device Anda
• Ikuti langkah-langkah yang tertera

3️⃣ **Mulai Bermain:**
• Buka Growtopia seperti biasa
• Server akan otomatis terhubung ke BacardiPS
• Buat akun baru atau login jika sudah punya

🔗 **Link Penting:**
<button onclick="smoothScroll(document.getElementById('CONNECT'), 1000)" class="mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full justify-center">
  <i class="fas fa-link"></i>
  <span>Lihat Cara Login Detail</span>
</button>

<button onclick="togglePopup()" class="mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full justify-center">
  <i class="fas fa-download"></i>
  <span>Download Host</span>
</button>

💡 **Butuh Bantuan?**
<button onclick="window.open('https://discord.com/invite/Z2kybabDg4', '_blank')" class="mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full justify-center">
  <i class="fab fa-discord"></i>
  <span>Join Discord BacardiPS</span>
</button>

<button onclick="window.open('https://api.whatsapp.com/send?phone=6281527641306&text=Welcome%20To%20Bacardi%20Support%0A%0AGrowid%3A%0ATanggal%3A%0AMasalah%3A', '_blank')" class="mt-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full justify-center">
  <i class="fab fa-whatsapp"></i>
  <span>Hubungi Support WhatsApp</span>
</button>`;
  }
  
  if (lowerMessage === 'halo' || lowerMessage === 'hai' || lowerMessage === 'hello') {
    return `**Halo juga!** 👋

Saya asisten AI BacardiPS, siap membantu Anda dengan informasi seputar:

• Cara bermain di BacardiPS
• Event dan aktivitas server
• Sistem dan fitur dalam game
• Panduan koneksi
• Dan informasi lainnya

Ada yang bisa saya bantu?`;
  }
  
  if (lowerMessage.includes('siapa kamu') || lowerMessage.includes('kamu siapa')) {
    return `**Perkenalkan!** 🤖

Saya adalah Bacardi AI yang dibuat oleh Kuzuroken menggunakan teknologi modern untuk membantu para pemain BacardiPS.

Saya dirancang khusus untuk:
• Menjawab pertanyaan seputar server
• Memberikan panduan dan tips bermain
• Membantu masalah teknis
• Memberikan informasi update terbaru`;
  }
  
  if (lowerMessage.includes('owner') || lowerMessage.includes('pembuat')) {
    return `**Owner BacardiPS** 👑

Saya dibuat oleh Kuzuroken untuk menghandle player-player yang kesusahan. Beliau adalah owner dan developer utama BacardiPS.

Jika Anda ingin menghubungi owner langsung:

<button onclick="window.open('https://api.whatsapp.com/send?phone=6281527641306&text=Welcome%20To%20Bacardi%20Support%0A%0AGrowid%3A%0ATanggal%3A%0AMasalah%3A', '_blank')" 
        class="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full justify-center">
  <i class="fab fa-whatsapp text-xl"></i>
  <span>Hubungi Owner BacardiPS</span>
</button>`;
  }
  
  return null;
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const message = aiChatInput.value.trim();
  if (!message) return;
  
  addMessage(message, true);
  aiChatInput.value = '';

  const specialResponse = getSpecialResponse(message);
  if (specialResponse) {
    setTimeout(() => {
      addMessage(specialResponse);
    }, 500);
    return;
  }
  
  try {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex items-center gap-2 text-slate-400 text-sm p-3';
    typingDiv.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> AI sedang mengetik...';
    chatMessages.appendChild(typingDiv);
    
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyARS83rzvAG5JqjPuoRtByjKEZgs8J3V3w", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "contents": [
          {
            "parts": [
              {
                "text": `Kamu adalah asisten AI BacardiPS yang membantu pemain dengan informasi seputar GTPS dan game Growtopia. Berikan respons dalam bahasa Indonesia yang ramah, helpful, dan detail. Gunakan format yang rapi dengan emoji dan formatting yang sesuai. Pertanyaan user: ${message}`
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    chatMessages.removeChild(typingDiv);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      addMessage(aiResponse);
    } else {
      throw new Error('Format respons tidak valid');
    }

  } catch (error) {
    console.error('Error:', error);
    chatMessages.removeChild(typingDiv);
    addMessage('Maaf, terjadi kesalahan dalam memproses permintaan Anda. Silakan coba lagi nanti. 🙏');
  }
}

aiChatButton.addEventListener('click', toggleAiChat);
closeAiChat.addEventListener('click', (e) => {
  e.stopPropagation(); 
  toggleAiChat();
});
aiChatForm.addEventListener('submit', handleSubmit);


aiChatContainer.addEventListener('click', (e) => {
  if (e.target === aiChatContainer) {
    toggleAiChat();
  }
});

function downloadHost() {
  const content = `15.235.166.218 growtopia1.com
15.235.166.218 growtopia2.com
15.235.166.218 www.growtopia1.com
15.235.166.218 www.growtopia2.com
15.235.166.218 RvLnd.here`;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'BacardiPS.txt';
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
  
  showNotification('Host berhasil didownload!');
}


document.getElementById('qr-container')?.addEventListener('click', () => {
  const qrImage = document.querySelector('#qr-container img');
  showQRZoom(qrImage.src);
});

const rulesContent = {
  market: {
    id: {
      title: "Rules Market",
      icon: "fa-store",
      gradient: "from-emerald-500 to-teal-500",
      content: `
        <div class="space-y-6">
          <div class="glass p-6 rounded-xl">
            <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <i class="fas fa-info-circle text-emerald-400"></i>
              Peraturan Market
            </h3>
            <div class="space-y-4">
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span class="text-emerald-400 font-bold">1</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Mencantumkan Grow ID</h4>
                  <p class="text-slate-300">Pastikan Anda mencantumkan Grow ID Anda saat berjualan untuk menghindari tindakan penipuan.</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span class="text-emerald-400 font-bold">2</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Sertakan Harga</h4>
                  <p class="text-slate-300">Wajib mencantumkan harga saat berjualan untuk mengurangi manipulasi di marketplace.</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span class="text-emerald-400 font-bold">3</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Harga LOCK</h4>
                  <p class="text-slate-300">Cek harga LOCK terkini di world <span class="text-emerald-400 font-semibold">TRADE</span>. Harga dapat berubah sesuai keadaan ekonomi server.</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span class="text-emerald-400 font-bold">4</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Larangan Manipulasi</h4>
                  <p class="text-slate-300">Dilarang keras memanipulasi harga. Pelanggar akan dikenakan sanksi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    },
    en: {
      title: "Market Rules",
      content: `
        <div class="space-y-6">
          <div class="glass p-6 rounded-xl">
            <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <i class="fas fa-info-circle text-emerald-400"></i>
              Market Regulations
            </h3>
            <div class="space-y-4">
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span class="text-emerald-400 font-bold">1</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Include Grow ID</h4>
                  <p class="text-slate-300">Make sure to include your Grow ID when selling to prevent fraud.</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span class="text-emerald-400 font-bold">2</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Include Price</h4>
                  <p class="text-slate-300">Must include price when selling to reduce marketplace manipulation.</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span class="text-emerald-400 font-bold">3</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">LOCK Price</h4>
                  <p class="text-slate-300">Check current LOCK prices in <span class="text-emerald-400 font-semibold">TRADE</span> world. Prices may change according to server economy.</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span class="text-emerald-400 font-bold">4</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">No Manipulation</h4>
                  <p class="text-slate-300">Price manipulation is strictly prohibited. Violators will be sanctioned.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    }
  },
  player: {
    id: {
      title: "Rules Player",
      icon: "fa-users",
      gradient: "from-blue-500 to-indigo-500",
      content: `
        <div class="space-y-6">
          <div class="glass p-6 rounded-xl">
            <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <i class="fas fa-info-circle text-blue-400"></i>
              Peraturan Umum Player
            </h3>
            <div class="space-y-4">
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">Tidak diperbolehkan menggunakan lebih dari 2 akun</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">Dilarang melakukan tindakan rasis terhadap agama/suku</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">Dilarang mengancam player lain untuk keuntungan pribadi</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">Dilarang memberikan akun kepada orang lain</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">Dilarang meniru nama growid player lain untuk menipu</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">Dilarang memanipulasi harga pasar</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">Dilarang menyebarkan hoax dalam game</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">Dilarang menjual barang game untuk uang real</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">Dilarang menjual data-data akun</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">Batasi chat saat promosi</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      `
    },
    en: {
      title: "Player Rules",
      content: `
        <div class="space-y-6">
          <div class="glass p-6 rounded-xl">
            <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <i class="fas fa-info-circle text-blue-400"></i>
              General Player Rules
            </h3>
            <div class="space-y-4">
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">Not allowed to use more than 2 accounts</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">No racism against religion/ethnicity</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">No threatening other players for personal gain</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">No sharing accounts with others</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">No copying other players' growid to scam</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">No market price manipulation</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">No spreading hoaxes in game</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">No selling in-game items for real money</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">No selling account data</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-blue-400 mt-1"></i>
                  <span class="text-slate-300">Limit chat when promoting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      `
    }
  },
  reme: {
    id: {
      title: "Rules Reme",
      icon: "fa-dice",
      gradient: "from-purple-500 to-pink-500",
      content: `
        <div class="space-y-6">
          <div class="glass p-6 rounded-xl">
            <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <i class="fas fa-info-circle text-purple-400"></i>
              Peraturan Reme
            </h3>
            <div class="space-y-4">
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span class="text-purple-400 font-bold">1</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Batas Maksimal</h4>
                  <p class="text-slate-300">Maksimal bermain 10 BGL. Lebih dari itu akan dikenakan curse/ban 1 jam + clear world.</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span class="text-purple-400 font-bold">2</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Rekaman Wajib</h4>
                  <p class="text-slate-300">Setiap permainan reme wajib direkam untuk menghindari hal yang tidak diinginkan.</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span class="text-purple-400 font-bold">3</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">World Verif</h4>
                  <p class="text-slate-300">Keuntungan: no max bet, bebas mengatur max bet selama tidak melebihi modal. Harga verif: 20k.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    },
    en: {
      title: "Reme Rules",
      content: `
        <div class="space-y-6">
          <div class="glass p-6 rounded-xl">
            <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <i class="fas fa-info-circle text-purple-400"></i>
              Reme Regulations
            </h3>
            <div class="space-y-4">
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span class="text-purple-400 font-bold">1</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Maximum Limit</h4>
                  <p class="text-slate-300">Maximum play is 10 BGL. Exceeding will result in curse/ban 1 hour + world clear.</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span class="text-purple-400 font-bold">2</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Recording Required</h4>
                  <p class="text-slate-300">Every reme game must be recorded to avoid unwanted incidents.</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span class="text-purple-400 font-bold">3</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Verified World</h4>
                  <p class="text-slate-300">Benefits: no max bet, free to set max bet as long as not exceeding capital. Verification price: 20k.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    }
  },
  mods: {
    id: {
      title: "Rules Mods",
      icon: "fa-shield-alt",
      gradient: "from-rose-500 to-red-500",
      content: `
        <div class="space-y-6">
          <div class="glass p-6 rounded-xl">
            <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <i class="fas fa-info-circle text-rose-400"></i>
              Peraturan Moderator
            </h3>
            <div class="space-y-4">
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <span class="text-rose-400 font-bold">1</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Penggunaan Bedrock</h4>
                  <p class="text-slate-300">Dilarang membuat titid menggunakan bedrock dan menaruh bedrock sembarangan di world player.</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <span class="text-rose-400 font-bold">2</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Ghost Mode</h4>
                  <p class="text-slate-300">Dilarang mengganggu player yang AFK (BFG, fishing, dll) menggunakan /ghost. Sanksi: ban 3 jam dan demote 3 hari.</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <span class="text-rose-400 font-bold">3</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Unlimited Block/Set</h4>
                  <p class="text-slate-300">Dilarang memberi block/set sembarangan ke player untuk menjaga stabilitas ekonomi. Sanksi: demote.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    },
    en: {
      title: "Mods Rules",
      content: `
        <div class="space-y-6">
          <div class="glass p-6 rounded-xl">
            <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <i class="fas fa-info-circle text-rose-400"></i>
              Moderator Regulations
            </h3>
            <div class="space-y-4">
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <span class="text-rose-400 font-bold">1</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Bedrock Usage</h4>
                  <p class="text-slate-300">Prohibited to create inappropriate content using bedrock and placing bedrock randomly in player worlds.</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <span class="text-rose-400 font-bold">2</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Ghost Mode</h4>
                  <p class="text-slate-300">Prohibited to disturb AFK players (BFG, fishing, etc) using /ghost. Sanction: 3-hour ban and 3-day demote.</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <span class="text-rose-400 font-bold">3</span>
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-1">Unlimited Block/Set</h4>
                  <p class="text-slate-300">Prohibited to give blocks/sets randomly to players to maintain economic stability. Sanction: demote.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    }
  }
};

let currentRulesType = null;
let currentLanguage = 'id';

function showRulesPopup(type) {
  currentRulesType = type;
  const popup = document.getElementById('rules-popup');
  const content = rulesContent[type];
  
  if (!content) return;
  
  const icon = document.getElementById('rules-icon');
  const title = document.getElementById('rules-title');
  
  icon.className = `w-12 h-12 rounded-full bg-gradient-to-r ${content[currentLanguage].gradient || content.id.gradient} flex items-center justify-center`;
  icon.innerHTML = `<i class="fas ${content[currentLanguage].icon || content.id.icon} text-2xl text-white"></i>`;
  
  title.textContent = content[currentLanguage].title;
  
  document.getElementById('rules-content-id').innerHTML = content.id.content;
  document.getElementById('rules-content-en').innerHTML = content.en.content;
  
  document.getElementById('rules-content-id').style.display = currentLanguage === 'id' ? 'block' : 'none';
  document.getElementById('rules-content-en').style.display = currentLanguage === 'en' ? 'block' : 'none';
  
  document.getElementById('btn-id').className = `flex-1 py-2 rounded-xl ${currentLanguage === 'id' ? 'bg-emerald-500' : 'bg-emerald-500/20'} text-white font-medium hover:bg-emerald-500/40 transition-all`;
  document.getElementById('btn-en').className = `flex-1 py-2 rounded-xl ${currentLanguage === 'en' ? 'bg-emerald-500' : 'bg-emerald-500/20'} text-white font-medium hover:bg-emerald-500/40 transition-all`;
  
  popup.style.opacity = '1';
  popup.style.pointerEvents = 'auto';
}

function hideRulesPopup() {
  const popup = document.getElementById('rules-popup');
  popup.style.opacity = '0';
  popup.style.pointerEvents = 'none';
}

function switchLanguage(lang) {
  currentLanguage = lang;
  if (currentRulesType) {
    showRulesPopup(currentRulesType);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('rules-popup').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      hideRulesPopup();
    }
  });
});


document.querySelectorAll('.btn-modern').forEach(button => {
  button.addEventListener('click', function(e) {
    this.classList.remove('clicked');
    
    void this.offsetWidth;
    
    this.classList.add('clicked');
    
    setTimeout(() => {
      this.classList.remove('clicked');
    }, 600);
  });
});

function showNewgetPopup() {
  const popup = document.createElement('div');
  popup.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 opacity-0 transition-opacity duration-300';
  popup.style.backdropFilter = 'blur(5px)';
  
  popup.innerHTML = `
    <div class="relative bg-slate-900 p-4 rounded-2xl border border-emerald-500/30 transform scale-95 transition-transform duration-300">
      <button class="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors">
        <i class="fas fa-times text-xl"></i>
      </button>
      <img src="./img/newget.png" alt="Newget Guide" class="max-w-full h-auto rounded-xl">
    </div>
  `;
  
  document.body.appendChild(popup);
  
  setTimeout(() => {
    popup.style.opacity = '1';
    popup.querySelector('.bg-slate-900').style.transform = 'scale(1)';
  }, 10);
  
  popup.addEventListener('click', (e) => {
    if (e.target === popup || e.target.closest('button')) {
      popup.style.opacity = '0';
      popup.querySelector('.bg-slate-900').style.transform = 'scale(0.95)';
      setTimeout(() => popup.remove(), 300);
    }
  });
}
