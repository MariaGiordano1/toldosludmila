// Formulario de presupuesto (se usa en index.html y contacto.html)
(function(){
  const form = document.querySelector('#quote');
  if(!form) return;

  // Preselecciona el producto si viene de una ficha: contacto.html?producto=...
  const pre = new URLSearchParams(location.search).get('producto');
  if(pre) [...form.producto.options].forEach(o => { if(o.text===pre) o.selected = true; });

  form.onsubmit = e => {
    e.preventDefault();
    const f = new FormData(form);
    // Evento de conversión para Meta (si el Pixel está instalado); "origen" distingue home de la página de contacto
    if(window.fbq) fbq('track', 'Lead', {
      content_name: f.get('origen'),
      content_category: f.get('producto') || 'Asesoramiento'
    });
    const lines = ['Hola Toldos Ludmila, quiero pedirles un presupuesto.',
      'Nombre: ' + f.get('nombre'), 'Teléfono: ' + f.get('telefono'), 'Zona: ' + f.get('zona'),
      'Producto: ' + (f.get('producto') || 'Necesito asesoramiento')];
    if(f.get('mensaje')) lines.push(f.get('mensaje'));
    window.open('https://wa.me/5491156096890?text=' + encodeURIComponent(lines.join('\n')), '_blank');
  };
})();
