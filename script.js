function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2
    });
  }
  
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
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
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

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification();
    }, () => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
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
    showNotification();
  } catch (err) {
    console.error('Failed to copy text');
  }
  document.body.removeChild(textArea);
}

function showNotification() {
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

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

async function fetchServerStats() {
  try {
    const response = await fetch('YOUR_DISCORD_API_ENDPOINT');
    const data = await response.json();
    
    document.getElementById('online-players').textContent = data.online || '14';
  } catch (error) {
    console.error('Error fetching server stats:', error);
  }
}

setInterval(fetchServerStats, 300000);
fetchServerStats(); // Initial fetch

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

function showQrZoom() {
  qrZoomPopup.classList.remove('opacity-0', 'pointer-events-none');
  qrZoomPopup.querySelector('.relative').classList.remove('scale-95');
  document.body.style.overflow = 'hidden';
}

function hideQrZoom() {
  qrZoomPopup.classList.add('opacity-0', 'pointer-events-none');
  qrZoomPopup.querySelector('.relative').classList.add('scale-95');
  document.body.style.overflow = '';
}

qrContainer.addEventListener('click', showQrZoom);
closeQrZoom.addEventListener('click', hideQrZoom);

qrZoomPopup.addEventListener('click', (e) => {
  if (e.target === qrZoomPopup) {
    hideQrZoom();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideGallery();
    hideUploadModal();
    hideDonasi();
    hideQrZoom();
  }
});


function togglePopup() {
const popup = document.getElementById('bacardiPopup');
popup.classList.toggle('hidden');
}

function toggleAppHost() {
const modal = document.getElementById('appHostModal');
modal.classList.toggle('hidden');
}

function copyText(text, label = "Teks") {
navigator.clipboard.writeText(text).then(() => {
showNotification(`${label} berhasil disalin!`);
}).catch(() => {
showNotification(`Gagal menyalin ${label}.`);
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
  const animateOnScroll = (elements, className) => {
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const triggerPoint = window.innerHeight * 0.8;
      
      if (elementTop < triggerPoint) {
        element.classList.add(className);
      }
    });
  };

  const statCards = document.querySelectorAll('.stat-card');
  const staffStats = document.querySelector('.staff-stats');
  const connectCards = document.querySelectorAll('.connect-card');

  animateOnScroll(statCards, 'animate');
  if (staffStats) animateOnScroll([staffStats], 'animate');
  animateOnScroll(connectCards, 'animate');
}

let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  
  scrollTimeout = window.requestAnimationFrame(() => {
    handleScrollAnimations();
  });
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
