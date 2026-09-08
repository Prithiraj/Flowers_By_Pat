(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const cartButton = $('#cartButton');
  const cartDrawer = $('#cartDrawer');
  const cartClose = $('#cartClose');
  const drawerBackdrop = $('#drawerBackdrop');
  const cartItems = $('#cartItems');
  const cartCount = $('#cartCount');
  const cartEmpty = $('#cartEmpty');
  const cartFooter = $('#cartFooter');
  const cartTotal = $('#cartTotal');
  const cartShopButton = $('#cartShopButton');
  const orderReviewButton = $('#orderReviewButton');
  const orderDialog = $('#orderDialog');
  const orderDialogClose = $('#orderDialogClose');
  const orderDialogSummary = $('#orderDialogSummary');
  const copyOrderButton = $('#copyOrderButton');
  const menuButton = $('#menuButton');
  const mobileMenu = $('#mobileMenu');
  const toast = $('#toast');
  const storageKey = 'flowers-by-pat-cart-v1';

  let toastTimer;
  let cart = loadCart();

  function loadCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }

  function money(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  function cartQuantity() {
    return cart.reduce((total, item) => total + item.qty, 0);
  }

  function cartValue() {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
  }

  function renderCart() {
    cartItems.innerHTML = '';

    cart.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div>
          <h3>${escapeHTML(item.name)}</h3>
          <p>Hand-tied seasonal bouquet</p>
          <div class="cart-item__controls" aria-label="Quantity for ${escapeHTML(item.name)}">
            <button type="button" data-cart-action="decrease" data-id="${escapeHTML(item.id)}" aria-label="Decrease ${escapeHTML(item.name)} quantity">−</button>
            <span>${item.qty}</span>
            <button type="button" data-cart-action="increase" data-id="${escapeHTML(item.id)}" aria-label="Increase ${escapeHTML(item.name)} quantity">＋</button>
          </div>
        </div>
        <div class="cart-item__price">${money(item.price * item.qty)}</div>
      `;
      cartItems.appendChild(row);
    });

    const qty = cartQuantity();
    cartCount.textContent = qty;
    cartTotal.textContent = money(cartValue());
    cartEmpty.hidden = qty > 0;
    cartFooter.hidden = qty === 0;
    cartItems.hidden = qty === 0;
    saveCart();
  }

  function addItem(button) {
    const item = {
      id: button.dataset.product,
      name: button.dataset.name,
      price: Number(button.dataset.price),
    };
    const existing = cart.find((entry) => entry.id === item.id);
    if (existing) existing.qty += 1;
    else cart.push({ ...item, qty: 1 });
    renderCart();
    showToast(`${item.name} added to your cart.`);
    button.textContent = 'Added ✓';
    setTimeout(() => { button.innerHTML = 'Add <span aria-hidden="true">＋</span>'; }, 950);
  }

  function updateQuantity(id, delta) {
    const item = cart.find((entry) => entry.id === id);
    if (!item) return;
    item.qty += delta;
    cart = cart.filter((entry) => entry.qty > 0);
    renderCart();
  }

  function openCart() {
    cartDrawer.classList.add('is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    cartButton.setAttribute('aria-expanded', 'true');
    drawerBackdrop.hidden = false;
    document.body.classList.add('no-scroll');
    setTimeout(() => cartClose.focus(), 80);
  }

  function closeCart({ restoreFocus = true } = {}) {
    cartDrawer.classList.remove('is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    cartButton.setAttribute('aria-expanded', 'false');
    drawerBackdrop.hidden = true;
    document.body.classList.remove('no-scroll');
    if (restoreFocus) cartButton.focus();
  }

  function buildOrderSummary() {
    const lines = cart.map((item) => `${item.qty} × ${item.name} — ${money(item.price * item.qty)}`);
    lines.push(`Estimated total — ${money(cartValue())}`);
    return lines.join('\n');
  }

  function openOrderReview() {
    orderDialogSummary.innerHTML = '';
    cart.forEach((item) => {
      const row = document.createElement('div');
      row.innerHTML = `<span>${item.qty} × ${escapeHTML(item.name)}</span><strong>${money(item.price * item.qty)}</strong>`;
      orderDialogSummary.appendChild(row);
    });
    const total = document.createElement('div');
    total.innerHTML = `<strong>Estimated total</strong><strong>${money(cartValue())}</strong>`;
    orderDialogSummary.appendChild(total);
    closeCart({ restoreFocus: false });
    orderDialog.showModal();
  }

  async function copyOrderSummary() {
    const summary = `Flowers by Pat order request\n\n${buildOrderSummary()}\n\nPlease confirm availability, delivery details and payment separately.`;
    try {
      await navigator.clipboard.writeText(summary);
      showToast('Order summary copied to your clipboard.');
      copyOrderButton.textContent = 'Copied ✓';
      setTimeout(() => { copyOrderButton.textContent = 'Copy order summary'; }, 1400);
    } catch {
      const temp = document.createElement('textarea');
      temp.value = summary;
      temp.setAttribute('readonly', '');
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      temp.remove();
      showToast('Order summary copied to your clipboard.');
    }
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
  }

  $$('.add-button').forEach((button) => button.addEventListener('click', () => addItem(button)));
  cartButton.addEventListener('click', openCart);
  cartClose.addEventListener('click', () => closeCart());
  drawerBackdrop.addEventListener('click', () => closeCart());
  cartShopButton.addEventListener('click', () => {
    closeCart({ restoreFocus: false });
    $('#shop').scrollIntoView({ behavior: 'smooth' });
  });
  cartItems.addEventListener('click', (event) => {
    const button = event.target.closest('[data-cart-action]');
    if (!button) return;
    updateQuantity(button.dataset.id, button.dataset.cartAction === 'increase' ? 1 : -1);
  });
  orderReviewButton.addEventListener('click', openOrderReview);
  orderDialogClose.addEventListener('click', () => orderDialog.close());
  copyOrderButton.addEventListener('click', copyOrderSummary);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && cartDrawer.classList.contains('is-open')) closeCart();
  });

  function toggleMenu(force) {
    const shouldOpen = typeof force === 'boolean' ? force : mobileMenu.hidden;
    mobileMenu.hidden = !shouldOpen;
    menuButton.setAttribute('aria-expanded', String(shouldOpen));
    menuButton.setAttribute('aria-label', shouldOpen ? 'Close menu' : 'Open menu');
  }

  menuButton.addEventListener('click', () => toggleMenu());
  $$('a', mobileMenu).forEach((link) => link.addEventListener('click', () => toggleMenu(false)));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980 && !mobileMenu.hidden) toggleMenu(false);
  });

  const chips = $$('.occasion-chip');
  const cards = $$('.product-card');
  const filterEmpty = $('#filterEmpty');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((item) => item.classList.toggle('is-active', item === chip));
      const filter = chip.dataset.filter;
      let visible = 0;
      cards.forEach((card) => {
        const tags = card.dataset.occasion.split(' ');
        const show = filter === 'all' || tags.includes(filter);
        card.classList.toggle('is-filtered', !show);
        if (show) visible += 1;
      });
      filterEmpty.hidden = visible > 0;
      $('#shopTitle').textContent = filter === 'all'
        ? 'Today’s favourites'
        : `${chip.textContent.trim()} flowers`;
      $('#shop').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const testimonials = $$('.testimonial');
  let testimonialIndex = 0;
  function showTestimonial(nextIndex) {
    testimonialIndex = (nextIndex + testimonials.length) % testimonials.length;
    testimonials.forEach((card, index) => card.classList.toggle('is-active', index === testimonialIndex));
  }
  $('#testimonialPrev').addEventListener('click', () => showTestimonial(testimonialIndex - 1));
  $('#testimonialNext').addEventListener('click', () => showTestimonial(testimonialIndex + 1));
  let testimonialTimer = setInterval(() => showTestimonial(testimonialIndex + 1), 7000);
  $('#testimonialStage').addEventListener('mouseenter', () => clearInterval(testimonialTimer));
  $('#testimonialStage').addEventListener('mouseleave', () => {
    clearInterval(testimonialTimer);
    testimonialTimer = setInterval(() => showTestimonial(testimonialIndex + 1), 7000);
  });

  $('#newsletterForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = $('#newsletterEmail');
    showToast(`Thanks — ${email.value} is on the flower-note list.`);
    email.value = '';
  });

  $('#year').textContent = new Date().getFullYear();

  const revealTargets = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -25px' });
    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  }

  function initPetals() {
    const host = $('#petalCanvas');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!host || reduceMotion || window.innerWidth < 720 || !window.THREE) return;

    const { THREE } = window;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 1, 0, -10, 10);
    camera.position.z = 5;

    const petalCanvas = document.createElement('canvas');
    petalCanvas.width = 64;
    petalCanvas.height = 64;
    const ctx = petalCanvas.getContext('2d');
    ctx.translate(32, 32);
    ctx.rotate(Math.PI / 4);
    const gradient = ctx.createRadialGradient(-6, -8, 3, 0, 0, 26);
    gradient.addColorStop(0, 'rgba(255,246,239,.92)');
    gradient.addColorStop(.55, 'rgba(239,180,161,.78)');
    gradient.addColorStop(1, 'rgba(205,115,99,.12)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(petalCanvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, opacity: .42 });
    const petals = [];

    for (let i = 0; i < 20; i += 1) {
      const sprite = new THREE.Sprite(material.clone());
      sprite.userData = {
        x: Math.random(),
        y: Math.random(),
        speed: .00007 + Math.random() * .00012,
        drift: (Math.random() - .5) * .00005,
        spin: (Math.random() - .5) * .0009,
        phase: Math.random() * Math.PI * 2,
        scale: .012 + Math.random() * .018,
      };
      scene.add(sprite);
      petals.push(sprite);
    }

    function resize() {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.right = width;
      camera.top = height;
      camera.updateProjectionMatrix();
      petals.forEach((petal) => {
        const size = Math.max(width, height) * petal.userData.scale;
        petal.scale.set(size * .55, size, 1);
      });
    }

    function placePetals(time = 0) {
      const width = host.clientWidth;
      const height = host.clientHeight;
      petals.forEach((petal) => {
        const data = petal.userData;
        data.y += data.speed * 16;
        data.x += data.drift * 16 + Math.sin(time * .0004 + data.phase) * .00005;
        if (data.y > 1.08) { data.y = -.08; data.x = Math.random(); }
        if (data.x > 1.08) data.x = -.08;
        if (data.x < -.08) data.x = 1.08;
        petal.position.set(data.x * width, data.y * height, 0);
        petal.material.rotation += data.spin * 16;
      });
    }

    let last = performance.now();
    function animate(now) {
      const delta = Math.min(now - last, 32);
      last = now;
      placePetals(now * (delta / 16));
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    requestAnimationFrame(animate);
  }

  renderCart();
  window.addEventListener('load', initPetals, { once: true });
})();
