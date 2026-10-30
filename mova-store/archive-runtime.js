(function () {
  'use strict';
  var root = window.MOVA_ARCHIVE_ROOT || './';
  var catalog = window.MOVA_ARCHIVE_CATALOG || [];
  var key = 'mova-portfolio-cart-20261030';
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(key) || '[]'); if (!Array.isArray(cart)) cart = []; } catch (_) {}
  function archiveURL(path) { return new URL(root + path, location.href).href; }
  function money(value) { return 'NT$' + Math.round(Number(value) || 0).toLocaleString('en-US'); }
  function saveCart() { try { localStorage.setItem(key, JSON.stringify(cart)); } catch (_) {} }
  function make(tag, cls, text) {
    var el = document.createElement(tag); if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text; return el;
  }
  var dialog = make('dialog'); dialog.id = 'archive-dialog'; dialog.setAttribute('aria-label', 'MOVA 商城作品展示');
  document.body.append(dialog);
  function closeDialog() { dialog.close(); }
  function openDialog(title) {
    dialog.replaceChildren();
    var close = make('button', 'archive-close', '×'); close.type = 'button'; close.setAttribute('aria-label', '關閉'); close.addEventListener('click', closeDialog);
    dialog.append(close, make('h2', '', title));
    if (!dialog.open) dialog.showModal();
  }
  dialog.addEventListener('click', function (e) {
    if (e.target !== dialog) return;
    var r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog();
  });
  function showInfo(type, videoURL) {
    openDialog(type === 'video' ? '影片保存說明' : 'MOVA 商城作品保存版');
    dialog.append(make('p', '', type === 'video' ? '此處保存影片封面；外部影片播放器需連線開啟。' : '這是 2026 年 10 月 30 日保存的網站展示，保留當時的頁面、商品資訊與瀏覽路徑。會員、保固登錄與結帳服務由原商店系統提供。'));
    if (type === 'video' && /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+/.test(videoURL || '')) {
      var watch = make('a', 'archive-dialog-action', '開啟 YouTube 原影片（需連線）');
      watch.href = videoURL; watch.target = '_blank'; watch.rel = 'noopener noreferrer'; dialog.append(watch);
    }
    var link = make('a', 'archive-dialog-action', '繼續瀏覽保存商城'); link.href = archiveURL('index.html'); dialog.append(link);
  }
  function showCart() {
    openDialog('展示購物車');
    if (!cart.length) dialog.append(make('p', '', '目前尚未加入商品。可回到商品頁，體驗規格選擇與加入購物車。'));
    var total = 0;
    cart.forEach(function (line, index) {
      var row = make('div', 'archive-cart-line');
      var img = make('img'); img.src = archiveURL(line.image || 'assets/unavailable.svg'); img.alt = line.title;
      var text = make('div'); text.append(make('strong', '', line.title), make('small', '', line.variant + ' × ' + line.quantity + ' · ' + money(line.price)));
      var remove = make('button', '', '移除'); remove.type = 'button'; remove.addEventListener('click', function () { cart.splice(index, 1); saveCart(); showCart(); });
      row.append(img, text, remove); dialog.append(row); total += line.price * line.quantity;
    });
    if (cart.length) {
      var sum = make('div', 'archive-cart-total'); sum.append(make('span', '', '展示金額'), make('strong', '', money(total))); dialog.append(sum);
    }
    dialog.append(make('p', '', '本購物車只保留於此展示副本，不會建立訂單或付款。'));
    var keep = make('button', 'archive-dialog-action', '繼續瀏覽'); keep.type = 'button'; keep.addEventListener('click', closeDialog); dialog.append(keep);
  }
  function productFor(el) {
    var gp = el.closest('gp-product');
    if (gp) {
      try {
        var data = JSON.parse(gp.querySelector('script[gp-data]').textContent);
        var handle = data.productHandle;
        var found = catalog.find(function (p) { return p.handle === handle; });
        if (found) return found;
      } catch (_) {}
    }
    var form = el.closest('form');
    var id = form && form.querySelector('[name="id"]');
    if (id) {
      var byVariant = catalog.find(function (p) { return p.variants.some(function (v) { return String(v.id) === String(id.value); }); });
      if (byVariant) return byVariant;
    }
    return catalog.find(function (p) { return new URL(root + p.url, location.href).pathname === location.pathname; }) || null;
  }
  function addToCart(el) {
    var product = productFor(el);
    if (!product) { showCart(); return; }
    var form = el.closest('form');
    var id = form && form.querySelector('[name="id"]');
    var variant = product.variants.find(function (v) { return id && String(v.id) === String(id.value); }) || product.variants[0] || {};
    if (variant.available === false) { openDialog('當日商品狀態'); dialog.append(make('p', '', '此規格在保存的商品資訊中為售罄狀態。')); return; }
    var quantityInput = form && form.querySelector('[name="quantity"]');
    var quantity = Math.max(1, Math.min(99, Number(quantityInput && quantityInput.value) || 1));
    var existing = cart.find(function (line) { return line.variantId === variant.id; });
    if (existing) existing.quantity += quantity;
    else cart.push({variantId: variant.id, title: product.title, variant: variant.title || '標準規格', price: Number(variant.price) || 0, quantity: quantity, image: product.image, url: product.url});
    saveCart(); showCart();
  }
  document.addEventListener('click', function (event) {
    var target = event.target instanceof Element ? event.target : null;
    if (!target || target.closest('#archive-dialog')) return;
    var add = target.closest('[data-add-to-cart],button[name="add"],gp-product-button button,.product-form__submit');
    if (add) { event.preventDefault(); event.stopImmediatePropagation(); addToCart(add); return; }
    var action = target.closest('[data-archive-action]');
    if (action) { event.preventDefault(); event.stopImmediatePropagation(); if (action.dataset.archiveAction === 'cart') showCart(); else showInfo(action.dataset.archiveAction); return; }
    var cartButton = target.closest('mini-cart button,header button[aria-label*="購物車"],header [aria-label*="View cart"],[aria-controls="CartDrawer"]');
    if (cartButton) { event.preventDefault(); event.stopImmediatePropagation(); showCart(); return; }
    var productLink = target.closest('img[data-archive-product-link],gp-product-title[data-archive-product-link],h2[data-archive-product-link]');
    if (productLink) { event.preventDefault(); event.stopImmediatePropagation(); location.href = productLink.dataset.archiveProductLink; return; }
    var video = target.closest('gp-lite-youtube-embed');
    if (video) { event.preventDefault(); event.stopImmediatePropagation(); showInfo('video', video.dataset.archiveVideoUrl); return; }
    var thumb = target.closest('[data-image-src]');
    if (thumb) {
      var gallery = thumb.closest('[class*="gallery"]') || document;
      var main = gallery.querySelector('[data-main-image]') || document.querySelector('[data-main-image]');
      if (main) {
        event.preventDefault(); event.stopImmediatePropagation();
        main.src = thumb.dataset.imageSrc; main.alt = thumb.dataset.imageAlt || main.alt;
        var siblings = gallery.querySelectorAll('[data-image-src]');
        siblings.forEach(function (item) { item.classList.toggle('is-active', item === thumb); item.setAttribute('aria-pressed', String(item === thumb)); });
      }
    }
  }, true);
  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (form.dataset.archiveFormKind === 'search' || form.querySelector('[name="q"]')) {
      var query = form.querySelector('[name="q"]');
      var url = new URL(archiveURL('catalog.html')); url.searchParams.set('q', query ? query.value : ''); location.href = url.href;
    } else if (form.dataset.archiveFormKind === 'cart') addToCart(form.querySelector('button') || form);
    else showInfo('form');
  }, true);
  document.querySelectorAll('details').forEach(function (details) {
    details.addEventListener('toggle', function () { details.classList.toggle('menu-opening', details.open); });
  });
  document.querySelectorAll('img[data-src],img[data-original]').forEach(function (img) {
    var value = img.dataset.src || img.dataset.original;
    if (value && !/^(?:https?:)?\/\//.test(value)) img.src = value;
  });
  document.querySelectorAll('[class*="scroll-trigger--offscreen"]').forEach(function (el) { el.classList.remove('scroll-trigger--offscreen'); });

  var catalogGrid = document.getElementById('archive-catalog-grid');
  if (catalogGrid) {
    var search = document.getElementById('archive-catalog-query');
    var sort = document.getElementById('archive-catalog-sort');
    var initialQuery = new URLSearchParams(location.search).get('q') || '';
    search.value = initialQuery;
    function renderCatalog() {
      var query = search.value.trim().toLowerCase();
      var products = catalog.filter(function (p) { return !p.gift && (!query || (p.title + ' ' + p.handle + ' ' + p.tags.join(' ')).toLowerCase().includes(query)); });
      var price = function (p) { return Number((p.variants[0] || {}).price) || 0; };
      if (sort.value === 'price-ascending') products.sort(function (a, b) { return price(a) - price(b); });
      if (sort.value === 'price-descending') products.sort(function (a, b) { return price(b) - price(a); });
      if (sort.value === 'title-ascending') products.sort(function (a, b) { return a.title.localeCompare(b.title, 'zh-TW'); });
      catalogGrid.replaceChildren();
      products.forEach(function (p) {
        var card = make('a', 'archive-catalog-card'); card.href = archiveURL(p.url);
        var img = make('img'); img.src = archiveURL(p.image || 'assets/unavailable.svg'); img.alt = p.title; img.loading = 'lazy'; img.width = 350; img.height = 350;
        card.append(img, make('h2', '', p.title), make('p', '', money(price(p)))); catalogGrid.append(card);
      });
      document.getElementById('archive-catalog-count').textContent = '共 ' + products.length + ' 項商品';
      document.getElementById('archive-catalog-empty').hidden = products.length > 0;
    }
    search.addEventListener('input', renderCatalog); sort.addEventListener('change', renderCatalog);
    document.getElementById('archive-catalog-search').addEventListener('click', renderCatalog);
    search.addEventListener('keydown', function (event) { if (event.key === 'Enter') { event.preventDefault(); renderCatalog(); } });
    renderCatalog();
  }
}());
