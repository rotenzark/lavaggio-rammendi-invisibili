/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'lavaggio-rammendi-invisibili',
    /* nessun WhatsApp dichiarato: il telefono */
    whatsapp: { number: '', message: '', ids: [] },
    /* la scheda Google (1/10/2026), uguale al loro cartellino: lunedì–venerdì 8:45–12:30 e 15:30–19:30, sabato 8:45–12:30, domenica chiuso */
    hours: {
      0: [],
      1: [['08:45', '12:30'], ['15:30', '19:30']], 2: [['08:45', '12:30'], ['15:30', '19:30']], 3: [['08:45', '12:30'], ['15:30', '19:30']], 4: [['08:45', '12:30'], ['15:30', '19:30']], 5: [['08:45', '12:30'], ['15:30', '19:30']], 6: [['08:45', '12:30']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1100,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Lavaggio Rammendi Invisibili: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.rammendi": "Mending",
      "n.iniziali": "Initials",
      "n.lavaggio": "Cleaning",
      "n.sartoria": "Tailoring",
      "n.recensioni": "Reviews",
      "n.orari": "Hours",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "t.orari": "Hours",
      "h.secco": "dry",
      "h.acqua": "wet",
      "h.sotto": "Tailoring repairs · careful service",
      "h.occhio": "Via Negroli 45, Milan · M4 Argonne",
      "h.frase": "Laundry, dry cleaning, invisible mending, tailoring repairs and hand embroidery of initials on shirts and other garments.",
      "h.voto": "on Google, 48 reviews",
      "c.domicilio": "Collection and delivery at home",
      "c.rammendi": "Invisible mending",
      "c.sartoria": "Tailoring repairs",
      "c.via": "Via Negroli, 45 · Milan",
      "e.occhio": "Invisible mending",
      "e.titolo2": "Where was the hole?",
      "e.intro": "A hole, a tear, a ladder: invisible mending closes them thread by thread, following the weave of the cloth. It works on woven fabrics and on knitwear. We have drawn it here: the spot is marked with white tacking stitches, then come the threads, one at a time.",
      "e.frasechi": "From a review on Google (in English: “I dare you to find where the cut was!”)",
      "e.titolo": "The mending: thread by thread, until it can no longer be seen",
      "e.desc": "A square of cloth on the counter, with our yellow tag pinned to it and a hole in the middle. White tacking stitches frame the spot, the needle brings the threads one by one: first the warp, then the weft passing over and under. The mend blends into the cloth, a safety pin marks where it was and the tacking is pulled out. In the second mode the cloth is a fuchsia knit and the needle picks the stitches up one by one.",
      "e.d0": "On woven cloth: the tacking marks the spot, then the warp threads and the weft threads, over and under. At the end the safety pin tells you where it was.",
      "e.d1": "On knitwear: the tacking marks the spot, then the stitches are picked up one by one, column by column. At the end the safety pin tells you where it was.",
      "e.modi": "The cloth to mend",
      "e.b0": "Woven",
      "e.b1": "Knit",
      "a.imbastitura": "A charcoal Prince of Wales check with light blue lines: around the spot to be mended, a frame of white tacking stitches.",
      "a.maglia": "A fuchsia knit with a few ladders and a needle slipped across it.",
      "a.cachemire": "A burgundy cashmere jumper seen up close, along the seams, after the mending.",
      "l.f1": "The white tacking around the spot to be mended, on a Prince of Wales check",
      "l.f2": "A knit with its ladders, and the needle",
      "l.f3": "A cashmere after the mending (photo by a customer)",
      "i.occhio": "Hand embroidery",
      "i.titolo": "Your initials",
      "i.intro": "We embroider initials by hand on shirts and on other garments. Three pieces of work below: in blue and in red on two shirts, in white on an orange linen, in white on a blue pinstripe.",
      "a.camicie": "Two folded shirts, one white and one light blue with stripes, with the initials M.M. embroidered in blue and in red.",
      "a.lino": "An orange linen with the initials L.P. embroidered in white.",
      "a.gessato": "A blue pinstripe cloth, next to a pocket, with the initials A.M. embroidered in white.",
      "i.f1": "On shirts, in blue and in red",
      "i.f2": "On linen, in white",
      "i.f3": "On a pinstripe, next to the pocket",
      "v.occhio": "Cleaning",
      "v.titolo": "Dry and wet",
      "v.intro": "Laundry and dry cleaning: we clean both dry and with water. The list of garments is the one written on our shop window.",
      "v.intro2": "We also clean down jackets and coats and dye delicate fabrics. Leather cleaning is our speciality.",
      "v.c1": "Jumper",
      "v.c2": "Trousers",
      "v.c3": "Jacket",
      "v.c4": "Skirt",
      "v.c5": "Raincoat",
      "v.c6": "Coat",
      "v.c7": "Shirt",
      "v.c8": "Silk blouse",
      "v.c9": "Dress",
      "v.c10": "Heavy jacket",
      "v.pulitura": "We also clean",
      "v.p1": "Sofas and rugs",
      "v.p2": "Sheepskin and suede",
      "v.p3": "Leather and fur",
      "s.occhio": "Tailoring and home service",
      "s.titolo": "Tailoring repairs",
      "s.h1": "Zips, buttons and more",
      "s.t1": "A zip to replace, a button to sew back on, and the other tailoring jobs, small and large, on every kind of garment.",
      "s.h2": "Collection and delivery at home",
      "s.t2": "We come to collect your garments at home and bring them back. To arrange it, just give us a call:",
      "r.occhio": "Reviews",
      "r.titolo": "Careful service",
      "r.g25": "Google, 2025",
      "r.g23": "Google, 2023",
      "r.g22": "Google, 2022",
      "r.nota": "From the reviews on Google, as they were written, in Italian; […] where we shortened them.",
      "r.tutte": "All the reviews on Google",
      "o.occhio": "Hours and directions",
      "o.titolo": "Via Negroli 45",
      "o.orari": "Hours",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "w.dove": "Where",
      "w.dovev": "Via Negroli 45, 20133 Milan",
      "w.metro": "Metro",
      "w.metrov": "M4 Argonne, about 150 metres away; M4 Stazione Forlanini, about 400 metres away",
      "w.treno": "Train",
      "w.trenov": "the suburban rail link at Milano Forlanini station, about 450 metres away",
      "w.bus": "Bus",
      "w.busv": "the 38 and the 54 at Argonne M4, about 150 metres away; the 45 and the 175 at Via Negroli – Via Sismondi, about 160 metres away; trolleybus 93 about 200 metres away",
      "w.tel": "Phone",
      "w.mappa": "Map: Lavaggio Rammendi Invisibili, Via Negroli 45, Milan",
      "o.nota": "Hours from our Google listing (October 2026): the same as on our tag.",
      "q.occhio": "Questions",
      "q.titolo": "Before you drop by",
      "q.d1": "What can be mended?",
      "q.r1": "Woven fabrics and knitwear: trousers, jackets, suits, coats, jumpers. Bring the garment to the shop: we will look at it together.",
      "q.d2": "How much does a mend cost?",
      "q.r2": "It depends on the garment and on the damage: to find out, bring the garment to the shop or call 349 348 1074.",
      "q.d3": "Do you also embroider initials?",
      "q.r3": "Yes, by hand: on shirts and on other garments.",
      "q.d4": "Do you collect and deliver at home?",
      "q.r4": "Yes, we collect and deliver at home: to arrange it, just call 349 348 1074.",
      "q.d5": "Do you also clean leather, rugs and sofas?",
      "q.r5": "Yes: sofas and rugs, sheepskin and suede, leather and fur.",
      "q.d6": "When are you open?",
      "q.r6": "Monday to Friday from 8:45am to 12:30pm and from 3:30pm to 7:30pm, Saturday from 8:45am to 12:30pm. We are closed on Sundays.",
      "f2.orario": "Monday–Friday 8:45am–12:30pm and 3:30pm–7:30pm · Saturday 8:45am–12:30pm · closed on Sunday",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · <a href=\"privacy.html\">Privacy</a> · hours, rating and reviews from the Google listing (October 2026); photos from our Google listing, one is by a customer. We redrew the sign, the tag and the mending.",
      "f2.su": "Back to top"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ LAVAGGIO RAMMENDI INVISIBILI · Tintoria Lavanderia Gobbi — Via Negroli 45 ══════════
     la FIRMA — «il rammendo»: sul banco un quadrato di stoffa col buco; l'imbastitura bianca riquadra il punto, l'ago porta i fili
     uno a uno, il rammendo si confonde con la stoffa, la spilla da balia segna dov'era, l'imbastitura si sfila. Lo stato è M
     (Tessuto / Maglia), T (0…1) e V (0 al suo posto; fino a 1 la stoffa sale di poco e si spegne; da −1 a 0 arriva la prossima,
     col suo buco). Senza JS e alla fine: Tessuto, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): la stoffa col buco.
     Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante
     l'animazione la ferma dov'è. */
  var DATI = {"vb":[64,20,512,494],"via":-14,"modi":[{"nome":"Tessuto","imb":[[0.03,0.035],[0.044,0.035],[0.058,0.035],[0.072,0.035],[0.086,0.035],[0.1,0.035],[0.114,0.035],[0.128,0.035],[0.142,0.035]],"sfila":[[0.9,0.03],[0.90875,0.03],[0.9175,0.03],[0.92625,0.03],[0.935,0.03],[0.94375,0.03],[0.9525,0.03],[0.96125,0.03],[0.97,0.03]],"fili":[{"a":[0.2,0.02636],"p":[258,198,258,342]},{"a":[0.22636,0.02637],"p":[270,342,270,198]},{"a":[0.25273,0.02636],"p":[282,198,282,342]},{"a":[0.27909,0.02636],"p":[294,342,294,198]},{"a":[0.30545,0.02637],"p":[306,198,306,342]},{"a":[0.33182,0.02636],"p":[318,342,318,198]},{"a":[0.35818,0.02637],"p":[330,198,330,342]},{"a":[0.38455,0.02636],"p":[342,342,342,198]},{"a":[0.41091,0.02636],"p":[354,198,354,342]},{"a":[0.43727,0.02637],"p":[366,342,366,198]},{"a":[0.46364,0.02636],"p":[378,198,378,342]},{"a":[0.49,0.02636],"p":[246,210,390,210]},{"a":[0.49,0.02636],"p":[246,210,390,210]},{"a":[0.51636,0.02637],"p":[390,222,246,222]},{"a":[0.51636,0.02637],"p":[390,222,246,222]},{"a":[0.54273,0.02636],"p":[246,234,390,234]},{"a":[0.54273,0.02636],"p":[246,234,390,234]},{"a":[0.56909,0.02636],"p":[390,246,246,246]},{"a":[0.56909,0.02636],"p":[390,246,246,246]},{"a":[0.59545,0.02637],"p":[246,258,390,258]},{"a":[0.59545,0.02637],"p":[246,258,390,258]},{"a":[0.62182,0.02636],"p":[390,270,246,270]},{"a":[0.62182,0.02636],"p":[390,270,246,270]},{"a":[0.64818,0.02637],"p":[246,282,390,282]},{"a":[0.64818,0.02637],"p":[246,282,390,282]},{"a":[0.67455,0.02636],"p":[390,294,246,294]},{"a":[0.67455,0.02636],"p":[390,294,246,294]},{"a":[0.70091,0.02636],"p":[246,306,390,306]},{"a":[0.70091,0.02636],"p":[246,306,390,306]},{"a":[0.72727,0.02637],"p":[390,318,246,318]},{"a":[0.72727,0.02637],"p":[390,318,246,318]},{"a":[0.75364,0.02636],"p":[246,330,390,330]},{"a":[0.75364,0.02636],"p":[246,330,390,330]}],"va":[0.1,0.09],"riposa":[0.79,0.08],"toppa":[0.8,0.09],"spilla":[0.89,0.05],"riposo":[380,446,196],"g":215},{"nome":"Maglia","imb":[[0.03,0.035],[0.044,0.035],[0.058,0.035],[0.072,0.035],[0.086,0.035],[0.1,0.035],[0.114,0.035],[0.128,0.035],[0.142,0.035]],"sfila":[[0.9,0.03],[0.90875,0.03],[0.9175,0.03],[0.92625,0.03],[0.935,0.03],[0.94375,0.03],[0.9525,0.03],[0.96125,0.03],[0.97,0.03]],"fili":[{"a":[0.2,0.00518],"p":[257,301,264,311]},{"a":[0.20518,0.00518],"p":[264,311,271,301]},{"a":[0.21036,0.00518],"p":[257,289,264,299]},{"a":[0.21554,0.00517],"p":[264,299,271,289]},{"a":[0.22071,0.00518],"p":[257,277,264,287]},{"a":[0.22589,0.00518],"p":[264,287,271,277]},{"a":[0.23107,0.00518],"p":[257,265,264,275]},{"a":[0.23625,0.00518],"p":[264,275,271,265]},{"a":[0.24143,0.00518],"p":[257,253,264,263]},{"a":[0.24661,0.00518],"p":[264,263,271,253]},{"a":[0.25179,0.00517],"p":[257,241,264,251]},{"a":[0.25696,0.00518],"p":[264,251,271,241]},{"a":[0.26214,0.00518],"p":[257,229,264,239]},{"a":[0.26732,0.00518],"p":[264,239,271,229]},{"a":[0.2725,0.00518],"p":[273,301,280,311]},{"a":[0.27768,0.00518],"p":[280,311,287,301]},{"a":[0.28286,0.00518],"p":[273,289,280,299]},{"a":[0.28804,0.00517],"p":[280,299,287,289]},{"a":[0.29321,0.00518],"p":[273,277,280,287]},{"a":[0.29839,0.00518],"p":[280,287,287,277]},{"a":[0.30357,0.00518],"p":[273,265,280,275]},{"a":[0.30875,0.00518],"p":[280,275,287,265]},{"a":[0.31393,0.00518],"p":[273,253,280,263]},{"a":[0.31911,0.00518],"p":[280,263,287,253]},{"a":[0.32429,0.00517],"p":[273,241,280,251]},{"a":[0.32946,0.00518],"p":[280,251,287,241]},{"a":[0.33464,0.00518],"p":[273,229,280,239]},{"a":[0.33982,0.00518],"p":[280,239,287,229]},{"a":[0.345,0.00518],"p":[289,301,296,311]},{"a":[0.35018,0.00518],"p":[296,311,303,301]},{"a":[0.35536,0.00518],"p":[289,289,296,299]},{"a":[0.36054,0.00517],"p":[296,299,303,289]},{"a":[0.36571,0.00518],"p":[289,277,296,287]},{"a":[0.37089,0.00518],"p":[296,287,303,277]},{"a":[0.37607,0.00518],"p":[289,265,296,275]},{"a":[0.38125,0.00518],"p":[296,275,303,265]},{"a":[0.38643,0.00518],"p":[289,253,296,263]},{"a":[0.39161,0.00518],"p":[296,263,303,253]},{"a":[0.39679,0.00517],"p":[289,241,296,251]},{"a":[0.40196,0.00518],"p":[296,251,303,241]},{"a":[0.40714,0.00518],"p":[289,229,296,239]},{"a":[0.41232,0.00518],"p":[296,239,303,229]},{"a":[0.4175,0.00518],"p":[305,301,312,311]},{"a":[0.42268,0.00518],"p":[312,311,319,301]},{"a":[0.42786,0.00518],"p":[305,289,312,299]},{"a":[0.43304,0.00517],"p":[312,299,319,289]},{"a":[0.43821,0.00518],"p":[305,277,312,287]},{"a":[0.44339,0.00518],"p":[312,287,319,277]},{"a":[0.44857,0.00518],"p":[305,265,312,275]},{"a":[0.45375,0.00518],"p":[312,275,319,265]},{"a":[0.45893,0.00518],"p":[305,253,312,263]},{"a":[0.46411,0.00518],"p":[312,263,319,253]},{"a":[0.46929,0.00517],"p":[305,241,312,251]},{"a":[0.47446,0.00518],"p":[312,251,319,241]},{"a":[0.47964,0.00518],"p":[305,229,312,239]},{"a":[0.48482,0.00518],"p":[312,239,319,229]},{"a":[0.49,0.00518],"p":[321,301,328,311]},{"a":[0.49518,0.00518],"p":[328,311,335,301]},{"a":[0.50036,0.00518],"p":[321,289,328,299]},{"a":[0.50554,0.00517],"p":[328,299,335,289]},{"a":[0.51071,0.00518],"p":[321,277,328,287]},{"a":[0.51589,0.00518],"p":[328,287,335,277]},{"a":[0.52107,0.00518],"p":[321,265,328,275]},{"a":[0.52625,0.00518],"p":[328,275,335,265]},{"a":[0.53143,0.00518],"p":[321,253,328,263]},{"a":[0.53661,0.00518],"p":[328,263,335,253]},{"a":[0.54179,0.00517],"p":[321,241,328,251]},{"a":[0.54696,0.00518],"p":[328,251,335,241]},{"a":[0.55214,0.00518],"p":[321,229,328,239]},{"a":[0.55732,0.00518],"p":[328,239,335,229]},{"a":[0.5625,0.00518],"p":[337,301,344,311]},{"a":[0.56768,0.00518],"p":[344,311,351,301]},{"a":[0.57286,0.00518],"p":[337,289,344,299]},{"a":[0.57804,0.00517],"p":[344,299,351,289]},{"a":[0.58321,0.00518],"p":[337,277,344,287]},{"a":[0.58839,0.00518],"p":[344,287,351,277]},{"a":[0.59357,0.00518],"p":[337,265,344,275]},{"a":[0.59875,0.00518],"p":[344,275,351,265]},{"a":[0.60393,0.00518],"p":[337,253,344,263]},{"a":[0.60911,0.00518],"p":[344,263,351,253]},{"a":[0.61429,0.00517],"p":[337,241,344,251]},{"a":[0.61946,0.00518],"p":[344,251,351,241]},{"a":[0.62464,0.00518],"p":[337,229,344,239]},{"a":[0.62982,0.00518],"p":[344,239,351,229]},{"a":[0.635,0.00518],"p":[353,301,360,311]},{"a":[0.64018,0.00518],"p":[360,311,367,301]},{"a":[0.64536,0.00518],"p":[353,289,360,299]},{"a":[0.65054,0.00517],"p":[360,299,367,289]},{"a":[0.65571,0.00518],"p":[353,277,360,287]},{"a":[0.66089,0.00518],"p":[360,287,367,277]},{"a":[0.66607,0.00518],"p":[353,265,360,275]},{"a":[0.67125,0.00518],"p":[360,275,367,265]},{"a":[0.67643,0.00518],"p":[353,253,360,263]},{"a":[0.68161,0.00518],"p":[360,263,367,253]},{"a":[0.68679,0.00517],"p":[353,241,360,251]},{"a":[0.69196,0.00518],"p":[360,251,367,241]},{"a":[0.69714,0.00518],"p":[353,229,360,239]},{"a":[0.70232,0.00518],"p":[360,239,367,229]},{"a":[0.7075,0.00518],"p":[369,301,376,311]},{"a":[0.71268,0.00518],"p":[376,311,383,301]},{"a":[0.71786,0.00518],"p":[369,289,376,299]},{"a":[0.72304,0.00517],"p":[376,299,383,289]},{"a":[0.72821,0.00518],"p":[369,277,376,287]},{"a":[0.73339,0.00518],"p":[376,287,383,277]},{"a":[0.73857,0.00518],"p":[369,265,376,275]},{"a":[0.74375,0.00518],"p":[376,275,383,265]},{"a":[0.74893,0.00518],"p":[369,253,376,263]},{"a":[0.75411,0.00518],"p":[376,263,383,253]},{"a":[0.75929,0.00517],"p":[369,241,376,251]},{"a":[0.76446,0.00518],"p":[376,251,383,241]},{"a":[0.76964,0.00518],"p":[369,229,376,239]},{"a":[0.77482,0.00518],"p":[376,239,383,229]}],"va":[0.1,0.09],"riposa":[0.79,0.08],"toppa":[0.8,0.09],"spilla":[0.89,0.05],"riposo":[380,446,196],"g":215}],"tempi":{"inizio":300,"rammendo":6000,"servi":420,"arriva":480,"rammendoV":5000}};
  /* il rammendo a (M, T, V) — una sola fonte: la usano _lri_firma.mjs (l'HTML allo stato finale), main.js (via main.cjs) e la
     prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     Un quadrato di stoffa col buco: l'imbastitura bianca lo riquadra un punto alla volta, l'ago porta i fili uno a uno (ogni
     filo è una linea che si allunga dal suo capo), il rammendo si confonde con la stoffa (la toppa), la spilla da balia segna
     dov'era, l'imbastitura si sfila e l'ago torna a posarsi. Col V la stoffa sale di poco e si spegne; arriva la prossima, col
     suo buco. */
  function creaRammendo(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w[0] + w[1] - 1e-9 ? 1 : c01((t - w[0]) / w[1]); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var q = function (sel) { return svg.querySelector(sel); };
    var servito = q('.servito');
    var uno = function (cl, m, k) { return q('.' + cl + '[data-m="' + m + '"]' + (k === undefined ? '' : '[data-k="' + k + '"]')); };
    var pezzi = D.modi.map(function (M, m) {
      return {
        imb: M.imb.map(function (_, k) { return uno('rm-imb', m, k); }),
        fili: M.fili.map(function (_, k) { return uno('rm-filo', m, k); }),
        toppa: uno('rm-toppa', m), spilla: uno('rm-spilla', m), ago: uno('rm-ago', m)
      };
    });
    function disegna(m, t, v) {
      var P = pezzi[m], M = D.modi[m], k, u, F, testa = null;
      /* l'imbastitura: ogni punto compare (dolce) e alla fine si sfila (dolce) */
      for (k = 0; k < P.imb.length; k++) P.imb[k].setAttribute('opacity', r3(dolce(fase(t, M.imb[k])) - dolce(fase(t, M.sfila[k]))));
      /* i fili: ognuno si allunga dal suo capo, a passo costante; prima di cominciare non si vede */
      for (k = 0; k < P.fili.length; k++) {
        F = M.fili[k]; u = fase(t, F.a);
        var x = F.p[0] + (F.p[2] - F.p[0]) * u, y = F.p[1] + (F.p[3] - F.p[1]) * u;
        P.fili[k].setAttribute('x2', r1(x));
        P.fili[k].setAttribute('y2', r1(y));
        P.fili[k].setAttribute('opacity', u > 0 ? 1 : 0);
        if (u > 0) testa = [x, y];
      }
      /* il rammendo si confonde con la stoffa; la spilla segna dov'era */
      P.toppa.setAttribute('opacity', r3(dolce(fase(t, M.toppa))));
      P.spilla.setAttribute('opacity', r3(dolce(fase(t, M.spilla))));
      /* l'ago: dal riposo al capo del primo filo, poi in testa al filo che si allunga, alla fine di nuovo a riposo */
      var R = M.riposo, ax, ay, ag, w;
      if (!testa) {
        w = dolce(fase(t, M.va)); F = M.fili[0].p;
        ax = R[0] + (F[0] - R[0]) * w; ay = R[1] + (F[1] - R[1]) * w; ag = R[2] + (M.g - R[2]) * w;
      } else {
        w = dolce(fase(t, M.riposa));
        ax = testa[0] + (R[0] - testa[0]) * w; ay = testa[1] + (R[1] - testa[1]) * w; ag = M.g + (R[2] - M.g) * w;
      }
      P.ago.setAttribute('transform', 'translate(' + r1(ax) + ' ' + r1(ay) + ') rotate(' + r1(ag) + ')');
      /* col V la stoffa sale di poco e si spegne; la prossima arriva */
      servito.setAttribute('transform', 'translate(0 ' + r1(D.via * v) + ')');
      servito.setAttribute('opacity', r3(1 - Math.abs(v)));
    }
    var completo = !!servito && pezzi.every(function (P) { return P.toppa && P.spilla && P.ago && P.imb.every(Boolean) && P.fili.every(Boolean); });
    return { disegna: disegna, pezzi: pezzi, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('rammendo-firma'), svgF = prendi('rammendoSvg'), leggiF = prendi('rammendoLeggi');
  var RAMMENDO = svgF ? creaRammendo(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.rammendo__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.rammendo__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    RAMMENDO.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) RAMMENDO.disegna(k, 1, 0); });
    RAMMENDO.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta la stoffa col buco */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: la stoffa col buco */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.rammendo, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.rammendo });
  }
  /* il gesto: scegliere che cosa guardare. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è,
     la scena scende e si spegne, arriva dall'alto la prossima, vuota, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.rammendoV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && RAMMENDO && RAMMENDO.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaRammendo); } catch (e) {}
    window.__rammendo = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__rammendo.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta la stoffa col buco */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__rammendo.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
