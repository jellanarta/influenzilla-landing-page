/* ==========================================================================
   Influenzzilla Main JavaScript (jQuery)
   Compatible with Firefox, Chrome, Safari, and Internet Explorer (IE10/11)
   Written strictly in ES5 for full cross-browser reliability.
   ========================================================================== */

(function($) {
  'use strict';

  // Ensure window.dataLayer exists
  window.dataLayer = window.dataLayer || [];

  // Robust gtag dispatcher that ensures events always reach dataLayer
  if (typeof window.gtag !== 'function') {
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
  }

  // Global helper for manual testing/verification in console
  window.trackRedBoxEvent = function(buttonName, targetSection) {
    // 1. Google Analytics (GA4) Event
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'click', {
        'event_category': 'Red_Box_Navigation',
        'event_label': buttonName,
        'link_url': targetSection,
        'item_name': buttonName
      });
      window.gtag('event', 'select_content', {
        'content_type': 'red_box_anchor',
        'item_id': buttonName
      });
    }

    // 2. Google Analytics (Universal Analytics / ga) Fallback
    if (typeof window.ga === 'function') {
      window.ga('send', 'event', 'Red_Box_Navigation', 'click', buttonName);
    }

    // 3. Google Tag Manager dataLayer Event Push
    if (window.dataLayer && typeof window.dataLayer.push === 'function') {
      window.dataLayer.push({
        'event': 'red_box_click',
        'eventCategory': 'Red Box Navigation',
        'eventAction': 'Click',
        'eventLabel': buttonName,
        'linkText': buttonName,
        'linkTarget': targetSection,
        'trackedAt': new Date().toISOString()
      });
    }

    // 4. Formatted Console Log for Developer / Examiner Verification
    if (window.console && typeof window.console.log === 'function') {
      console.log(
        '%c[DIRECTION 567:125 TRACKING]%c ' + buttonName + ' -> ' + targetSection,
        'background: #ff0000; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 3px;',
        'color: #00ffaa; font-weight: bold;'
      );
      if (typeof console.table === 'function') {
        console.table({
          'Target Platform': 'Google Analytics & Google Tag Manager',
          'Element Type': 'Red Box Link / Button',
          'Event Action': 'Click',
          'Button Label': buttonName,
          'Anchor Target': targetSection,
          'Timestamp': new Date().toLocaleTimeString()
        });
      }
    }
  };

  $(document).ready(function() {

    // ======================================================================
    // 1. FIGMA DIRECTION 567:125 - GOOGLE ANALYTICS & GOOGLE TAG MANAGER TRACKING
    // "Please track each button and link in the red box using Google analytics
    //  and Google tag manager"
    // ======================================================================

    $('.anchor-nav-item').on('click', function(e) {
      var $box = $(this);
      var $link = $box.find('.anchor-nav-link');
      var buttonName = $.trim($link.text()) || $.trim($box.text());
      var targetSection = $link.attr('href') || $box.attr('data-target');

      // Dispatch GA & GTM tracking
      window.trackRedBoxEvent(buttonName, targetSection);

      // Perform smooth scroll to destination
      if (targetSection && targetSection.charAt(0) === '#') {
        var $targetEl = $(targetSection);
        if ($targetEl.length) {
          e.preventDefault();
          var offsetTop = $targetEl.offset().top - 30;
          $('html, body').stop().animate({
            scrollTop: offsetTop
          }, 600);

          $('.anchor-nav-item').removeClass('active');
          $box.addClass('active');
        }
      }
    });


    // ======================================================================
    // 2. FIGMA DIRECTION 505:5 - ANCHOR POINT ROUTING FOR OTHER NAV LINKS
    // ======================================================================

    $('.scroll-trigger').on('click', function(e) {
      var target = $(this).attr('href');
      if (target && target.charAt(0) === '#') {
        var $targetEl = $(target);
        if ($targetEl.length) {
          e.preventDefault();
          var offsetTop = $targetEl.offset().top - 30;
          $('html, body').stop().animate({
            scrollTop: offsetTop
          }, 600);

          // Close mobile menu drawer if open
          $('#mobileNavDrawer').fadeOut(200);
          $('body').css('overflow', '');
        }
      }
    });


    // ======================================================================
    // 3. FIGMA DIRECTION 505:5 - TABBING SECTION (Branding | Design | Marketing)
    // ======================================================================

    $('.tab-nav-btn').on('click', function(e) {
      e.preventDefault();
      var targetTab = $(this).attr('data-tab');

      $('.tab-nav-btn').removeClass('active');
      $(this).addClass('active');

      $('.tab-content-panel').removeClass('active');
      $('#tab-panel-' + targetTab).addClass('active');
    });


    // ======================================================================
    // 4. FIGMA DIRECTION 505:5 - PROJECTS SLIDER / CAROUSEL
    // ======================================================================

    var currentSlide = 0;
    var totalSlides = 3;
    var $track = $('#sliderTrack');
    var $dots = $('.slider-dot');

    function updateSlider(index) {
      if (index < 0) {
        currentSlide = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }

      var translateVal = -(currentSlide * 100);
      $track.css({
        '-webkit-transform': 'translateX(' + translateVal + '%)',
        '-moz-transform': 'translateX(' + translateVal + '%)',
        '-ms-transform': 'translateX(' + translateVal + '%)',
        'transform': 'translateX(' + translateVal + '%)'
      });

      $dots.removeClass('active');
      $dots.eq(currentSlide).addClass('active');
    }

    $('#btnPrevSlide').on('click', function(e) {
      e.preventDefault();
      updateSlider(currentSlide - 1);
    });

    $('#btnNextSlide').on('click', function(e) {
      e.preventDefault();
      updateSlider(currentSlide + 1);
    });

    $dots.on('click', function(e) {
      e.preventDefault();
      var targetSlide = parseInt($(this).attr('data-slide'), 10);
      updateSlider(targetSlide);
    });

    // Touch & Swipe Support for Mobile (Swipe screen to navigate slides - 2 items per slide)
    var touchStartX = 0;
    var touchStartY = 0;
    var touchEndX = 0;
    var touchEndY = 0;
    var isTouching = false;
    var $sliderContainer = $('.slider-container');

    $sliderContainer.on('touchstart', function(e) {
      var touch = e.originalEvent.touches ? e.originalEvent.touches[0] : null;
      if (touch) {
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchEndX = touchStartX;
        touchEndY = touchStartY;
        isTouching = true;
      }
    });

    $sliderContainer.on('touchmove', function(e) {
      if (!isTouching) return;
      var touch = e.originalEvent.touches ? e.originalEvent.touches[0] : null;
      if (touch) {
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;
      }
    });

    $sliderContainer.on('touchend', function(e) {
      if (!isTouching) return;
      isTouching = false;

      var diffX = touchEndX - touchStartX;
      var diffY = touchEndY - touchStartY;

      // Check horizontal intent: diffX must be greater than diffY and at least 35px
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
        if (diffX < 0) {
          // Swiped left -> Next slide
          updateSlider(currentSlide + 1);
        } else {
          // Swiped right -> Previous slide
          updateSlider(currentSlide - 1);
        }
      }
    });

    // Mouse drag support for testing swipe on desktop / devtools emulation
    var isMouseDown = false;
    var mouseStartX = 0;
    var mouseEndX = 0;

    $sliderContainer.on('mousedown', function(e) {
      isMouseDown = true;
      mouseStartX = e.clientX;
      mouseEndX = e.clientX;
    });

    $(window).on('mousemove', function(e) {
      if (!isMouseDown) return;
      mouseEndX = e.clientX;
    });

    $(window).on('mouseup', function(e) {
      if (!isMouseDown) return;
      isMouseDown = false;
      var diffX = mouseEndX - mouseStartX;
      if (Math.abs(diffX) > 40) {
        if (diffX < 0) {
          updateSlider(currentSlide + 1);
        } else {
          updateSlider(currentSlide - 1);
        }
      }
    });


    // ======================================================================
    // 5. MOBILE DRAWER OVERLAY (MENU / CLOSE)
    // ======================================================================

    $('#btnOpenMenu, #btnOpenMenuFooter').on('click', function(e) {
      e.preventDefault();
      $('#mobileNavDrawer').fadeIn(200);
      $('body').css('overflow', 'hidden');
    });

    $('#btnCloseMenu').on('click', function(e) {
      e.preventDefault();
      $('#mobileNavDrawer').fadeOut(200);
      $('body').css('overflow', '');
    });

    // ======================================================================
    // 6. STICKY NAVBAR BACKGROUND ON SCROLL
    // Transparent over hero background initially, gets background after scrolling
    // ======================================================================
    var $siteHeader = $('#siteHeader');
    function checkHeaderScroll() {
      if ($(window).scrollTop() > 40) {
        $siteHeader.addClass('scrolled');
      } else {
        $siteHeader.removeClass('scrolled');
      }
    }

    $(window).on('scroll', checkHeaderScroll);
    checkHeaderScroll();


    // ======================================================================
    // 7. MULTILINGUAL TRANSLATOR & LANGUAGE SWITCHER (EN / ID)
    // Supports Desktop Header globe, Mobile Drawer globe, and Desktop Footer globe.
    // Preserves all HTML formatting, spans, line breaks, and wavy accents.
    // ======================================================================

    var i18nData = {
      en: {
        nav_about: 'ABOUT',
        nav_services: 'SERVICES',
        nav_servises: 'SERVISES',
        nav_cases: 'CASES',
        nav_team: 'TEAM',
        nav_boost: 'BOOST PROGRAM',
        nav_products: 'PRODUCTS',
        nav_book: 'BOOK',
        nav_blog: 'BLOG',
        header_desc: 'bespoke design and<br>marketing services',
        footer_desc: 'bespoke design and<br>marketing services',
        footer_privacy: 'PRIVACY POLICY',
        hero_starter_tag: 'hi there, let\'s<br>get started!',
        hero_title_line_1: '<span class="hero-word-influence hero-title-text">Influence</span> <span class="hero-your-wrapper"><span class="hero-wavy-above">˜˜˜˜˜˜˜˜˜˜</span><span class="hero-word-your hero-title-text">your</span></span>',
        hero_title_line_2: '<span class="hero-word-audience hero-title-text">audience</span> <span class="hero-subtitle">boost your brand with our marketing expertise</span>',
        hero_side_text: 'We believe in the power of digital media to transform businesses and connect them with their audiences in meaningful ways.',
        mobile_grid_branding: 'digital branding',
        mobile_grid_marketing: 'influence marketing',
        mobile_grid_content: 'content creation',
        mobile_grid_development: 'design/development',
        anchor_about_us: 'About us',
        anchor_expertise: 'Expertise',
        anchor_get_started: 'Get started',
        anchor_what_we_do: 'What we do',
        location_london_2006: 'London 2006',
        dreams_p1: 'Our creative design bureau is based in the heart of London and specializes in digital branding, website design, and influence marketing.',
        dreams_p2: 'We believe in the power of digital media to transform businesses and connect them with their audiences in meaningful ways.',
        dreams_title_desktop: 'We turn your digital<br><span class="dreams-wrapper-dreams">dreams<span class="dreams-wavy-under-dreams">˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜</span></span> into reality',
        dreams_title_mobile: 'We turn your<br>digital dreams<br>into <span class="dreams-wrapper-reality">reality<span class="dreams-wavy-under-reality">˜˜˜˜˜˜˜˜˜˜˜˜</span></span>',
        dreams_p3: 'Our team of experienced designers and marketing professionals work closely with each client to understand their unique vision and develop tailored solutions that align with their goals.',
        dreams_p4: 'From designing eye-catching logos and brand identities, to building custom websites that engage and convert visitors, to crafting effective influencer marketing campaigns, we are dedicated to helping our clients succeed in the digital space.',
        sphere_since: 'since',
        card_01_desc: 'We create unique brand identities that resonate with your target audience and help you stand out in a crowded marketplace',
        card_02_desc: 'We build custom websites that are visually stunning, easy to navigate, and optimized for search engines',
        card_03_desc: 'We develop influencer campaigns that help you reach a wider audience, build brand awareness, and drive conversions',
        card_04_desc: 'We produce high-quality content that engages your audience, builds trust, and reinforces your brand message',
        objectives_title_desktop: 'Help our clients <span class="objectives-wrapper-achive">achive<span class="objectives-wavy-above">˜˜˜˜˜˜˜˜˜˜˜˜˜˜</span></span><br>their business objectives',
        objectives_title_mobile: 'Help our clients<br>achive their<br>business<br><span class="objectives-wrapper-objectives-mobile">objectives<span class="objectives-wavy-under-objectives-mobile">˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜</span></span>',
        objectives_p1: 'Influenzilla is a leading design and marketing agency that offers creative solutions to businesses of all sizes. Our team of experts specializes in creating unique and effective designs that help our clients stand out in a crowded market.',
        objectives_p2: 'Our mission is to help our clients achieve their business objectives through innovative and effective design solutions. We believe that great design is more than just aesthetics. It\'s about creating a seamless user experience that engages and delights your audience.',
        objectives_p3: 'We take pride in our ability to understand the unique needs and goals of each of our clients, and to develop customized solutions that exceed their expectations. Our team of talented designers and marketers work closely with our clients to create a cohesive brand identity, effective marketing strategies, and user-friendly websites and applications.',
        objectives_p4: 'We offer a wide range of services, including branding, web design, social media marketing, graphic design, and more. Our goal is to help our clients achieve success by providing them with the tools and resources they need to grow their business.',
        tab_btn_branding: 'Branding',
        tab_btn_design: 'Design',
        tab_btn_marketing: 'Marketing',
        tab_b1: 'Our team of experts specializes in creating unique and effective designs',
        tab_b2: 'We created marketing materials that were consistent with the new brand identity, such as business cards, brochures, and social media graphics.',
        tab_d1: 'Innovative and effective design solutions for business of our clients',
        tab_d2: 'We partnered with a technology startup to create a new website that would showcase their innovative product and attract investors.',
        tab_m1: 'Our team of experienced marketing professionals work closely with each client to understand their unique vision and develop tailored solutions that align with their goals.',
        tab_m2: 'We provided the brand with a detailed social media strategy that outlined how they could continue to grow their following and engage with their audience in the future.',
        objectives_bottom: 'We specialize in creating unique and innovative designs that not only capture the essence of your business but also help you achieve your goals. We believe that great design is about creating a seamless user experience that engages and delights your audience, and we work hard to ensure that every design we create meets this high standard.',
        sec3_tag: 'hi there, let\'s<br>get started!',
        expertise_title_desktop: 'Expertise <span class="expertise-wrapper-and">and<span class="expertise-wavy-above-and">˜˜˜˜˜˜˜˜</span></span><br>experience',
        expertise_title_mobile: 'Expertise and<br><span class="expertise-wrapper-experience-mobile">experience<span class="expertise-wavy-under-experience-mobile">˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜</span></span>',
        expertise_intro: 'We believe that building long-lasting relationships with our clients is key to achieving success. We are passionate about what we do, and we are committed to delivering exceptional results for every client we work with.',
        expertise_p1: 'Our team of talented designers and marketers works closely with each of our clients, taking the time to understand their unique needs and goals, and developing customized solutions that exceed their expectations.',
        expertise_p2: 'We take pride in our ability to create a cohesive brand identity, effective marketing strategies, and user-friendly websites and applications that help our clients achieve success.',
        expertise_p3: 'So if you\'re a start-up looking to create a strong brand identity, or an established business looking to revamp your marketing strategy, we have the expertise and experience to help you succeed.',
        expertise_p4: 'Contact us today to learn more about our services and how we can help your business grow. We look forward to hearing from you and starting this exciting journey together.',
        projects_title_desktop: 'Projects for <span class="projects-wrapper-our">our<span class="projects-wavy-above-our">˜˜˜˜˜˜˜˜</span></span><br>clients',
        projects_title_mobile: '<span class="projects-wrapper-projects-mobile">Projects<span class="projects-wavy-above-projects-mobile">˜˜˜˜˜˜˜˜</span></span> for<br>our clients',
        project_tag_branding: 'branding',
        project_tag_webdesign: 'web design',
        project_tag_marketing: 'marketing',
        project_tag_development: 'development',
        project_s1c1_title: 'Food store<br>identity',
        project_s1c1_desc: 'We worked with a local health food store to create a new brand identity that was both modern and eco-friendly.',
        project_s1c2_title: 'Technology<br>startup site',
        project_s1c2_desc: 'We partnered with a technology startup to create a new website that would showcase their innovative product and attract investors.',
        project_s2c1_title: 'Fashion instagram<br>marketing',
        project_s2c1_desc: 'Our team helped a new fashion brand grow their Instagram following by over 200% in just three months.',
        project_s2c2_title: 'Mobile and<br>desktop services',
        project_s2c2_desc: 'Developing modern websites that are optimized for both desktop and mobile devices.',
        project_s3c1_title: 'Eco packaging<br>design',
        project_s3c1_desc: 'We created marketing materials that were consistent with the new brand identity, such as business cards, brochures, and social media graphics.',
        project_s3c2_title: 'Social media<br>graphics',
        project_s3c2_desc: 'We provided the brand with a detailed social media strategy that outlined how they could continue to grow their following and engage with their audience in the future.'
      },
      id: {
        nav_about: 'TENTANG',
        nav_services: 'LAYANAN',
        nav_servises: 'LAYANAN',
        nav_cases: 'STUDI KASUS',
        nav_team: 'TIM KAMI',
        nav_boost: 'PROGRAM BOOST',
        nav_products: 'PRODUK',
        nav_book: 'BUKU',
        nav_blog: 'BLOG',
        header_desc: 'layanan desain kustom dan<br>pemasaran terpadu',
        footer_desc: 'layanan desain kustom dan<br>pemasaran terpadu',
        footer_privacy: 'KEBIJAKAN PRIVASI',
        hero_starter_tag: 'halo semuanya, mari<br>kita mulai!',
        hero_title_line_1: '<span class="hero-word-influence hero-title-text">Pengaruh</span> <span class="hero-your-wrapper"><span class="hero-wavy-above">˜˜˜˜˜˜˜˜˜˜</span><span class="hero-word-your hero-title-text">pada</span></span>',
        hero_title_line_2: '<span class="hero-word-audience hero-title-text">audiens</span> <span class="hero-subtitle">tingkatkan merek Anda dengan keahlian pemasaran kami</span>',
        hero_side_text: 'Kami percaya pada kekuatan media digital untuk mengubah bisnis dan menghubungkan mereka dengan audiens secara bermakna.',
        mobile_grid_branding: 'branding digital',
        mobile_grid_marketing: 'pemasaran pengaruh',
        mobile_grid_content: 'kreasi konten',
        mobile_grid_development: 'desain/pengembangan',
        anchor_about_us: 'Tentang kami',
        anchor_expertise: 'Keahlian',
        anchor_get_started: 'Mulai sekarang',
        anchor_what_we_do: 'Layanan kami',
        location_london_2006: 'London 2006',
        dreams_p1: 'Biro desain kreatif kami berbasis di pusat London dan berspesialisasi dalam branding digital, desain situs web, dan pemasaran pengaruh.',
        dreams_p2: 'Kami percaya pada kekuatan media digital untuk mengubah bisnis dan menghubungkan mereka dengan audiens secara bermakna.',
        dreams_title_desktop: 'Kami wujudkan impian<br><span class="dreams-wrapper-dreams">digital<span class="dreams-wavy-under-dreams">˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜</span></span> menjadi kenyataan',
        dreams_title_mobile: 'Kami wujudkan<br>impian digital<br>menjadi <span class="dreams-wrapper-reality">kenyataan<span class="dreams-wavy-under-reality">˜˜˜˜˜˜˜˜˜˜˜˜</span></span>',
        dreams_p3: 'Tim desainer berpengalaman dan pakar pemasaran kami bekerja sama erat dengan setiap klien untuk memahami visi unik mereka dan menciptakan solusi yang tepat sasaran.',
        dreams_p4: 'Mulai dari merancang logo menarik dan identitas merek, membangun situs web kustom yang memikat pengunjung, hingga merancang kampanye pemasaran influencer yang efektif, kami berdedikasi membantu kesuksesan klien di ranah digital.',
        sphere_since: 'sejak',
        card_01_desc: 'Kami menciptakan identitas merek unik yang beresonansi dengan audiens sasaran Anda dan membantu Anda tampil unggul di pasar yang kompetitif',
        card_02_desc: 'Kami membangun situs web kustom yang memukau secara visual, mudah dinavigasi, dan dioptimalkan untuk mesin pencari',
        card_03_desc: 'Kami merancang kampanye influencer yang membantu Anda menjangkau audiens lebih luas, membangun kesadaran merek, dan meningkatkan konversi',
        card_04_desc: 'Kami memproduksi konten berkualitas tinggi yang melibatkan audiens Anda, membangun kepercayaan, dan memperkuat pesan merek Anda',
        objectives_title_desktop: 'Membantu klien kami <span class="objectives-wrapper-achive">meraih<span class="objectives-wavy-above">˜˜˜˜˜˜˜˜˜˜˜˜˜˜</span></span><br>target bisnis mereka',
        objectives_title_mobile: 'Membantu klien kami<br>meraih semua<br>target<br><span class="objectives-wrapper-objectives-mobile">bisnisnya<span class="objectives-wavy-under-objectives-mobile">˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜</span></span>',
        objectives_p1: 'Influenzilla adalah agensi desain dan pemasaran terkemuka yang menawarkan solusi kreatif untuk bisnis di berbagai skala. Tim ahli kami berfokus menciptakan desain unik dan efektif yang membantu klien tampil terdepan.',
        objectives_p2: 'Misi kami adalah membantu para klien mencapai sasaran bisnis mereka melalui solusi desain yang inovatif dan efektif. Kami percaya bahwa desain hebat lebih dari sekadar visual. Ini tentang menciptakan pengalaman pengguna menyenangkan yang memikat audiens.',
        objectives_p3: 'Kami bangga atas keahlian kami memahami kebutuhan unik tiap klien, serta merancang solusi kustom yang melampaui ekspektasi. Tim desainer dan pemasar berbakat kami berkolaborasi menciptakan identitas merek yang selaras, strategi pemasaran teruji, serta situs web yang ramah pengguna.',
        objectives_p4: 'Kami menawarkan ragam layanan luas, termasuk branding, desain web, pemasaran media sosial, desain grafis, dan banyak lagi. Sasaran kami adalah membantu klien meraih kesuksesan dengan menyediakan perangkat dan keahlian yang mereka butuhkan.',
        tab_btn_branding: 'Branding',
        tab_btn_design: 'Desain',
        tab_btn_marketing: 'Pemasaran',
        tab_b1: 'Tim ahli kami berfokus menciptakan desain yang unik dan efektif',
        tab_b2: 'Kami membuat materi pemasaran yang selaras dengan identitas merek baru, seperti kartu nama, brosur, dan materi grafis media sosial.',
        tab_d1: 'Solusi desain yang inovatif dan efektif untuk kebutuhan bisnis para klien kami',
        tab_d2: 'Kami bermitra dengan startup teknologi untuk menciptakan situs web baru yang menampilkan produk inovatif dan menarik investor.',
        tab_m1: 'Tim profesional pemasaran kami bekerja sama erat dengan setiap klien untuk merancang solusi terarah sesuai target yang diinginkan.',
        tab_m2: 'Kami membekali merek dengan strategi media sosial komprehensif untuk terus menumbuhkan pengikut dan interaksi audiens secara berkelanjutan.',
        objectives_bottom: 'Kami berfokus menciptakan desain unik dan inovatif yang tidak hanya menangkap esensi bisnis Anda, tetapi juga membantu meraih target bisnis Anda. Kami percaya desain luar biasa berakar pada pengalaman pengguna yang nyaman dan berkesan, dan kami memastikan setiap karya memenuhi standar mutu tinggi ini.',
        sec3_tag: 'halo semuanya, mari<br>kita mulai!',
        expertise_title_desktop: 'Keahlian <span class="expertise-wrapper-and">dan<span class="expertise-wavy-above-and">˜˜˜˜˜˜˜˜</span></span><br>pengalaman',
        expertise_title_mobile: 'Keahlian dan<br><span class="expertise-wrapper-experience-mobile">pengalaman<span class="expertise-wavy-under-experience-mobile">˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜</span></span>',
        expertise_intro: 'Kami percaya bahwa membangun kemitraan jangka panjang dengan klien adalah kunci utama meraih kesuksesan. Kami bersemangat dalam setiap karya dan berkomitmen memberikan hasil luar biasa bagi setiap klien.',
        expertise_p1: 'Tim desainer dan pemasar kami berkolaborasi erat dengan setiap klien, meluangkan waktu memahami kebutuhan spesifik mereka, serta merancang solusi kustom yang melampaui harapan.',
        expertise_p2: 'Kami bangga menciptakan identitas merek yang kuat, strategi pemasaran berdaya guna, serta situs web dan aplikasi ramah pengguna yang mendorong kesuksesan klien.',
        expertise_p3: 'Baik Anda perusahaan rintisan yang ingin membangun merek kuat, maupun bisnis mapan yang ingin meremajakan strategi pemasaran, kami memiliki keahlian dan pengalaman untuk mewujudkannya.',
        expertise_p4: 'Hubungi kami hari ini untuk mengetahui lebih banyak tentang layanan kami dan bagaimana kami dapat membantu bisnis Anda berkembang pesat. Kami menantikan kerja sama luar biasa ini bersama Anda.',
        projects_title_desktop: 'Karya untuk <span class="projects-wrapper-our">para<span class="projects-wavy-above-our">˜˜˜˜˜˜˜˜</span></span><br>klien kami',
        projects_title_mobile: '<span class="projects-wrapper-projects-mobile">Karya</span> untuk<br>para klien kami',
        project_tag_branding: 'branding',
        project_tag_webdesign: 'desain web',
        project_tag_marketing: 'pemasaran',
        project_tag_development: 'pengembangan',
        project_s1c1_title: 'Identitas toko<br>makanan sehat',
        project_s1c1_desc: 'Kami bermitra dengan toko makanan sehat lokal untuk merancang identitas merek baru yang modern dan ramah lingkungan.',
        project_s1c2_title: 'Situs startup<br>teknologi',
        project_s1c2_desc: 'Kami berkolaborasi dengan startup teknologi untuk membangun situs web baru yang menampilkan produk inovatif serta menarik minat investor.',
        project_s2c1_title: 'Pemasaran instagram<br>fashion',
        project_s2c1_desc: 'Tim kami membantu sebuah merek fashion baru meningkatkan jumlah pengikut Instagram mereka lebih dari 200% hanya dalam 3 bulan.',
        project_s2c2_title: 'Layanan mobile dan<br>desktop',
        project_s2c2_desc: 'Mengembangkan situs web modern yang dioptimalkan dengan sempurna untuk tampilan desktop maupun perangkat ponsel pintar.',
        project_s3c1_title: 'Desain kemasan<br>ramah lingkungan',
        project_s3c1_desc: 'Kami membuat materi pemasaran yang selaras dengan identitas merek baru, seperti kartu nama, brosur, dan grafis media sosial.',
        project_s3c2_title: 'Grafis media<br>sosial',
        project_s3c2_desc: 'Kami membekali merek dengan strategi media sosial komprehensif untuk terus meningkatkan jangkauan serta keterlibatan audiens di masa mendatang.'
      }
    };

    function applyLanguage(lang) {
      if (lang !== 'id' && lang !== 'en') {
        lang = 'en';
      }

      // 1. Update text of all data-i18n elements
      $('[data-i18n]').each(function() {
        var key = $(this).attr('data-i18n');
        if (i18nData[lang] && i18nData[lang][key] !== undefined) {
          $(this).html(i18nData[lang][key]);
        }
      });

      // 2. Update active states on desktop dropdown option buttons
      $('.lang-option-btn').removeClass('active');
      $('.lang-option-btn[data-lang="' + lang + '"]').addClass('active');

      // 3. Update active states on mobile drawer language buttons
      $('.drawer-lang-btn').removeClass('active');
      $('.drawer-lang-btn[data-lang="' + lang + '"]').addClass('active');

      // 4. Update mobile drawer language indicator label
      var labelText = (lang === 'id') ? 'Indonesia' : 'English';
      $('#currentLangLabel').text(labelText);

      // 5. Update HTML lang attribute
      $('html').attr('lang', lang);

      // 6. Save selection in localStorage
      try {
        localStorage.setItem('influenzailla_lang', lang);
      } catch (err) {
        // Ignore localStorage quota or security restrictions
      }
    }

    // Toggle Desktop Header Language Dropdown
    $('#langSwitchHeader').on('click', function(e) {
      e.stopPropagation();
      $('#langDropdownFooter').removeClass('open');
      $('#langDropdownHeader').toggleClass('open');
    });

    // Toggle Desktop Footer Language Dropdown
    $('#langSwitchFooter').on('click', function(e) {
      e.stopPropagation();
      $('#langDropdownHeader').removeClass('open');
      $('#langDropdownFooter').toggleClass('open');
    });

    // Prevent clicks inside desktop dropdowns from bubbling up
    $('.lang-dropdown-menu').on('click', function(e) {
      e.stopPropagation();
    });

    // Toggle Mobile Drawer Globe Accordion
    $('#btnGlobeMobile').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(this).closest('.drawer-globe-item').toggleClass('open');
    });

    // Language Selection via Desktop Dropdown Buttons
    $('.lang-option-btn').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var selectedLang = $(this).attr('data-lang');
      applyLanguage(selectedLang);
      $('.lang-dropdown-menu').removeClass('open');
    });

    // Language Selection via Mobile Drawer Buttons
    $('.drawer-lang-btn').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var selectedLang = $(this).attr('data-lang');
      applyLanguage(selectedLang);
      setTimeout(function() {
        $('#mobileNavDrawer').fadeOut(200);
        $('body').css('overflow', '');
      }, 250);
    });

    // Close any open desktop dropdowns when clicking outside
    $(document).on('click', function() {
      $('.lang-dropdown-menu').removeClass('open');
    });

    // Initialize Language from localStorage (default to 'en')
    var initialLang = 'en';
    try {
      var saved = localStorage.getItem('influenzailla_lang');
      if (saved === 'id' || saved === 'en') {
        initialLang = saved;
      }
    } catch (err) {
      initialLang = 'en';
    }
    applyLanguage(initialLang);

  });

})(jQuery);
