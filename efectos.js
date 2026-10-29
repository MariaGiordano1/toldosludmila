// Efectos de scroll: aparición de bloques, parallax del banner y sombra de la cabecera
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top = document.querySelector('.top');
  const slides = document.getElementById('slides');
  const copy = document.querySelector('.hero-copy');

  // Aparición: cada grupo entra escalonado cuando llega a pantalla
  const groups = ['.head', '.about-grid > *', '.stats > div', '.card', '.service', '.services-grid > div:first-child',
    '.gal figure', '.contact-grid > *', '.channels a', '.page > section', '.list a', '.footer .wrap > div:not(.legal)'];
  const items = [...document.querySelectorAll(groups.join(','))].filter(el => !el.closest('.hero, dialog'));
  if(!calm && 'IntersectionObserver' in window){
    items.forEach(el => {
      const sibs = [...el.parentElement.children].filter(s => items.includes(s));
      el.style.setProperty('--d', Math.min(sibs.indexOf(el), 6) * 90 + 'ms');
      el.classList.add('reveal');
    });
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if(!en.isIntersecting) return;
      en.target.classList.add('in');
      io.unobserve(en.target);
    }), {threshold:.15, rootMargin:'0px 0px -40px 0px'});
    items.forEach(el => io.observe(el));
  }

  let ticking = false;
  const onScroll = () => {
    const y = scrollY;
    if(top) top.classList.toggle('scrolled', y > 8);
    if(!calm && slides && y < innerHeight * 1.2){
      slides.style.transform = 'translateY(' + y * .35 + 'px) scale(' + (1 + y / 4000) + ')';
      if(copy){ copy.style.transform = 'translateY(' + y * .15 + 'px)'; copy.style.opacity = Math.max(0, 1 - y / (innerHeight * .7)); }
    }
    ticking = false;
  };
  addEventListener('scroll', () => { if(!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, {passive:true});
  onScroll();
})();
