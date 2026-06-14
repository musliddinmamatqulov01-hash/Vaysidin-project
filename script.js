/* ============================================================
   IRONPEAK – script.js
   Full interactivity: nav, cart, products, animations, forms
   ============================================================ */

'use strict';

/* ── PRODUCT DATA ───────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    name: 'Olympic Barbell Pro',
    category: 'equipment',
    price: 289,
    oldPrice: null,
    desc: 'Competition-grade 20kg Olympic barbell with dual knurl marks. Rated to 1500lbs.',
    emoji: '🏋️',
    badge: 'bestseller',
    rating: 4.9,
    reviews: 312,
    featured: true
  },
  {
    id: 2,
    name: 'Hex Dumbbell Set 5–50lb',
    category: 'equipment',
    price: 449,
    oldPrice: 579,
    desc: 'Premium rubber-coated hex dumbbells. 10-pair complete set with rolling storage rack.',
    emoji: '🔩',
    badge: 'sale',
    rating: 4.8,
    reviews: 187,
    featured: true
  },
  {
    id: 3,
    name: 'Creatine Monohydrate 500g',
    category: 'supplements',
    price: 34,
    oldPrice: null,
    desc: 'Pharmaceutical-grade creatine monohydrate. 5000mg per serving. Unflavored & mixes clean.',
    emoji: '🧪',
    badge: 'new',
    rating: 4.7,
    reviews: 425,
    featured: true
  },
  {
    id: 4,
    name: 'Whey Protein Isolate 5lb',
    category: 'supplements',
    price: 79,
    oldPrice: 99,
    desc: '27g protein per scoop. Cold-processed isolate with 5g BCAAs. 4 flavors available.',
    emoji: '🥛',
    badge: 'sale',
    rating: 4.9,
    reviews: 654,
    featured: true
  },
  {
    id: 5,
    name: 'Performance Training Tee',
    category: 'apparel',
    price: 44,
    oldPrice: null,
    desc: '4-way stretch moisture-wicking fabric. Anti-odor treatment. Available in 8 colors.',
    emoji: '👕',
    badge: null,
    rating: 4.6,
    reviews: 89,
    featured: false
  },
  {
    id: 6,
    name: 'Power Rack X7 Pro',
    category: 'equipment',
    price: 1299,
    oldPrice: 1599,
    desc: 'Commercial-grade squat rack with pull-up bar, dip handles, and laser-cut numbers.',
    emoji: '🏗️',
    badge: 'sale',
    rating: 4.9,
    reviews: 98,
    featured: false
  },
  {
    id: 7,
    name: 'Lifting Straps Premium',
    category: 'accessories',
    price: 22,
    oldPrice: null,
    desc: 'Heavy-duty cotton & neoprene blend. 21" length. Secure figure-8 design.',
    emoji: '🤜',
    badge: null,
    rating: 4.5,
    reviews: 203,
    featured: false
  },
  {
    id: 8,
    name: 'Resistance Band Set 5-Pack',
    category: 'accessories',
    price: 39,
    oldPrice: null,
    desc: '10–150lb resistance levels. Natural latex construction. Includes carry bag & door anchor.',
    emoji: '🔴',
    badge: 'new',
    rating: 4.7,
    reviews: 341,
    featured: false
  },
  {
    id: 9,
    name: 'Pre-Workout SURGE',
    category: 'supplements',
    price: 54,
    oldPrice: 64,
    desc: '300mg caffeine, 6g citrulline, 3.2g beta-alanine. Clean energy. No crash formula.',
    emoji: '⚡',
    badge: 'sale',
    rating: 4.8,
    reviews: 512,
    featured: false
  },
  {
    id: 10,
    name: 'Training Shorts V2',
    category: 'apparel',
    price: 49,
    oldPrice: null,
    desc: 'Lightweight 4" inseam shorts with hidden pocket and split hem for full range of motion.',
    emoji: '🩳',
    badge: 'new',
    rating: 4.6,
    reviews: 67,
    featured: false
  },
  {
    id: 11,
    name: 'Weightlifting Belt 4"',
    category: 'accessories',
    price: 89,
    oldPrice: 119,
    desc: 'Full-grain leather with suede interior. Lever buckle. IPF-approved dimensions.',
    emoji: '🔱',
    badge: 'sale',
    rating: 4.9,
    reviews: 178,
    featured: false
  },
  {
    id: 12,
    name: 'BCAA Recovery Matrix',
    category: 'supplements',
    price: 44,
    oldPrice: null,
    desc: '2:1:1 BCAA ratio with added electrolytes and L-glutamine. 5 refreshing flavors.',
    emoji: '🧬',
    badge: null,
    rating: 4.6,
    reviews: 234,
    featured: false
  }
];

/* ── STATE ──────────────────────────────────────────────────── */
const state = {
  cart: [],
  currentPage: 'home',
  currentFilter: 'all',
  currentSort: 'default'
};

/* ── DOM HELPERS ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── LOADER ──────────────────────────────────────────────────── */
function hideLoader() {
  const loader = $('#loader');
  if (!loader || loader.dataset.hidden) return;
  loader.dataset.hidden = '1';
  loader.classList.add('hidden');
  setTimeout(() => loader.remove(), 600);
  initScrollReveal();
}


document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 1400));

window.addEventListener('load', () => setTimeout(hideLoader, 1400));

setTimeout(hideLoader, 3000);

function initNavigation() {
  const navbar   = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');

  // Sticky nav shadow on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Page routing: all [data-page] elements
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-page]');
    if (!trigger) return;
    e.preventDefault();
    const page = trigger.dataset.page;
    navigateTo(page);

    // Close mobile menu if open
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
}

function navigateTo(pageId) {
  if (state.currentPage === pageId) return;

  // Hide current page
  const current = $(`.page.active`);
  if (current) current.classList.remove('active');

  // Show target page
  const target = $(`#${pageId}`);
  if (!target) return;
  target.classList.add('active');
  state.currentPage = pageId;

  // Update nav links
  $$('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === pageId));

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Trigger reveal for new page
  setTimeout(initScrollReveal, 50);
}

/* ── PRODUCT RENDERING ───────────────────────────────────────── */
function createProductCard(product, compact = false) {
  const stars = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '');

  return `
    <div class="product-card reveal" data-id="${product.id}" data-category="${product.category}">
      <div class="product-img">
        ${product.badge ? `<div class="product-badge ${product.badge === 'sale' ? 'sale' : product.badge === 'new' ? 'new' : ''}">${product.badge === 'bestseller' ? '⭐ Best Seller' : product.badge === 'sale' ? 'Sale' : 'New'}</div>` : ''}
        ${product.emoji}
      </div>
      <div class="product-info">
        <div class="product-cat">${product.category}</div>
        <div class="product-name">${product.name}</div>
        ${!compact ? `<div class="product-desc">${product.desc}</div>` : ''}
        <div class="product-stars" title="${product.rating}/5">
          ${stars} <span style="color:var(--white-mid);font-size:0.75rem;">(${product.reviews})</span>
        </div>
        <div class="product-footer">
          <div class="product-price">
            ${product.oldPrice ? `<span class="old-price">$${product.oldPrice}</span>` : ''}
            $${product.price}
          </div>
          <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">
            + Add
          </button>
        </div>
      </div>
    </div>`;
}

function renderFeatured() {
  const grid = $('#featuredGrid');
  if (!grid) return;
  const featured = PRODUCTS.filter(p => p.featured).slice(0, 4);
  grid.innerHTML = featured.map(p => createProductCard(p, false)).join('');
}

function renderShop(products = PRODUCTS) {
  const grid = $('#shopGrid');
  if (!grid) return;
  if (products.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--white-mid);font-size:1.1rem;">No products found. Try a different filter.</div>`;
    return;
  }
  grid.innerHTML = products.map(p => createProductCard(p, false)).join('');
  setTimeout(initScrollReveal, 50);
}

function getFilteredSorted() {
  let list = [...PRODUCTS];
  if (state.currentFilter !== 'all') {
    list = list.filter(p => p.category === state.currentFilter);
  }
  switch (state.currentSort) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break;
  }
  return list;
}

/* ── SHOP FILTERS ─────────────────────────────────────────── */
function initShopControls() {
  // Filter tabs
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('.filter-tab');
    if (!tab) return;
    $$('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    state.currentFilter = tab.dataset.filter;
    renderShop(getFilteredSorted());
  });

  // Sort
  const sortSelect = $('#sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.currentSort = sortSelect.value;
      renderShop(getFilteredSorted());
    });
  }
}

/* ── CART ────────────────────────────────────────────────────── */
function initCart() {
  const cartBtn     = $('#cartBtn');
  const cartClose   = $('#cartClose');
  const cartOverlay = $('#cartOverlay');

  const openCart  = () => {
    $('#cartSidebar').classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeCart = () => {
    $('#cartSidebar').classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = state.cart.find(c => c.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ ...product, qty: 1 });
  }
  renderCart();
  showToast(`${product.name} added to cart! 🛒`);
}

function updateQty(productId, delta) {
  const item = state.cart.find(c => c.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter(c => c.id !== productId);
  }
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(c => c.id !== productId);
  renderCart();
}

function renderCart() {
  const itemsEl   = $('#cartItems');
  const countEl   = $('#cartCount');
  const totalEl   = $('#cartTotal');
  const footerEl  = $('#cartFooter');

  const totalQty   = state.cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = state.cart.reduce((s, i) => s + i.qty * i.price, 0);

  // Count badge
  countEl.textContent = totalQty;
  countEl.classList.toggle('visible', totalQty > 0);

  if (state.cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    footerEl.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-icon">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-remove="${item.id}" title="Remove">✕</button>
    </div>`).join('');

  totalEl.textContent = totalPrice.toFixed(2);
  footerEl.style.display = 'block';

  // Qty button events
  $$('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      updateQty(id, btn.dataset.action === 'inc' ? 1 : -1);
    });
  });
  $$('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.remove)));
  });
}

// Delegate add-to-cart clicks
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-to-cart');
  if (!btn) return;
  addToCart(parseInt(btn.dataset.id));
});

// Checkout button
document.addEventListener('click', (e) => {
  if (!e.target.closest('.cart-checkout')) return;
  showToast('🎉 Thank you for your order! Processing...');
  state.cart = [];
  renderCart();
  // Close cart after short delay
  setTimeout(() => {
    $('#cartSidebar').classList.remove('open');
    $('#cartOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }, 1200);
});

/* ── FORM VALIDATION ──────────────────────────────────────────── */
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name    = $('#contactName');
    const email   = $('#contactEmail');
    const message = $('#contactMessage');

    // Reset
    $$('.form-group').forEach(g => g.classList.remove('error'));
    $$('.form-error').forEach(el => el.textContent = '');
    $('#formSuccess').classList.remove('show');

    // Name
    if (!name.value.trim() || name.value.trim().length < 2) {
      setError(name, 'nameError', 'Please enter your full name (min 2 characters).');
      valid = false;
    }

    // Email
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRe.test(email.value.trim())) {
      setError(email, 'emailError', 'Please enter a valid email address.');
      valid = false;
    }

    // Message
    if (!message.value.trim() || message.value.trim().length < 10) {
      setError(message, 'msgError', 'Message must be at least 10 characters.');
      valid = false;
    }

    if (!valid) return;

    // Success
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.innerHTML = '<span class="btn-text">Send Message</span><span class="btn-arrow">→</span>';
      btn.disabled = false;
      $('#formSuccess').classList.add('show');
      showToast('Message sent! We\'ll be in touch soon.');
    }, 1200);
  });

  // Live validation clear on input
  ['contactName','contactEmail','contactMessage'].forEach(id => {
    const el = $(`#${id}`);
    if (el) el.addEventListener('input', () => {
      el.closest('.form-group')?.classList.remove('error');
    });
  });
}

function setError(input, errorId, msg) {
  input.closest('.form-group').classList.add('error');
  const errEl = $(`#${errorId}`);
  if (errEl) errEl.textContent = msg;
  input.focus();
}

/* ── NEWSLETTER ───────────────────────────────────────────────── */
function initNewsletter() {
  const btn  = $('#newsletterBtn');
  const inp  = $('#newsletterEmail');
  const note = $('#newsletterNote');
  if (!btn || !inp) return;

  btn.addEventListener('click', () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inp.value.trim() || !emailRe.test(inp.value.trim())) {
      note.textContent = 'Enter a valid email address.';
      note.style.color = 'var(--red)';
      return;
    }
    note.textContent = '✓ You\'re subscribed!';
    
    note.style.color = 'var(--neon)';
    inp.value = '';
    showToast('🎉 Subscribed! Welcome to the Vaisiddin official site');
  });
}

/* ── TOAST ────────────────────────────────────────────────────── */
function showToast(msg) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ── SCROLL REVEAL ────────────────────────────────────────────── */
function initScrollReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => {
    // Reset for re-observation on page switch
    el.classList.remove('visible');
    observer.observe(el);
  });
}

/* ── INIT ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderFeatured();
  renderShop();
  initShopControls();
  initCart();
  initContactForm();
  initNewsletter();

  // Initial scroll reveal for home page
  setTimeout(initScrollReveal, 1500);

  // Prevent default anchor behavior for footer/internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const page = link.dataset.page;
      if (page) { e.preventDefault(); navigateTo(page); }
    });
  });
});
