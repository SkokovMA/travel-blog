async function loadComponent(path) {
  const res = await fetch(path);
  return await res.text();
}

// Настройки страниц: что показывать в хедере
const pages = {
  home: {
    title: 'Путешествия в фотографиях и историях',
    subtitle: '',
    navActive: 'travels',
    bodyClass: 'page-home'
  },
  kavkaz_2020: {
    title: 'Приэльбрусье на велосипеде',
    subtitle: '12 июля 2020',
    navActive: 'travels',
    bodyClass: 'page-kavkaz'
  },
  blog: {
    title: 'Блог',
    subtitle: '',
    navActive: 'blog',
    bodyClass: 'page-blog'
  },
  cats: {
    title: 'Балтийские котики',
    subtitle: '3 октября 2021',
    navActive: 'cats',
    bodyClass: 'page-cats'
  }
};

const blogPosts = [
  {
    date: '03.10.2021',
    title: 'Балтийские котики',
    url: 'cats/',
    image: '/assets/img/baltic_cats/preview.jpg',
    excerpt: 'Результат фотоохоты на пушистых хвостатых в Калининградской области'
  }
];

// Данные о поездках для главной
const travels = [
  {
    date: '12.07.2020',
    title: 'Приэльбрусье на велосипеде',
    url: 'travels/kavkaz_2020/',
    image: 'assets/img/travel-cards/kavkaz_2020.jpg',
    excerpt: 'Велопрогулка по Карачаево-Черкесии и Кабардино-Балкарии'
  },
];

async function initLayout() {
  const body = document.body;
  const pageKey = body.dataset.page || 'home';

  // Всегда используем абсолютные пути от корня
  const headerPath = '/components/header.html';
  const footerPath = '/components/footer.html';
  const cardPath = '/components/trip-card.html';

  // Загрузка header
  const headerEl = document.getElementById('site-header');
  if (headerEl) {
    const headerHtml = await loadComponent(headerPath);
    headerEl.innerHTML = headerHtml;

    // Исправляем пути в иконках для вложенных страниц
    const path = window.location.pathname;
    const depth = path.split('/').filter(p => p).length;
    
    if (depth >= 2) {
      // Исправляем относительные пути в загруженном HTML
      headerEl.querySelectorAll('img[src^="../"]').forEach(img => {
        img.src = img.src.replace(/\.\.\//g, '/');
      });
    }

    const cfg = pages[pageKey] || pages.home;
    body.classList.add(cfg.bodyClass);

    const hTitle = headerEl.querySelector('[data-header-title]');
    const hSub = headerEl.querySelector('[data-header-subtitle]');
    if (hTitle) hTitle.textContent = cfg.title;
    if (hSub) hSub.textContent = cfg.subtitle || '';

    const activeNav = headerEl.querySelector(`.header-nav a[data-nav="${cfg.navActive}"]`);
    if (activeNav) activeNav.style.textDecoration = 'underline';
  }

  // Footer
  const footerEl = document.getElementById('site-footer');
  if (footerEl) {
    const footerHtml = await loadComponent(footerPath);
    footerEl.innerHTML = footerHtml;
  }

  // Карточки для главной
  if (pageKey === 'home') {
    const listEl = document.getElementById('travels-list');
    if (listEl) {
      const tpl = await loadComponent(cardPath);
      if (tpl) {
        listEl.innerHTML = travels
          .map(t =>
            tpl
              .replace(/{{url}}/g, t.url)
              .replace(/{{image}}/g, t.image)
              .replace(/{{date}}/g, t.date)
              .replace(/{{title}}/g, t.title)
              .replace(/{{excerpt}}/g, t.excerpt)
          )
          .join('');
      }
    }
  }

  // Карточки для блога
  if (pageKey === 'blog') {
    const listEl = document.getElementById('blog-list');
    if (listEl) {
      const tpl = await loadComponent(cardPath);
      if (tpl) {
        listEl.innerHTML = blogPosts
          .map(post =>
            tpl
              .replace(/{{url}}/g, post.url)
              .replace(/{{image}}/g, post.image)
              .replace(/{{date}}/g, post.date)
              .replace(/{{title}}/g, post.title)
              .replace(/{{excerpt}}/g, post.excerpt)
          )
          .join('');
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', initLayout);

// ========== STICKY NAVIGATION ==========
window.addEventListener('load', function() {
  setTimeout(function() {
    const nav = document.getElementById('header-nav-sticky');
    
    console.log('Sticky nav:', nav); // Проверка
    
    if (!nav) {
      console.warn('header-nav-sticky не найден!');
      return;
    }
    
    let lastScroll = 0;
    const scrollThreshold = 500;
    
    function handleScroll() {
      const currentScroll = window.pageYOffset;
      
      console.log('Scroll:', currentScroll, 'Last:', lastScroll); // Отладка
      
      if (currentScroll > scrollThreshold && currentScroll < lastScroll) {
        nav.classList.add('scroll');
        console.log('Show nav');
      } else if (currentScroll < 100 || currentScroll > lastScroll) {
        nav.classList.remove('scroll');
        console.log('Hide nav');
      }
      
      lastScroll = currentScroll;
    }
    
    window.addEventListener('scroll', handleScroll);
  }, 500);
});

window.addEventListener('load', function() {
  document.body.classList.add('loaded');
});