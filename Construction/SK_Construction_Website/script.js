// script.js - shared behaviour
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function(){
  // Lightbox
  document.querySelectorAll('[data-img]').forEach(btn=>{
    btn.addEventListener('click', function(e){
      const src = this.dataset.img;
      openLightbox(src);
    });
  });

  initScrollReveals();
  initCounters();
});
function openLightbox(src){
  const modal = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  modal.classList.add('open');
}
function closeLightbox(){
  const modal = document.getElementById('lightbox');
  modal.classList.remove('open');
  document.getElementById('lightbox-img').src = '';
}

function handleContactSubmit(event){
  const phoneEl = document.getElementById('cphone');
  const phone = (phoneEl?.value || '').replace(/\D/g, '');

  if (phone.length !== 10) {
    event?.preventDefault();
    alert('Please enter a valid 10-digit phone number.');
    phoneEl?.focus();
    return false;
  }

  event?.preventDefault();

  const name = document.getElementById('cname')?.value || '';
  const phoneForEmail = phone; // digits-only
  const service = document.getElementById('cservice')?.value || '';
  const details = document.getElementById('cmsg')?.value || '';

  saveContactSubmission({ name, phone: phoneForEmail, service, details });
  setContactStatus('Saved! We will contact you soon.');

  const subject = encodeURIComponent('New enquiry from SK Construction website');
  const body = encodeURIComponent(
    'Name: ' + name +
    '\nPhone: ' + phoneForEmail +
    '\nService: ' + service +
    '\n\nProject details:\n' + details
  );

  const to = 'syedmuhammedsr@gmail.com';
  const gmailUrl =
    'https://mail.google.com/mail/?view=cm&fs=1&to=' +
    encodeURIComponent(to) +
    '&su=' +
    subject +
    '&body=' +
    body;

  // Keep the site visible (theme unchanged) and open Gmail compose in a new tab.
  window.open(gmailUrl, '_blank', 'noopener');

  return false;
}

function sendMailPrefill(name, phone, service, details){
  const phoneDigits = String(phone || '').replace(/\D/g, '').slice(0, 10);

  if (phoneDigits.length !== 10) {
    alert('Please enter a valid 10-digit phone number.');
    document.getElementById('cphone')?.focus();
    return false;
  }

  const safeName = String(name || '').trim();
  const safeService = String(service || '').trim();
  const safeDetails = String(details || '').trim();

  saveContactSubmission({ name: safeName, phone: phoneDigits, service: safeService, details: safeDetails });
  setContactStatus('Saved! We will contact you soon.');

  const subject = encodeURIComponent('New enquiry from SK Construction website');
  const body = encodeURIComponent(
    'Name: ' + safeName +
    '\nPhone: ' + phoneDigits +
    '\nService: ' + safeService +
    '\n\nProject details:\n' + safeDetails
  );

  const to = 'syedmuhammedsr@gmail.com';
  const gmailUrl =
    'https://mail.google.com/mail/?view=cm&fs=1&to=' +
    encodeURIComponent(to) +
    '&su=' +
    subject +
    '&body=' +
    body;

  window.open(gmailUrl, '_blank', 'noopener');
  return false;
}

function setContactStatus(message){
  const el = document.getElementById('contact-status');
  if (!el) return;
  el.textContent = message || '';
}

function saveContactSubmission(submission){
  try {
    const key = 'sk_contact_submissions_v1';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const list = Array.isArray(existing) ? existing : [];
    list.unshift({
      ...submission,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(key, JSON.stringify(list.slice(0, 100)));
  } catch {
    // Ignore storage failures (private mode, disabled storage, etc.)
  }
}

function initScrollReveals(){
  const items = Array.from(document.querySelectorAll('.reveal'));
  if (items.length === 0) return;

  const show = (el)=> el.classList.add('is-visible');

  if (!('IntersectionObserver' in window)) {
    items.forEach(show);
    return;
  }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (!entry.isIntersecting) return;
      show(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  items.forEach(el=> io.observe(el));
}

function initCounters(){
  const counters = Array.from(document.querySelectorAll('.counter[data-target]'));
  if (counters.length === 0) return;

  const animateOne = (el)=>{
    if (el.dataset.counted === '1') return;
    el.dataset.counted = '1';

    const target = Number(el.dataset.target || '0');
    const suffix = el.dataset.suffix || '';
    el.textContent = '0' + suffix;
    const durationMs = 1100;
    const start = performance.now();

    const tick = (now)=>{
      const t = Math.min(1, (now - start) / durationMs);
      // Ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = String(value) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateOne);
    return;
  }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (!entry.isIntersecting) return;
      const el = entry.target;
      animateOne(el);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(el=> io.observe(el));
}
