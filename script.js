$(function () {
  'use strict';

  /* =========================================================
     1. PRELOADER YOPILISHI
  ========================================================= */
  function dismissLoader() {
    $('#preloader').addClass('hidden-loader');
  }

  $(window).on('load', function () {
    setTimeout(dismissLoader, 500);
  });
  setTimeout(dismissLoader, 1800);

  /* =========================================================
     2. MAXSUS KURSOR (DESKTOP)
  ========================================================= */
  const $dot = $('.cursor-dot');
  const $ring = $('.cursor-ring');

  if (window.matchMedia('(pointer: fine)').matches) {
    $(document).on('mousemove', function (e) {
      $dot.css({ left: e.clientX + 'px', top: e.clientY + 'px' });
      $ring.css({ left: e.clientX + 'px', top: e.clientY + 'px' });
    });

    $('a, button, .work-card, .skill-box, .channel-card').on('mouseenter', function () {
      $ring.addClass('is-expanded');
    }).on('mouseleave', function () {
      $ring.removeClass('is-expanded');
    });
  }

  /* =========================================================
     3. SCROLL PROGRESS, STICKY NAVBAR VA TEPAGA QAYTISH
  ========================================================= */
  $(window).on('scroll', function () {
    const winTop = $(this).scrollTop();
    const docSpan = $(document).height() - $(window).height();
    const progress = docSpan > 0 ? (winTop / docSpan) * 100 : 0;

    $('#topProgress').css('width', progress + '%');
    $('#mainNavbar').toggleClass('nav-compact', winTop > 36);
    $('#scrollTopBtn').toggleClass('is-visible', winTop > 420);
  });

  $('#scrollTopBtn').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 550);
  });

  $('.navbar-nav .nav-link').on('click', function () {
    const navEl = document.getElementById('navbarContent');
    if (navEl && navEl.classList.contains('show')) {
      const instance = bootstrap.Collapse.getInstance(navEl);
      if (instance) instance.hide();
    }
  });

  /* =========================================================
     4. HERO AYLANUVCHI MATN (TYPING EFFECT)
  ========================================================= */
  const roleList = [
    'Web Dasturchi',
    'Frontend Developer',
    'UI Dizayner'
  ];
  let idx = 0;
  let chIdx = 0;
  let erasing = false;
  const $roleEl = $('#roleRotator');

  function runRoleType() {
    const word = roleList[idx];

    if (erasing) {
      chIdx--;
      $roleEl.text(word.substring(0, chIdx));
    } else {
      chIdx++;
      $roleEl.text(word.substring(0, chIdx));
    }

    let delay = erasing ? 55 : 105;

    if (!erasing && chIdx === word.length) {
      delay = 1750;
      erasing = true;
    } else if (erasing && chIdx === 0) {
      erasing = false;
      idx = (idx + 1) % roleList.length;
      delay = 380;
    }

    setTimeout(runRoleType, delay);
  }

  runRoleType();

  /* =========================================================
     5. SCROLL REVEAL, HISOBLAGICH VA SKILL PROGRESS
  ========================================================= */
  let statsDone = false;
  let barsDone = false;

  function startStats() {
    if (statsDone) return;
    statsDone = true;

    $('.counter-num').each(function () {
      const $num = $(this);
      const goal = parseInt($num.attr('data-target'), 10);

      $({ current: 0 }).animate(
        { current: goal },
        {
          duration: 1600,
          easing: 'swing',
          step: function (val) {
            $num.text(Math.floor(val));
          },
          complete: function () {
            $num.text(goal);
          }
        }
      );
    });
  }

  function startSkillBars() {
    if (barsDone) return;
    barsDone = true;

    $('.skill-bar-fill').each(function () {
      $(this).css('width', $(this).attr('data-width'));
    });
  }

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        $(entry.target).addClass('is-visible');

        if ($(entry.target).closest('#about').length || entry.target.id === 'about') {
          startStats();
        }
        if ($(entry.target).closest('#skills').length || entry.target.id === 'skills') {
          startSkillBars();
        }
      });
    },
    { threshold: 0.14 }
  );

  $('.reveal-box').each(function () {
    revealObserver.observe(this);
  });

  /* =========================================================
     6. 3D TILT EFFEKTI (DESKTOP)
  ========================================================= */
  if (window.matchMedia('(pointer: fine)').matches) {
    $('.tilt-panel').on('mousemove', function (e) {
      const box = this.getBoundingClientRect();
      const rx = ((e.clientY - box.top - box.height / 2) / (box.height / 2)) * -4.5;
      const ry = ((e.clientX - box.left - box.width / 2) / (box.width / 2)) * 4.5;
      $(this).css('transform', `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`);
    }).on('mouseleave', function () {
      $(this).css('transform', 'perspective(800px) rotateX(0deg) rotateY(0deg)');
    });
  }

  /* =========================================================
     7. OWL CAROUSEL SOZLAMALARI
  ========================================================= */
  const $carousel = $('.portfolio-carousel');

  $carousel.owlCarousel({
    loop: true,
    margin: 24,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 4500,
    autoplayHoverPause: true,
    smartSpeed: 650,
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      992: { items: 3 }
    }
  });

  $('.next-slide').on('click', function () {
    $carousel.trigger('next.owl.carousel');
  });

  $('.prev-slide').on('click', function () {
    $carousel.trigger('prev.owl.carousel');
  });

  /* =========================================================
     8. ALOQA FORMASI VALIDATSIYASI
  ========================================================= */
  $('#portfolioContactForm').on('submit', function (e) {
    e.preventDefault();

    const $name = $('#userName');
    const $email = $('#userEmail');
    const $msg = $('#userMessage');
    const $alert = $('#contactSuccessMsg');

    const nameText = $.trim($name.val());
    const emailText = $.trim($email.val());
    const msgText = $.trim($msg.val());
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailText);

    let ok = true;

    if (nameText.length < 2) {
      $name.addClass('is-invalid');
      ok = false;
    } else {
      $name.removeClass('is-invalid');
    }

    if (!validEmail) {
      $email.addClass('is-invalid');
      ok = false;
    } else {
      $email.removeClass('is-invalid');
    }

    if (msgText.length < 8) {
      $msg.addClass('is-invalid');
      ok = false;
    } else {
      $msg.removeClass('is-invalid');
    }

    if (ok) {
      $alert.removeClass('d-none');
      this.reset();
      setTimeout(function () {
        $alert.addClass('d-none');
      }, 5000);
    }
  });

  $('#portfolioContactForm input, #portfolioContactForm textarea').on('input', function () {
    $(this).removeClass('is-invalid');
  });

  /* =========================================================
     9. JORNI YILINI AVTOMATIK QO'YISH
  ========================================================= */
  $('#yearNow').text(new Date().getFullYear());
});