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

// Optimasi scroll handler
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

// Optimasi intersection observer
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

// Optimasi animasi scroll
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
  'https://files.catbox.moe/0szmse.mp4', 
  'https://files.catbox.moe/yujrb0.mp4',
  'https://files.catbox.moe/9clong.mp4'
];


async function handleVideoUpload(file) {
  try {
    const formData = new FormData();
    formData.append('fileToUpload', file);
    

    const uploadStatus = document.getElementById('upload-status');
    uploadStatus.textContent = 'Mengupload video...';
    uploadStatus.className = 'text-emerald-400 mt-2 text-center';

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Upload gagal');
    
    const videoUrl = await response.text();
    

    videoList.push(videoUrl);
 
    uploadStatus.textContent = 'Video berhasil diupload!';
    setTimeout(() => {
      hideUploadModal();
      showVideo(videoList.length - 1); 
    }, 1500);
    
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('upload-status').textContent = 'Gagal mengupload video. Silakan coba lagi.';
    document.getElementById('upload-status').className = 'text-red-400 mt-2 text-center';
  }
}


document.getElementById('video-upload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  

  if (file.size > 100 * 1024 * 1024) {
    alert('Ukuran file terlalu besar. Maksimal 100MB');
    return;
  }
  
  if (!file.type.startsWith('video/')) {
    alert('File harus berupa video');
    return;
  }
  
  handleVideoUpload(file);
});


const dropZone = document.getElementById('upload-drop');

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('border-emerald-400');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('border-emerald-400');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('border-emerald-400');
  
  const file = e.dataTransfer.files[0];
  if (!file) return;
  
  if (file.size > 100 * 1024 * 1024) {
    alert('Ukuran file terlalu besar. Maksimal 100MB');
    return;
  }
  
  if (!file.type.startsWith('video/')) {
    alert('File harus berupa video');
    return;
  }
  
  handleVideoUpload(file);
});


document.getElementById('btn-upload-video').addEventListener('click', () => {
  document.getElementById('video-upload').click();
});

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


document.addEventListener('DOMContentLoaded', () => {
  if (videoList.length > 0) {
    showVideo(0);
  }
});

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
    if (videoList.length > 0) {
      showVideo(0);
    }
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
  const zoomOverlay = document.createElement('div');
  zoomOverlay.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-[99999]';
  
  zoomOverlay.innerHTML = `
    <div class="relative max-w-lg w-full bg-slate-900 rounded-2xl p-6 transform scale-95 transition-all duration-300">
      <button class="absolute top-2 right-2 text-white/80 hover:text-white transition-colors" onclick="event.stopPropagation()">
        <i class="fas fa-times text-xl"></i>
      </button>
      <img src="${imgSrc}" alt="QR Code Donasi" class="w-full h-auto rounded-lg">
      <div class="text-center mt-4 text-slate-400">Scan QR code untuk melakukan donasi</div>
    </div>
  `;
  
  zoomOverlay.addEventListener('click', (e) => {
    if (e.target === zoomOverlay || e.target.closest('button')) {
      e.stopPropagation();
      zoomOverlay.classList.add('opacity-0');
      setTimeout(() => {
        zoomOverlay.remove();
      }, 300);
    }
  });
  
  zoomOverlay.querySelector('.relative').addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  document.body.appendChild(zoomOverlay);
  requestAnimationFrame(() => {
    zoomOverlay.querySelector('div').classList.remove('scale-95');
    zoomOverlay.querySelector('div').classList.add('scale-100');
  });
}

function togglePopup() {
const popup = document.getElementById('bacardiPopup');
  popup.innerHTML = `
  <div class="bg-slate-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-emerald-500/30 relative">
    <button onclick="togglePopup()" class="absolute top-4 right-4 text-white hover:text-red-400 transition-transform hover:rotate-90 duration-300">
      <i class="fas fa-times text-xl"></i>
    </button>
    <h2 class="text-2xl font-bold text-center text-white mb-6">Bacardi Host</h2>
    <div class="flex flex-col gap-4">
      <button onclick="downloadHost()" 
              class="btn-modern bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
        <i class="fas fa-download"></i>
        Download Vhost
      </button>
      <button onclick="copyText('https://gtpshost.com/BacardiPS-G.txt', 'Power Tunnel')" 
              class="btn-modern bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
        <i class="fas fa-bolt"></i>
        Power tunnel
      </button>
      <button onclick="copyText('https://ios.gtpshost.com/BacardiPS-G', 'IOS Host')" 
              class="btn-modern bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
        <i class="fab fa-apple"></i>
        IOS Host
      </button>
      <button onclick="toggleAppHost()" 
              class="btn-modern bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
        <i class="fas fa-mobile-alt"></i>
        App Host
      </button>
      <a href="https://chat.whatsapp.com/IUyX4WyHmBOA2mEdC6TFYG" 
         target="_blank"
         class="btn-modern bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
        <i class="fab fa-whatsapp"></i>
        Join Group BacardiPS
      </a>
    </div>
  </div>`;
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

// AI Chat Implementation
const aiChatButton = document.getElementById('ai-chat-button');
const aiChatContainer = document.getElementById('ai-chat-container');
const closeAiChat = document.getElementById('close-ai-chat');
const chatMessages = document.getElementById('chat-messages');
const aiChatForm = document.getElementById('ai-chat-form');
const aiChatInput = document.getElementById('ai-chat-input');

const OPENROUTER_API_KEY = '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';

function toggleAiChat() {
  aiChatContainer.classList.toggle('active');
  if (aiChatContainer.classList.contains('active')) {
    aiChatInput.focus();
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
        `<img src="https://files.catbox.moe/jtnwri.png" alt="BacardiPS AI" class="w-full h-full object-cover">`
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
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://bacardips.netlify.app/",
        "X-Title": "BacardiPS",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1:free",
        "messages": [
          {
            "role": "system",
            "content": "Kamu adalah asisten AI BacardiPS yang membantu pemain dengan informasi seputar GTPS dan game Growtopia. Selalu berikan respons yang ramah dan helpful."
          },
          {
            "role": "user",
            "content": message
          }
        ]
      })
    });

    chatMessages.removeChild(typingDiv);

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    

    addMessage(aiResponse);
  } catch (error) {
    console.error('Error:', error);
    addMessage('Maaf, terjadi kesalahan. Silakan coba lagi nanti.');
  }
}

aiChatButton.addEventListener('click', toggleAiChat);
closeAiChat.addEventListener('click', toggleAiChat);
aiChatForm.addEventListener('submit', handleSubmit);


document.addEventListener('click', (e) => {
  if (!aiChatContainer.contains(e.target) && !aiChatButton.contains(e.target)) {
    aiChatContainer.classList.remove('active');
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
