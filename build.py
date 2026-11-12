#!/usr/bin/env python3
"""Genera las fichas de producto, productos.js y el footer compartido.

Fuente única de los datos de producto: la lista PRODUCTS de abajo.
Correr `python3 build.py` después de cambiar un producto, el footer o el sprite de íconos de index.html.
"""
import html, json, re
from datetime import date
from urllib.parse import quote
from pathlib import Path

ROOT = Path(__file__).parent
SITE = 'https://www.toldos-ludmila.com.ar'
WA = '5491156096890'
MANGO_URL = ''  # URL del sitio de Comunidad Mango para el crédito del footer (pendiente)

PRODUCTS = [
  {'id':'brazo', 'slug':'toldo-brazo-invisible', 'name':'Toldo de brazo invisible', 'cat':'Toldos', 'icon':'i-awning',
   'cover':'brazo-01', 'photos':['brazo-01','brazo-02','brazo-03','brazo-04','brazo-05'],
   'text':'Toldo extensible con brazos articulados que se apoyan contra la pared. Da sombra cuando lo abrís y, cerrado, queda recogido sin ocupar lugar.',
   'ideal':'Patios, terrazas y frentes de comercio',
   'specs':[['i-sun','Protección','Sol directo y lluvia leve'],['i-layers','Sin parantes','No lleva postes al frente, el espacio queda libre'],['i-ruler','Medidas','A medida del frente'],['i-tag','Lona','Nacional o importada, varios colores']]},
  {'id':'recto', 'slug':'toldo-punto-recto', 'name':'Toldo punto recto', 'cat':'Toldos', 'icon':'i-window',
   'cover':'recto-01', 'photos':['recto-01','recto-02','recto-03','recto-04','recto-05'],
   'text':'Toldo clásico para ventanas: la lona baja y se proyecta hacia afuera con brazos laterales, para frenar el sol sin perder ventilación.',
   'ideal':'Ventanas, vidrieras y fachadas',
   'specs':[['i-sun','Protección','Sol sobre ventanas y vidrieras'],['i-wind','Ventilación','La ventana se puede seguir abriendo'],['i-ruler','Medidas','A medida de cada abertura'],['i-tag','Lona','Nacional o importada, varios colores']]},
  {'id':'vertical', 'slug':'toldo-vertical-balcones', 'name':'Toldo vertical para balcones', 'cat':'Toldos', 'icon':'i-awning',
   'cover':'vertical-01', 'photos':['vertical-01','vertical-02','vertical-03','vertical-04','vertical-05'],
   'text':'La lona baja en vertical, de arriba hacia el piso o la baranda. Corta el sol de la tarde y da privacidad sin cerrar el balcón.',
   'ideal':'Balcones y ventanales',
   'specs':[['i-sun','Protección','Sol lateral y de la tarde'],['i-eye','Privacidad','Tapa la vista desde afuera'],['i-ruler','Medidas','A medida del balcón'],['i-tag','Lona','Opaca o microperforada']]},
  {'id':'cerramiento', 'slug':'cerramiento-tradicional', 'name':'Cerramiento tradicional', 'cat':'Cerramientos', 'icon':'i-home',
   'cover':'cerramiento-01', 'photos':['cerramiento-01','cerramiento-02','cerramiento-03','cerramiento-04','cerramiento-05'],
   'text':'Cerramiento de lona cristal (transparente) que se enrolla. Te permite usar el quincho o la galería en invierno y abrirlo cuando hace calor.',
   'ideal':'Quinchos, galerías, garages y terrazas',
   'specs':[['i-wind','Protección','Viento, frío y lluvia'],['i-eye','Visibilidad','Lona cristal: se ve hacia afuera'],['i-ruler','Medidas','A medida de cada vano'],['i-home','Uso','Todo el año']]},
  {'id':'guias', 'slug':'cerramiento-guias-laterales', 'name':'Cerramiento con guías laterales', 'cat':'Cerramientos', 'icon':'i-home',
   'cover':'guias-01', 'photos':['guias-01','guias-02','guias-03','guias-04','guias-05'],
   'text':'La lona sube y baja por guías a los costados, así queda tensa y no se mueve con el viento. Terminación más prolija para vanos grandes.',
   'ideal':'Galerías y frentes amplios',
   'specs':[['i-wind','Protección','Mejor resistencia al viento'],['i-layers','Guías','Laterales, la lona no se sale'],['i-ruler','Medidas','A medida de cada vano'],['i-home','Uso','Todo el año']]},
  {'id':'micro', 'slug':'cerramiento-microperforado', 'name':'Cerramiento de lona microperforada', 'cat':'Cerramientos', 'icon':'i-home',
   'cover':'micro-01', 'photos':['micro-01','micro-02'],
   'text':'Lona con pequeños orificios que deja pasar el aire y algo de luz. Da sombra y privacidad sin que el espacio quede encerrado.',
   'ideal':'Frentes, balcones y espacios que necesitan ventilación',
   'specs':[['i-sun','Protección','Sombra parcial'],['i-wind','Ventilación','El aire circula'],['i-eye','Privacidad','Desde afuera casi no se ve'],['i-ruler','Medidas','A medida']]},
]

e = lambda s: html.escape(s, quote=True)
ico = lambda i: f'<svg class="ico"><use href="#{i}"/></svg>'
foto = lambda f: f'/assets/fotos/{f}.jpg'
wa_link = lambda txt: f'https://wa.me/{WA}?text=' + quote(txt)

index = (ROOT/'index.html').read_text()
SPRITE = re.search(r'<svg width="0" height="0".*?</svg>', index, re.S).group(0)
WA_FLOAT_SVG = re.search(r'<a class="wa".*?(<svg viewBox="0 0 32 32">.*?</svg>)</a>', index, re.S).group(1)

def footer():
  credit = (f'<a class="credit" href="{MANGO_URL}" target="_blank" rel="noopener">Sitio hecho por Comunidad Mango</a>'
            if MANGO_URL else '<span class="credit">Sitio hecho por Comunidad Mango</span>')
  items = '\n'.join(f'        <li><a href="/{p["slug"]}">{p["name"]}</a></li>' for p in PRODUCTS)
  return f'''<footer class="footer">
  <div class="wrap">
    <div>
      <img class="logo" src="/assets/toldos-ludmila-logo.png" alt="Toldos Ludmila">
      <p style="margin-top:14px;max-width:300px">Toldos y cerramientos a medida. Fabricación, instalación y reparación desde 1981.</p>
    </div>
    <div>
      <h4>Productos</h4>
      <ul>
{items}
      </ul>
    </div>
    <div>
      <h4>Contacto</h4>
      <ul>
        <li><svg class="ico"><use href="#i-chat"/></svg><a href="https://wa.me/{WA}?text=Hola%20Toldos%20Ludmila%2C%20quiero%20pedirles%20un%20presupuesto" data-ubicacion="whatsapp_footer" target="_blank" rel="noopener">+54 9 11 5609-6890</a></li>
        <li><svg class="ico"><use href="#i-mail"/></svg><a href="mailto:orlandojavierarias@hotmail.com">orlandojavierarias@hotmail.com</a></li>
        <li><svg class="ico"><use href="#i-pin"/></svg><a href="https://maps.google.com/?q=2+de+Abril+de+1982+4566,+Villa+Ballester,+Buenos+Aires" target="_blank" rel="noopener">2 de Abril de 1982 4566, Villa Ballester, Buenos Aires</a></li>
      </ul>
    </div>
    <div class="foot-map"><iframe title="Mapa: 2 de Abril de 1982 4566, Villa Ballester" loading="lazy" src="https://maps.google.com/maps?q=2%20de%20Abril%20de%201982%204566%2C%20B1653%20Villa%20Ballester%2C%20Buenos%20Aires&z=15&output=embed"></iframe></div>
    <div class="legal"><span>© Toldos Ludmila · San Martín, Buenos Aires</span>{credit}</div>
  </div>
</footer>'''

def form(origen, selected=''):
  opts = ['<option value="">No sé, necesito asesoramiento</option>'] + [
    f'<option{" selected" if p["name"]==selected else ""}>{p["name"]}</option>' for p in PRODUCTS] + ['<option>Reparación / cambio de lona</option>']
  opts = '\n            '.join(opts)
  return f'''<form class="form" id="quote">
        <input type="hidden" name="origen" value="{origen}">
        <div class="row">
          <label>Nombre completo<input name="nombre" required autocomplete="name" placeholder="Ej. Laura Pérez"></label>
          <label>Teléfono<input name="telefono" required type="tel" inputmode="tel" autocomplete="tel" placeholder="Ej. 11 1234 5678"></label>
        </div>
        <label>Zona / localidad<input name="zona" required placeholder="Ej. San Martín"></label>
        <label>Producto
          <select name="producto">
            {opts}
          </select>
        </label>
        <label>Comentarios<textarea name="mensaje" rows="4" placeholder="Ej. Quiero cubrir una galería de 5 metros de ancho"></textarea></label>
        <button class="btn" type="submit">Enviar consulta</button>
      </form>'''

def head(title, desc, path, extra='', robots=''):
  url = SITE + path
  return f'''<!doctype html>
<html lang="es" class="js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
{robots}<link rel="canonical" href="{url}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#0d413b">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_AR">
<meta property="og:site_name" content="Toldos Ludmila">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{url}">
{extra}<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Signika:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">'''

def top():
  return f'''<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1444719186983971&ev=PageView&noscript=1"/></noscript>
{SPRITE}

<header class="top">
  <div class="wrap">
    <a href="/"><img class="logo" src="/assets/toldos-ludmila-logo.png" alt="Toldos Ludmila"></a>
    <button class="menu-btn" aria-label="Abrir menú" onclick="document.querySelector('.nav').classList.toggle('open')">{ico('i-menu')}</button>
    <nav class="nav">
      <a href="/#productos">Productos</a>
      <a href="/#servicios">Servicios</a>
      <a href="/#trabajos">Trabajos</a>
      <a href="/#nosotros">Quiénes somos</a>
      <a class="btn" href="/contacto">Pedir presupuesto</a>
    </nav>
  </div>
</header>'''

def bottom(wa_text, scripts=''):
  return f'''{footer()}
<a class="wa" href="{wa_link(wa_text)}" data-ubicacion="whatsapp_flotante" target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp">{WA_FLOAT_SVG}</a>
<script src="/form.js"></script>
<script src="/efectos.js" defer></script>
{scripts}</body>
</html>
'''

PAGE_CSS = '''<style>
.crumbs{font-size:14px;color:var(--muted);padding:26px 0 0;display:flex;gap:8px;flex-wrap:wrap}
.crumbs a{text-decoration:none;color:var(--muted)}.crumbs a:hover{color:var(--green)}
.ficha{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:48px;padding:22px 0 72px;align-items:start}
.ficha-main{aspect-ratio:4/3;border-radius:10px;background:center/cover var(--sage-soft)}
.thumbs{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:10px}
.thumb{width:100%;aspect-ratio:4/3;border-radius:6px;border:2px solid transparent;background:center/cover var(--sage-soft);cursor:pointer;padding:0}
.thumb[aria-current=true]{border-color:var(--green)}
.cat{font-size:14px;color:var(--sage);display:flex;align-items:center;gap:6px}
.cat .ico{width:16px;height:16px}
.ficha h1{font-size:clamp(30px,4vw,44px);margin:6px 0 14px}
.ficha-info>p{color:var(--muted);font-size:17px}
.specs{margin:24px 0;border-top:1px solid var(--line)}
.spec{display:grid;grid-template-columns:22px 110px minmax(0,1fr);gap:10px;padding:11px 0;border-bottom:1px solid var(--line);font-size:15px}
.spec .ico{color:var(--sage);width:18px;height:18px;margin-top:2px}
.spec b{font-weight:500}.spec span{color:var(--muted)}
.cta{display:flex;flex-wrap:wrap;gap:10px}
.quote{background:var(--mist);padding:72px 0}
.quote-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:48px;align-items:start}
.quote .intro{color:var(--muted);margin-top:12px}
.form-card{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:30px}
.others{padding:72px 0}
.others ul{list-style:none;padding:0;margin:24px 0 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.others a{display:flex;gap:14px;align-items:center;text-decoration:none;border:1px solid var(--line);border-radius:8px;padding:10px;background:#fff}
.others a:hover{border-color:var(--sage)}
.others .pic{width:72px;aspect-ratio:4/3;border-radius:6px;background:center/cover var(--mist);flex:none}
@media(max-width:900px){.ficha,.quote-grid{grid-template-columns:1fr;gap:28px}}
@media(max-width:560px){.spec{grid-template-columns:22px 1fr}.spec span{grid-column:2}.form-card{padding:22px}.thumbs{grid-template-columns:repeat(4,1fr)}}
</style>'''

def product_page(p):
  path = '/' + p['slug']
  desc = p['text']
  ld = {'@context':'https://schema.org','@graph':[
    {'@type':'Product','name':p['name'],'description':p['text'],'category':p['cat'],
     'image':[SITE+foto(f) for f in p['photos']],'brand':{'@type':'Brand','name':'Toldos Ludmila'},'url':SITE+path},
    {'@type':'BreadcrumbList','itemListElement':[
      {'@type':'ListItem','position':1,'name':'Inicio','item':SITE+'/'},
      {'@type':'ListItem','position':2,'name':p['cat'],'item':SITE+'/#productos'},
      {'@type':'ListItem','position':3,'name':p['name'],'item':SITE+path}]}]}
  extra = (f'<meta property="og:image" content="{SITE}{foto(p["cover"])}">\n'
           f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>\n')
  specs = [['i-check','Ideal para',p['ideal']], *p['specs'], ['i-home','Instalación','Buenos Aires. Envíos al interior']]
  specs = '\n        '.join(f'<div class="spec">{ico(s[0])}<b>{e(s[1])}</b><span>{e(s[2])}</span></div>' for s in specs)
  thumbs = ''.join(f'<button class="thumb" data-src="{foto(f)}" style="background-image:url({foto(f)})" aria-label="Ver foto {i+1}"{" aria-current=true" if i==0 else ""}></button>'
                   for i, f in enumerate(p['photos'])) if len(p['photos']) > 1 else ''
  others = '\n      '.join(f'<li><a href="/{o["slug"]}"><span class="pic" style="background-image:url({foto(o["cover"])})"></span>{o["name"]}</a></li>'
                           for o in PRODUCTS if o is not p)
  wa_text = f'Hola Toldos Ludmila, quiero pedirles un presupuesto de {p["name"].lower()}.'
  view = json.dumps({'content_name':p['name'],'content_category':p['cat'],'content_ids':[p['slug']],'content_type':'product'}, ensure_ascii=False)
  return f'''{head(f'{p["name"]} a medida | Toldos Ludmila', desc, path, extra)}
{PAGE_CSS}
<script src="/pixel.js"></script>
<script>fbq('track', 'ViewContent', {view});</script>
</head>
<body>
{top()}

<main>
  <nav class="wrap crumbs" aria-label="Ubicación"><a href="/">Inicio</a><span>/</span><a href="/#productos">{p['cat']}</a><span>/</span><span>{p['name']}</span></nav>
  <section class="wrap ficha">
    <div class="ficha-media">
      <div class="ficha-main" id="fotoMain" role="img" aria-label="{e(p['name'])}" style="background-image:url({foto(p['photos'][0])})"></div>
      <div class="thumbs" id="thumbs">{thumbs}</div>
    </div>
    <div class="ficha-info">
      <span class="cat">{ico(p['icon'])}{p['cat']}</span>
      <h1>{p['name']}</h1>
      <p>{p['text']}</p>
      <div class="specs">
        {specs}
      </div>
      <div class="cta">
        <a class="btn" href="#presupuesto">Pedir presupuesto{ico('i-arrow')}</a>
        <a class="btn ghost" href="{wa_link(wa_text)}" data-ubicacion="whatsapp_ficha" target="_blank" rel="noopener">{ico('i-chat')}Consultar por WhatsApp</a>
      </div>
    </div>
  </section>

  <section class="quote" id="presupuesto">
    <div class="wrap quote-grid">
      <div>
        <span class="label">Presupuesto sin cargo</span>
        <h2>Pedí presupuesto de {p['name'].lower()}</h2>
        <p class="intro">Completá tus datos y se abre WhatsApp con el mensaje listo para enviar. Ahí podés sumar medidas y fotos del lugar.</p>
      </div>
      <div class="form-card">
      {form('ficha-' + p['slug'], p['name'])}
      </div>
    </div>
  </section>

  <section class="wrap others">
    <h2>Otros productos</h2>
    <ul>
      {others}
    </ul>
  </section>
</main>

{bottom(wa_text, """<script>
thumbs.onclick = ev => { const t = ev.target.closest('.thumb'); if(!t) return;
  fotoMain.style.backgroundImage = 'url(' + t.dataset.src + ')';
  thumbs.querySelectorAll('.thumb').forEach(b => b.setAttribute('aria-current', b===t)); };
</script>
""")}'''

def gracias_page():
  return f'''{head('¡Gracias por tu consulta! | Toldos Ludmila', 'Recibimos tu consulta. Te respondemos por WhatsApp.', '/gracias', '', '<meta name="robots" content="noindex">\n')}
<script src="/pixel.js"></script>
</head>
<body>
{top()}

<main class="wrap" style="min-height:60vh;display:grid;place-content:center;text-align:center;gap:16px;padding:72px 0">
  <span class="label">Consulta enviada</span>
  <h1>¡Gracias por tu consulta!</h1>
  <p class="intro" style="margin:0 auto;max-width:520px">Te respondemos por WhatsApp con la opción que conviene y el precio. Si no se abrió WhatsApp, escribinos directo.</p>
  <p><a class="btn" href="https://wa.me/{WA}?text=Hola%20Toldos%20Ludmila%2C%20quiero%20pedirles%20un%20presupuesto" data-ubicacion="whatsapp_gracias" target="_blank" rel="noopener">Abrir WhatsApp</a> <a class="btn ghost" href="/">Volver al inicio</a></p>
</main>

{bottom('Hola Toldos Ludmila, quiero pedirles un presupuesto')}'''

def replace_footer(path):
  f = ROOT/path
  f.write_text(re.sub(r'<footer class="footer">.*?</footer>', lambda m: footer(), f.read_text(), flags=re.S))

if __name__ == '__main__':
  for p in PRODUCTS:
    (ROOT/f'{p["slug"]}.html').write_text(product_page(p))
  (ROOT/'gracias.html').write_text(gracias_page())
  (ROOT/'productos.js').write_text('// Generado por build.py: no editar a mano\nconst products = ' +
    json.dumps(PRODUCTS, ensure_ascii=False, indent=1) + ';\n')
  for page in ['index.html', 'contacto.html']:
    replace_footer(page)
  urls = ['/', '/contacto'] + ['/' + p['slug'] for p in PRODUCTS]
  (ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    ''.join(f'  <url><loc>{SITE}{u}</loc><lastmod>{date.today()}</lastmod></url>\n' for u in urls) + '</urlset>\n')
  print('OK:', len(PRODUCTS), 'fichas + gracias.html + productos.js + footer + sitemap')
