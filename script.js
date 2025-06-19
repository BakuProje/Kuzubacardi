function initParticles() {
  const isMobile = window.innerWidth < 768;
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

  let resizeTimeout;
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateCanvasSize, 100);
  });

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
    const href = this.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
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
<div class="mt-2 bg-slate-800/50 p-4 rounded-xl border border-emerald-500/30">
  <img src="./img/fish.png" alt="Fishing Event" class="w-full h-auto rounded-lg">
  <div class="mt-4 space-y-2">
    <p class="text-slate-300">Event memancing untuk mendapatkan Diamond Lock:</p>
    <ul class="list-disc pl-5 text-slate-300 space-y-1">
      <li>Cek reward dengan command /sellfish</li>
      <li>Semakin lama memancing, semakin besar reward</li>
    </ul>
  </div>
</div>

2️⃣ **Event BFG (Break For Gems)**
<div class="mt-2 bg-slate-800/50 p-4 rounded-xl border border-emerald-500/30">
  <img src="./img/bfg.png" alt="BFG Event" class="w-full h-auto rounded-lg">
  <div class="mt-4 space-y-2">
    <p class="text-slate-300">Event break block farmable untuk mendapatkan hadiah:</p>
    <ul class="list-disc pl-5 text-slate-300">
      <li>Block yang bisa di-break: Chandelier, LaserGrid, Pepper Tree, Pot O' Gold</li>
      <li>Dapatkan Gems dan hadiah tambahan</li>
    </ul>
    <div class="mt-3">
      <p class="font-semibold text-emerald-400">Hadiah yang bisa didapat:</p>
      <ul class="list-disc pl-5 text-slate-300">
        <li>Diamond Lock</li>
        <li>Blue Gem Lock</li>
        <li>Exp Potion</li>
      </ul>
    </div>
  </div>
</div>

3️⃣ **Event Geiger**
<div class="mt-2 bg-slate-800/50 p-4 rounded-xl border border-emerald-500/30">
  <img src="./img/geiger.png" alt="Geiger Event" class="w-full h-auto rounded-lg">
  <div class="mt-4 space-y-2">
    <p class="text-slate-300">Event mencari sinyal untuk mendapatkan crystal:</p>
    <div class="mt-3">
      <p class="font-semibold text-emerald-400">Harga Crystal (/exchange):</p>
      <ul class="list-disc pl-5 text-slate-300">
        <li>Red/Green Crystal: 50 WORLD LOCK</li>
        <li>Blue Crystal: 60 WORLD LOCK</li>
        <li>Black Crystal: 1 DIAMOND LOCK</li>
        <li>White Crystal: 2 DIAMOND LOCK</li>
      </ul>
    </div>
  </div>
</div>

4️⃣ **Event SSU (Spirit Storage Unit)**
<div class="mt-2 bg-slate-800/50 p-4 rounded-xl border border-emerald-500/30">
  <img src="./img/ssu.png" alt="SSU Event" class="w-full h-auto rounded-lg">
  <div class="mt-4 space-y-2">
    <p class="text-slate-300">Event memasukkan ghost jar ke spirit storage:</p>
    <ul class="list-disc pl-5 text-slate-300">
      <li>Capai % tinggi untuk mendapatkan Dreamcatcher Staff (DCS)</li>
      <li>Gunakan /exchange untuk menukar DCS</li>
    </ul>
    <div class="mt-3">
      <p class="font-semibold text-emerald-400">Harga Exchange:</p>
      <ul class="list-disc pl-5 text-slate-300">
        <li>1 Dreamcatcher Staff: 3 DIAMOND LOCK</li>
      </ul>
    </div>
  </div>
</div>

5️⃣ **Password Door (PwDoor)**
<div class="mt-2 bg-slate-800/50 p-4 rounded-xl border border-emerald-500/30">
  <img src="./img/pwdoor.png" alt="Password Door Event" class="w-full h-auto rounded-lg">
  <div class="mt-4 space-y-2">
    <p class="text-slate-300">Game tebak password door:</p>
    <ul class="list-disc pl-5 text-slate-300">
      <li>Tebak password untuk mendapatkan hadiah</li>
      <li>Hadiah ditentukan oleh pembuat Password Door</li>
    </ul>
  </div>
</div>

6️⃣ **Dice Game**
<div class="mt-2 bg-slate-800/50 p-4 rounded-xl border border-emerald-500/30">
  <img src="./img/dice.png" alt="Dice Game Event" class="w-full h-auto rounded-lg">
  <div class="mt-4 space-y-2">
    <p class="text-slate-300">Permainan menang kalah dengan dadu:</p>
    <ul class="list-disc pl-5 text-slate-300">
      <li>Hadiah sesuai yang diberikan oleh pembuat dice game</li>
      <li>Permainan fair dan transparan</li>
    </ul>
  </div>
</div>

7️⃣ **Event WOTD (World Of The Day)**
<div class="mt-2 bg-slate-800/50 p-4 rounded-xl border border-emerald-500/30">
  <img src="./img/wotd.png" alt="WOTD Event" class="w-full h-auto rounded-lg">
  <div class="mt-4 space-y-2">
    <p class="text-slate-300">Event design world terbaik:</p>
    <ul class="list-disc pl-5 text-slate-300">
      <li>3 world terbaik akan dipilih</li>
      <li>Prize 100.000-150.000</li>
      <li>Event berakhir tanggal 22 Juni</li>
    </ul>
  </div>
</div>

8️⃣ **Event Chemical (Science Station)**
<div class="mt-2 bg-slate-800/50 p-4 rounded-xl border border-emerald-500/30">
  <img src="./img/chemi.png" alt="Chemical Event" class="w-full h-auto rounded-lg">
  <div class="mt-4 space-y-2">
    <p class="text-slate-300">Chemical adalah event di mana pemain harus membuat Mistery Chemical dan mengumpulkannya:</p>
    <ul class="list-disc pl-5 text-slate-300 space-y-1">
      <li>Kumpulkan 25 Mistery Chemical = 1 Dumb LiteCoin (/exchange)</li>
      <li>Kumpulkan 100 Dumb LiteCoin untuk roulette dengan owner</li>
    </ul>
    <div class="mt-3">
      <p class="font-semibold text-emerald-400">Bahan Mistery Chemical:</p>
      <ul class="list-disc pl-5 text-slate-300">
        <li>Yellow Chemical: 20</li>
        <li>Blue Chemical: 10</li>
        <li>Pink Chemical: 5</li>
      </ul>
    </div>
    <div class="mt-3">
      <p class="font-semibold text-emerald-400">Prize Roulette:</p>
      <ul class="list-disc pl-5 text-slate-300">
        <li>1 Magplant 15K</li>
        <li>1-3 Diamond Lock</li>
        <li>Random Get Gaia's Beacon</li>
        <li>Random Get Unstable Tesseract</li>
      </ul>
    </div>
  </div>
</div>

9️⃣ **Event Fossil**
<div class="mt-2 bg-slate-800/50 p-4 rounded-xl border border-emerald-500/30">
  <img src="./img/fossil.png" alt="Fossil Event" class="w-full h-auto rounded-lg">
  <div class="mt-4 space-y-2">
    <p class="text-slate-300">Fossil adalah event pengumpulan Ancient Plant Seed:</p>
    <ul class="list-disc pl-5 text-slate-300 space-y-1">
      <li>Kumpulkan 25 Ancient Plant Seed = 1 Gnome Coin (/exchange)</li>
      <li>Kumpulkan 100 Gnome Coin untuk roulette dengan owner</li>
    </ul>
    <div class="mt-3">
      <p class="font-semibold text-emerald-400">Cara Mendapatkan Ancient Plant Seed:</p>
      <ul class="list-disc pl-5 text-slate-300">
        <li>Gunakan Fossil Prep</li>
        <li>Gunakan Polished Fossil</li>
        <li>Tunggu ±3 jam untuk harvest</li>
      </ul>
    </div>
    <div class="mt-3">
      <p class="font-semibold text-emerald-400">Prize Roulette:</p>
      <ul class="list-disc pl-5 text-slate-300">
        <li>1 Magplant 15K</li>
        <li>1-3 Diamond Lock</li>
        <li>Random Get Gaia's Beacon</li>
        <li>Random Get Unstable Tesseract</li>
      </ul>
    </div>
  </div>
</div>

<div class="flex flex-col gap-2 mt-4">
  <button onclick="window.open('https://discord.com/invite/Z2kybabDg4', '_blank')" 
          class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full justify-center">
    <i class="fab fa-discord text-xl"></i>
    <span>Join Discord BacardiPS</span>
  </button>

  <button onclick="window.open('https://chat.whatsapp.com/IUyX4WyHmBOA2mEdC6TFYG', '_blank')" 
          class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full justify-center">
    <i class="fab fa-whatsapp text-xl"></i>
    <span>Join WhatsApp Group</span>
  </button>
</div>

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


function showRolePopup() {
  document.getElementById('role-popup').classList.remove('hidden');
}

function hideRolePopup() {
  document.getElementById('role-popup').classList.add('hidden');
}


function showTitlePopup() {
  document.getElementById('title-popup').classList.remove('hidden');
}

function hideTitlePopup() {
  document.getElementById('title-popup').classList.add('hidden');
}

function buyRole() {
  window.location.href = "https://api.whatsapp.com/send/?phone=6281527641306&text=Halo%20Bang%2C%20saya%20mau%20beli%20Role%20%0AGrowID%3A%20%3Cisi%20GrowID%20kamu%20di%20sini%3E%0ARole%3A%20Mau%20beli%20role%20%3Ccontoh%20role%20Developer%3E&type=phone_number&app_absent=0";
}


function showAssetPopup() {
  const popup = document.getElementById('asset-popup');
  popup.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function hideAssetPopup() {
  const popup = document.getElementById('asset-popup');
  popup.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

function showNewgetPopup() {
  const popup = document.createElement('div');
  popup.id = 'newget-popup';
  
  popup.innerHTML = `
    <div class="newget-content">
      <button onclick="hideNewgetPopup()" class="absolute top-4 right-4 text-white hover:text-indigo-400 transition-colors">
        <i class="fas fa-times text-xl"></i>
      </button>
      <h2 class="text-2xl font-bold text-white mb-4">Newget Tutorial</h2>
      <img src="./img/newget.png" alt="Newget Tutorial" class="shadow-lg">
      <div class="flex justify-end mt-4">
        <button onclick="hideNewgetPopup()" class="px-6 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-lg hover:opacity-90 transition-opacity">
          Close
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(popup);
  document.body.style.overflow = 'hidden';
}

function hideNewgetPopup() {
  const popup = document.getElementById('newget-popup');
  if (popup) {
    popup.remove();
    document.body.style.overflow = 'auto';
  }
}


const rulesData = {
  market: {
    id: `<b>RULES MARKET 💸💵</b><br><ol class='list-decimal pl-5 space-y-2'><li>Cantumkan <b>GrowID</b> Anda saat berjualan untuk mencegah penipuan.</li><li>Sertakan <b>harga</b> pada setiap barang yang dijual untuk transparansi.</li><li>Harga <b>LOCK</b> dapat dicek di world <b>TRADE</b> dan bisa berubah sesuai ekonomi server.</li><li>Dilarang <b>memanipulasi harga</b> pasar. Pelanggaran akan dikenakan sanksi.</li></ol><div class='mt-4 text-amber-400 text-sm'>Pelanggaran rules market dapat berakibat hukuman berat!</div>`,
    en: `<b>MARKET RULES 💸💵</b><br><ol class='list-decimal pl-5 space-y-2'><li>Always include your <b>GrowID</b> when trading to prevent scams.</li><li>Always state the <b>price</b> for each item to ensure transparency.</li><li><b>LOCK</b> prices can be checked in the <b>TRADE</b> world and may change based on server economy.</li><li><b>Price manipulation</b> is strictly prohibited. Violators will be sanctioned.</li></ol><div class='mt-4 text-amber-400 text-sm'>Violating market rules may result in severe punishment!</div>`
  },
  player: {
    id: `<b>RULES IN GAME</b><br><ul class='list-disc pl-5 space-y-2'><li>Tidak diperbolehkan menggunakan lebih dari <b>2 akun</b>.</li><li>Dilarang rasis dalam bentuk apapun (agama/suku).</li><li>Dilarang mengancam player demi keuntungan pribadi.</li><li>Jangan berikan akun Anda ke orang lain.</li><li>Dilarang meniru nama GrowID orang lain untuk menipu.</li><li>Dilarang memanipulasi harga pasar dengan mengubah harga barang secara tidak wajar.</li><li>Dilarang menyebarkan hoax/isu palsu di dalam game.</li><li>Dilarang menjual item in-game menjadi uang asli.</li><li>Dilarang menjual data-data akun Anda.</li><li>Jangan spam chat saat promosi, batasi pesan Anda.</li><li>Dilarang broadcast dengan kata kasar, sindiran, atau memperburuk nama world.</li><li>Dilarang menyebar unsur NSFW di game/server.</li><li>Jangan spam pesan private ke staff/owner, cukup 1-2 pesan.</li><li>Casino diperbolehkan, tapi dilarang menggunakan script curang (teleport, tricker, text palsu, dll).</li><li>Dilarang jual BGL/lock lain di broadcast.</li><li>Jangan buang sampah ke world orang lain, minta staff/owner untuk membersihkan.</li><li>Dilarang memanipulasi player baru demi keuntungan pribadi.</li><li>Dilarang botting dengan akun/IP berbeda.</li></ul>`,
    en: `<b>IN-GAME RULES</b><br><ul class='list-disc pl-5 space-y-2'><li>Do not use more than <b>2 accounts</b>.</li><li>No racism of any kind (religion/ethnicity).</li><li>No threats to other players for personal gain.</li><li>Never give your account to others.</li><li>Do not impersonate other players' GrowID to scam.</li><li>No price manipulation by changing item prices unfairly.</li><li>No spreading hoaxes or false issues in-game.</li><li>No selling in-game items for real money.</li><li>No selling your account data.</li><li>Do not spam chat when promoting, limit your messages.</li><li>No broadcasting with harsh words, insults, or defaming worlds.</li><li>No NSFW content in-game or on the server.</li><li>Do not spam private messages to staff/owner, 1-2 messages are enough.</li><li>Casino is allowed, but cheating scripts (teleport, tricker, fake text, etc.) are forbidden.</li><li>No selling BGL/other locks via broadcast.</li><li>Do not litter in other players' worlds, ask staff/owner to clean up.</li><li>No manipulating new players for personal gain.</li><li>No botting with different accounts/IPs.</li></ul>`
  },
  reme: {
    id: `<b>RULES REME</b><br><ul class='list-disc pl-5 space-y-2'><li>Max main 10 BGL, lebih dari itu bisa dicurse/ban 1 jam + clear world. Owner yang melanggar: ban 3 jam.</li><li>Setiap main reme (verify/non-verify) wajib direkam untuk keamanan.</li><li>Keuntungan world verif: no max bet, bebas atur max bet selama tidak melebihi modal.</li><li>Jika terjadi tricker/scammer, owner & staff akan turun tangan dan melakukan refund.</li><li>Harga world verif: 20k.</li></ul>`,
    en: `<b>REME RULES</b><br><ul class='list-disc pl-5 space-y-2'><li>Max play is 10 BGL, more than that may result in curse/ban for 1 hour + world clear. Owner violating: 3 hours ban.</li><li>Every reme game (verify/non-verify) must be recorded for safety.</li><li>Verified world benefit: no max bet, you can set your own max bet as long as it doesn't exceed your capital.</li><li>If tricker/scammer occurs, owner & staff will handle and refund.</li><li>Verified world price: 20k.</li></ul>`
  },
  mods: {
    id: `<b>RULES MODS+</b><br><ul class='list-disc pl-5 space-y-2'><li>Dilarang membuat bentuk tidak pantas (misal: titit) dengan bedrock di world orang.</li><li>Jangan ganggu player yang sedang AFK BFG, AFK fishing, dll. Dilarang menyalahgunakan /ghost.</li><li>Pelanggaran: ban 3 jam & demote 3 hari, setelah itu role bisa di-up lagi.</li><li>Unli block/set dilarang diberikan sembarangan ke player agar ekonomi server stabil. Pelanggaran: demote.</li></ul>`,
    en: `<b>MODS+ RULES</b><br><ul class='list-disc pl-5 space-y-2'><li>Do not create inappropriate shapes (e.g., genitals) with bedrock in other players' worlds.</li><li>Do not disturb players who are AFK BFG, AFK fishing, etc. Do not abuse /ghost.</li><li>Violation: 3 hours ban & 3 days demote, after that role can be restored.</li><li>Unli block/set must not be given randomly to players to keep the economy stable. Violation: demote.</li></ul>`
  }
};

let currentLang = 'id';
let currentRules = 'market';

function showRulesPopup(type) {
  currentRules = type;
  document.getElementById('rules-popup-title').innerText = getRulesTitle(type, 'id') + " / " + getRulesTitle(type, 'en');
  document.getElementById('rules-popup-body-id').innerHTML = rulesData[type].id;
  document.getElementById('rules-popup-body-en').innerHTML = rulesData[type].en;
  document.getElementById('rules-popup').classList.remove('opacity-0', 'pointer-events-none');
  document.body.style.overflow = 'hidden';
  showBothLang();
}

function showIdLang() {
  document.getElementById('rules-popup-body-id').classList.remove('hide-lang');
  document.getElementById('rules-popup-body-en').classList.add('hide-lang');
}
function showEnLang() {
  document.getElementById('rules-popup-body-id').classList.add('hide-lang');
  document.getElementById('rules-popup-body-en').classList.remove('hide-lang');
}
function showBothLang() {
  document.getElementById('rules-popup-body-id').classList.remove('hide-lang');
  document.getElementById('rules-popup-body-en').classList.remove('hide-lang');
}

document.getElementById('show-id').onclick = showIdLang;
document.getElementById('show-en').onclick = showEnLang;
document.getElementById('show-both').onclick = showBothLang;

function hideRulesPopup() {
  document.getElementById('rules-popup').classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = '';
}

function getRulesTitle(type, lang) {
  const titles = {
    market: { id: 'Rules Market', en: 'Market Rules' },
    player: { id: 'Rules Player', en: 'Player Rules' },
    reme: { id: 'Rules Reme', en: 'Reme Rules' },
    mods: { id: 'Rules Mods', en: 'Mods+ Rules' }
  };
  return titles[type][lang];
}

document.querySelectorAll('.rules-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    showRulesPopup(this.getAttribute('data-rules'));
  });
});

document.getElementById('close-rules-popup').addEventListener('click', hideRulesPopup);
document.getElementById('rules-popup').addEventListener('click', (e) => {
  if (e.target === document.getElementById('rules-popup')) hideRulesPopup();
});
