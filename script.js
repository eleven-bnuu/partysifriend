// =========================
// Firebase Config
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyC-fmzG1Uy8h7-D1Dp3YV1DqrdXceCdKww",
  authDomain: "testi-partysifriend.firebaseapp.com",
  projectId: "testi-partysifriend",
  storageBucket: "testi-partysifriend.appspot.com",
  messagingSenderId: "631802844071",
  appId: "1:631802844071:web:f8d5da58d42703c4981c82",
  measurementId: "G-M6TZTDGDXY"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ====================
// NAVBAR MOBILE TOGGLE
// ====================
function initNavbar() {
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// ====================
// PRODUK FILTER
// ====================
function initKatalog() {
  const btnBasic = document.getElementById('filter-basic');
  const btnPremium = document.getElementById('filter-premium');
  const produkCardsBasic = document.querySelectorAll('.produk-card.basic');
  const produkCardsPremium = document.querySelectorAll('.produk-card.premium');

  function showBasic() {
    if (!btnBasic || !btnPremium) return;
    btnBasic.classList.add('active');
    btnPremium.classList.remove('active');
    produkCardsBasic.forEach(card => card.classList.remove('hidden'));
    produkCardsPremium.forEach(card => card.classList.add('hidden'));
  }

  function showPremium() {
    if (!btnBasic || !btnPremium) return;
    btnPremium.classList.add('active');
    btnBasic.classList.remove('active');
    produkCardsPremium.forEach(card => card.classList.remove('hidden'));
    produkCardsBasic.forEach(card => card.classList.add('hidden'));
  }

  if (btnBasic && btnPremium) {
    btnBasic.addEventListener('click', showBasic);
    btnPremium.addEventListener('click', showPremium);
    showBasic(); // default Basic
  }
}

// ====================
// FAQ ACCORDION
// ====================
function initFaq() {
  function toggleFaq(id) {
    const content = document.getElementById(id + '-content');
    const button = document.getElementById(id);
    const icon = document.getElementById(id + '-icon');
    if (!content || !button || !icon) return;

    const expanded = button.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      content.classList.add('hidden');
      button.setAttribute('aria-expanded', 'false');
      icon.classList.remove('rotate-180');
    } else {
      // tutup semua
      document.querySelectorAll('[id^="faq"][aria-expanded="true"]').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        const c = document.getElementById(btn.id + '-content');
        const i = document.getElementById(btn.id + '-icon');
        if (c) c.classList.add('hidden');
        if (i) i.classList.remove('rotate-180');
      });
      content.classList.remove('hidden');
      button.setAttribute('aria-expanded', 'true');
      icon.classList.add('rotate-180');
    }
  }
  window.toggleFaq = toggleFaq;
}

// ====================
// CAROUSEL TESTIMONI
// ====================
function initCarousel() {
  const carouselInner = document.getElementById('carousel-inner');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (carouselInner && prevBtn && nextBtn) {
    const totalSlides = carouselInner.children.length;
    let currentIndex = 0;

    function updateCarousel() {
      carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    });

    // auto slide
    setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    }, 5000);
  }
}

// ====================
// DEFAULT AVATARS RANDOM
// ====================
const defaultAvatars = [
  "./img/avatars/avatar1.jpg",
  "./img/avatars/avatar2.jpg",
  "./img/avatars/avatar3.jpg",
  "./img/avatars/avatar4.jpg",
  "./img/avatars/avatar5.jpg"
];

function getRandomAvatar() {
  const i = Math.floor(Math.random() * defaultAvatars.length);
  return defaultAvatars[i];
}

// ====================
// RENDER TESTIMONI
// ====================
function renderTestimoni(testimonials) {
  const grid = document.getElementById('testimoni-grid');
  const carousel = document.getElementById('carousel-inner');
  if (!grid || !carousel) return;

  grid.innerHTML = '';
  carousel.innerHTML = '';

  testimonials.forEach(t => {
    const fotoSrc = t.foto && t.foto.trim() !== "" ? t.foto : getRandomAvatar();

    const cardHTML = `
      <div class="bg-coklat p-6 rounded-xl flex flex-col items-center min-w-full md:min-w-0">
        <img src="${fotoSrc}" alt="Foto ${t.nama}" class="rounded-full mb-4 w-24 h-24 object-cover">
        <h3 class="font-fjalla text-coklat text-lg mb-2">${t.nama}</h3>
        <p class="text-gray-700 font-mandali max-w-xs text-center">"${t.pesan}"</p>
      </div>
    `;
    grid.innerHTML += cardHTML;
    carousel.innerHTML += `<div class="w-full flex-shrink-0">${cardHTML}</div>`;
  });
}

// ====================
// DUMMY TESTIMONI
// ====================
const dummyTestimoni = [
  {
    nama: "Dewi Lestari",
    foto: "",
    pesan: "Produk berkualitas dan pelayanan cepat membuat saya sangat puas berbelanja di sini."
  },
  {
    nama: "Budi Santoso",
    foto: "",
    pesan: "Pilihan produk lengkap dan harga bersaing, sangat direkomendasikan untuk semua kalangan."
  },
  {
    nama: "Sari Wulandari",
    foto: "",
    pesan: "Layanan pelanggan yang ramah dan produk yang sesuai ekspektasi membuat saya kembali lagi."
  }
];

// ====================
// LOAD TESTIMONI FIRESTORE
// ====================
async function loadTestimoniFromFirestore() {
  try {
    const snapshot = await db.collection("testimoni").orderBy("createdAt", "desc").get();
    const testimonials = snapshot.docs.map(doc => doc.data());
    if (testimonials.length > 0) {
      renderTestimoni(testimonials);
    } else {
      console.warn("Firestore kosong, fallback ke dummy");
      renderTestimoni(dummyTestimoni);
    }
    initCarousel();
  } catch (e) {
    console.error("Gagal load testimoni:", e);
    // fallback
    renderTestimoni(dummyTestimoni);
    initCarousel();
  }
}

// ====================
// LOAD SECTION
// ====================
function loadSection(id, url, callback) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Gagal load " + url);
      return response.text();
    })
    .then(data => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = data;
        if (typeof callback === "function") callback();
      }
    })
    .catch(error => console.error("Error:", error));
}

// ====================
// INIT APP
// ====================
[
  ["home", "./home.html", initNavbar],
  ["fitur", "./fitur.html", null],
  ["katalog", "./katalog.html", initKatalog],
  ["kami", "./kami.html", null],
  ["testimoni", "./testimoni.html", loadTestimoniFromFirestore],
  ["faq", "./faq.html", initFaq],
  ["kontak", "./kontak.html", null],
  ["footer", "./footer.html", null],
].forEach(([id, file, initFn]) => loadSection(id, file, initFn));
