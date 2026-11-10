(function ($) {
  const mq = window.matchMedia('(max-width: 1023px)');

  // ─── Sliders ────────────────────────────────────────────────────────────────

  function toggleSlick($sliders, enable, options) {
    $sliders.each(function () {
      const $s = $(this);
      const inited = $s.hasClass('slick-initialized');

      if (enable && !inited) $s.slick(options);
      if (!enable && inited) $s.slick('unslick');
    });
  }

  function applySliders(e) {
    const enable = e.matches;
    const $componentsDots = $('.components__main-title .dots');
    const $adviceDots = $('.advice__main-title .dots');

    // Prototype: «Рекомендовані інгредієнти» and «Поради» scroll natively on phones, like «Додатково з
    // твоєї полички» (prototype.css), so no slick for them; the live page slicks them here with dots
    toggleSlick(
      $('.steps-slider'),
      enable,
      {
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    );
  }

  function resultsSlider() {
    const $sliders = $('.results__slider');

    $sliders.each(function () {
      const $slider = $(this);
      const $arrows = $slider.closest('.results').find('.results__arrows');

      if ($slider.hasClass('slick-initialized')) {
        $slider.slick('unslick');
      }

      $slider.slick({
        autoplay: true,
        infinite: true,
        // The landing template renders its own arrow buttons; result pages have
        // no .results__arrows block and keep the arrowless slider.
        arrows: $arrows.length > 0,
        prevArrow: $arrows.find('.prev'),
        nextArrow: $arrows.find('.next'),
        mobileFirst: true,
        slidesToShow: 1,
        responsive: [
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 1023,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
              variableWidth: true,
            },
          },
        ],
      });
    });
  }

  function proposSlider() {
    $('.landing-propos').each(function () {
      const $holder = $(this);
      const $data = $holder.find('.landing-propos__data-slider');
      const $img = $holder.find('.landing-propos__img-slider');

      function init() {
        const isDesktop = window.matchMedia(
          '(min-width: 1024px)'
        ).matches;

        if ($img.hasClass('slick-initialized')) {
          $img.slick('unslick');
        }

        if ($data.hasClass('slick-initialized')) {
          $data.slick('unslick');
        }

        $img.slick({
          infinite: false,
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          focusOnSelect: true,
          fade: isDesktop,
          asNavFor: $data
        });

        $data.slick({
          infinite: false,
          arrows: false,
          slidesToShow: isDesktop ? 4 : 1,
          slidesToScroll: 1,
          focusOnSelect: true,
          vertical: isDesktop,
          asNavFor: $img
        });
      }

      init();

      const media = window.matchMedia(
        '(min-width: 1024px)'
      );

      media.addEventListener(
        'change',
        init
      );
    });
  }

  // function accordion() {
  //   $(document).on('click', '.about-skin__title', function (e) {
  //     e.preventDefault();
  //
  //     const $clickedTitle      = $(this);
  //     const $currentItem       = $clickedTitle.closest('.about-skin__item');
  //     const $currentContent    = $currentItem.find('.about-skin__data');
  //     const $accordionContainer = $currentItem.closest('.about-skin');
  //
  //     if ($currentItem.hasClass('is-active')) {
  //       $currentItem.removeClass('is-active');
  //       $currentContent.stop(true, true).slideUp();
  //     } else {
  //       const $siblingItems   = $accordionContainer.find('.about-skin__item');
  //       const $siblingContent = $siblingItems.find('.about-skin__data');
  //
  //       $siblingItems.removeClass('is-active');
  //       $siblingContent.stop(true, true).slideUp();
  //
  //       $currentItem.addClass('is-active');
  //       $currentContent.stop(true, true).slideDown();
  //     }
  //   });
  // }

  // ─── Content loader with animation ─────────────────────────────────────────

  function initContentLoader() {
    var isChecking   = false;
    var contentReady = false;
    var pendingResponse = null;

    // 1. AJAX запит (працює у фоні)
    var checkInterval = setInterval(function () {
      var $content = $('.main__content');
      if ($content.hasClass('part-loading') && !isChecking && !contentReady) {
        isChecking = true;
        $.ajax({
          url: window.location.href + '/content',
          method: 'POST',
          success: function (response, textStatus, xhr) {
            if (xhr.status === 200 && response.trim().length > 0) {
              contentReady    = true;
              pendingResponse = response;
              clearInterval(checkInterval);
            }
          },
          complete: function () { isChecking = false; },
        });
      }
    }, 2000);

    // 2. Анімація кроків
    $('.part-loading .main__content-banner .btn-holder a').each(function () {
      const $link       = $(this);
      const $steps      = $link.find('.change');
      const totalSteps  = $steps.length;
      let i = 0;

      function nextStep() {
        $steps.hide();
        const $current = $steps.eq(i);
        $current.fadeIn(300);

        // Останній крок — чекаємо на дані з бекенду
        if (i === totalSteps - 1) {
          const checkData = setInterval(function () {
            if (contentReady) {
              clearInterval(checkData);

              $('.main__content').replaceWith(pendingResponse);

              // Переініціалізуємо слайдери та таби після заміни контенту
              applySliders(mq);
              resultsSlider();
              proposSlider();
              careTabs();
            }
          }, 500);

          return;
        }

        // Кроки 1, 2 — перемикаємо через 5 секунд
        setTimeout(function () {
          $current.fadeOut(300, function () {
            i++;
            nextStep();
          });
        }, 5000);
      }

      nextStep();
    });
  }

  // ─── MediaQuery listener ────────────────────────────────────────────────────

  if (mq.addEventListener) mq.addEventListener('change', applySliders);
  else mq.addListener(applySliders);


  function careTabs() {
    $('.care-tabs').each(function () {
      const $nav = $(this).find('.care-nav');
      const $buttons = $nav.find('[data-nav]');
      const $tabs = $(this).find('.care-section[data-section]');

      // Namespaced + off() first so re-running after an AJAX care-section swap
      // doesn't stack duplicate handlers.
      $buttons.off('click.careTabs').on('click.careTabs', function () {
        const id = $(this).data('nav');

        $buttons.removeClass('is-active');
        $(this).addClass('is-active');

        $tabs.removeClass('is-active').hide();
        $tabs.filter('[data-section="' + id + '"]').addClass('is-active').show();
      });

      $tabs.not('.is-active').hide();
    });
  }

  // skin-id-cart.js replaces the care section after an AJAX regenerate and needs
  // to re-bind the tabs on the fresh DOM.
  window.skinIdCareTabs = careTabs;

  // ─── Init ───────────────────────────────────────────────────────────────────

  $(function () {
    applySliders(mq);
    resultsSlider();
    proposSlider();
    // accordion();
    initContentLoader();
    careTabs();
  });

})(jQuery);
