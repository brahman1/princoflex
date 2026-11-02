/* Interface française. Identifiants de services stables pour de futures traductions. */
(() => {
  'use strict';

  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const navLinks = [...nav.querySelectorAll('a')];
  const mobile = window.matchMedia('(max-width: 960px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const form = document.getElementById('quote-form');
  const serviceInput = document.getElementById('service');
  const review = document.getElementById('quote-review');
  const summary = document.getElementById('quote-summary');
  const copyStatus = document.getElementById('copy-status');
  const emailLink = document.getElementById('open-email');
  const recipient = 'contact@princoflex.com';
  document.getElementById('current-year').textContent = new Date().getFullYear();

  const marquee = document.getElementById('partners-marquee');
  const pausePartners = document.querySelector('.partner-pause');
  if (marquee && pausePartners) {
    // Identical groups make a seamless CSS loop. Hide decorative copies from
    // assistive technology; the original list remains available without JS.
    marquee.querySelectorAll('.partner-track').forEach(track => {
      const copy = track.querySelector('.partner-group').cloneNode(true);
      copy.classList.add('is-copy');
      copy.setAttribute('aria-hidden', 'true');
      copy.inert = true;
      track.append(copy);
    });
    marquee.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
    function configurePartners() {
      marquee.classList.toggle('marquee-ready', !reducedMotion.matches);
      pausePartners.hidden = reducedMotion.matches;
    }
    pausePartners.addEventListener('click', () => {
      const paused = marquee.classList.toggle('is-paused');
      pausePartners.setAttribute('aria-pressed', String(paused));
      pausePartners.setAttribute('aria-label', paused
        ? 'Reprendre le défilement' : 'Mettre en pause le défilement');
      pausePartners.querySelector('span').textContent = paused ? 'Reprendre' : 'Pause';
    });
    reducedMotion.addEventListener('change', configurePartners);
    configurePartners();
  }

  function closeMenu(restoreFocus = false) {
    const wasOpen = nav.classList.contains('open');
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Ouvrir le menu');
    if (wasOpen && restoreFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    // The navigation precedes its toggle in the DOM.
    if (open) navLinks[0].focus();
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    closeMenu();
    const target = document.querySelector(link.hash);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });
  document.addEventListener('focusin', event => {
    if (!nav.contains(event.target) && event.target !== menu) closeMenu();
  });
  mobile.addEventListener('change', () => {
    if (mobile.matches && nav.contains(document.activeElement)) menu.focus();
    closeMenu();
  });
  document.documentElement.classList.add('navigation-ready');

  function markCurrent(id) {
    navLinks.forEach(link => {
      const current = link.hash === `#${id}`;
      link.classList.toggle('active', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  let scheduled = false;
  const sections = [...document.querySelectorAll('main section[id]')];
  function updateCurrent() {
    const threshold = document.querySelector('.site-header').offsetHeight + 40;
    const current = sections.filter(section => section.getBoundingClientRect().top <= threshold).pop();
    markCurrent((current || sections[0]).id);
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateCurrent);
    }
  }, { passive: true });
  window.addEventListener('resize', updateCurrent);
  updateCurrent();

  // Content is visible by default, including without JS or observer support.
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const appear = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          appear.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => appear.observe(element));
    document.documentElement.classList.add('reveal-pending');
  }

  function invalidateReview() {
    review.hidden = true;
    summary.value = '';
    emailLink.href = `mailto:${recipient}`;
    copyStatus.textContent = '';
  }
  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      serviceInput.value = link.dataset.service;
      serviceInput.setCustomValidity('');
      invalidateReview();
      history.replaceState(null, '', '#contact');
      document.getElementById('contact').scrollIntoView({
        behavior: reducedMotion.matches ? 'instant' : 'smooth',
      });
      document.getElementById('company').focus({ preventScroll: true });
    });
  });
  form.addEventListener('input', event => {
    event.target.setCustomValidity('');
    invalidateReview();
  });
  form.addEventListener('change', invalidateReview);
  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const field of form.querySelectorAll('[required]')) {
      field.setCustomValidity(field.value.trim() ? '' : 'Veuillez renseigner ce champ.');
    }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const value = key => String(data.get(key) || '').trim();
    const company = value('company').replace(/[\r\n]/g, ' ');
    const service = serviceInput.selectedOptions[0].textContent;
    const subject = `Demande de devis PRINCOFLEX — ${company} — ${service}`;
    const body = `Bonjour PRINCOFLEX,\n\nJe souhaite un devis pour le projet suivant :\n\nEntreprise : ${company}\nContact : ${value('name')}\nEmail : ${value('email')}\nTéléphone : ${value('phone') || 'Non renseigné'}\nSolution : ${service}\n\nDescription du projet :\n${value('message')}\n\nCordialement,\n${value('name')}`;
    const fullMailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const shortMailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}`;
    summary.value = `À : ${recipient}\nObjet : ${subject}\n\n${body}`;
    // Mail applications handle long URLs inconsistently: always offer a copy.
    const longMessage = fullMailto.length > 1800;
    emailLink.href = longMessage ? shortMailto : fullMailto;
    document.getElementById('mailto-help').textContent = longMessage
      ? 'Votre demande est longue : copiez le récapitulatif avant d’ouvrir la messagerie. Seuls le destinataire et l’objet seront préremplis.'
      : 'Votre messagerie pourra préremplir le destinataire, l’objet et le texte. Vous gardez la main sur l’envoi.';
    review.hidden = false;
    document.getElementById('review-title').focus();
  });
  document.getElementById('copy-quote').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summary.value);
      copyStatus.textContent = 'Demande copiée. Collez-la dans votre email puis envoyez-la depuis votre messagerie.';
    } catch {
      summary.focus();
      summary.select();
      copyStatus.textContent = 'La copie automatique est indisponible. Le récapitulatif est sélectionné : utilisez Ctrl+C (ou Cmd+C) pour le copier.';
    }
  });
  // Prevent a fallback GET submission when scripting is unavailable.
  form.querySelector('[type="submit"]').disabled = false;
})();
