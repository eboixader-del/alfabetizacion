#!/usr/bin/env python3
"""Genera data/recomendador.va.json (el recomendador en valenciano) a partir de
data/recomendador.json y de las traducciones que ya tienen las páginas:

  · Code.org y Raspberry Pi: descripciones de i18n/codeorg.va.js e i18n/raspberrypi.va.js
  · Pensamiento crítico y verificación: títulos y resúmenes de sus archivos i18n/*.va.js

Uso (desde la carpeta de la web):  python3 tools/generar_recomendador_va.py
Hay que volver a ejecutarlo cada vez que cambie data/recomendador.json o alguna de esas traducciones.
"""
import json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


def bloque_js(ruta, nombre):
    """Extrae el objeto JSON asignado a VA.<nombre> en un archivo i18n/*.va.js."""
    s = (RAIZ / ruta).read_text(encoding='utf-8')
    m = re.search(r'VA\.' + nombre + r' = (\{.*?\});\n', s, re.S)
    if not m:
        sys.exit(f'No encuentro VA.{nombre} en {ruta}')
    return json.loads(m.group(1))


def datos_pagina(ruta, nombre):
    s = (RAIZ / ruta).read_text(encoding='utf-8')
    return json.loads(re.search(r'const ' + nombre + r' = (\[.*?\]);\n', s, re.S).group(1))


# Descripción original (castellano) → traducción, para los catálogos
co_va = bloque_js('i18n/codeorg.va.js', 'desc')
rp_va = bloque_js('i18n/raspberrypi.va.js', 'desc')
desc_va = {}
for c in datos_pagina('codeorg.html', 'CURSOS'):
    if c['id'] in co_va:
        desc_va[c['descripcion']] = co_va[c['id']]
for p in datos_pagina('raspberrypi.html', 'PROY'):
    if p['id'] in rp_va:
        desc_va[p['desc']] = rp_va[p['id']]

act_va = {'pc': bloque_js('i18n/pensamiento-critico.va.js', 'act'),
          'ver': bloque_js('i18n/verificacion-ia.va.js', 'act')}

DUR = {'1 sesión': '1 sessió', '1 semana': '1 setmana', 'Curso completo': 'Curs complet'}


def extra(x):
    """Etiqueta corta («1 semana · 12 h», «Nivel 2 · en inglés»…) en valenciano."""
    for es, va in DUR.items():
        x = x.replace(es, va)
    return (x.replace('Nivel', 'Nivell').replace('en castellano', 'en castellà')
             .replace('en inglés', 'en anglés').replace('Evaluar', 'Avaluar'))


datos = json.loads((RAIZ / 'data/recomendador.json').read_text(encoding='utf-8'))
sin = []
for it in datos:
    if it['f'] in act_va:
        ident = it['u'].split('#', 1)[-1]
        v = act_va[it['f']].get(ident)
        if v:
            it['t'] = v.get('titulo', it['t'])
            it['d'] = v.get('resumen', it['d'])
        else:
            sin.append(it['t'])
    elif it['d'] in desc_va:
        it['d'] = desc_va[it['d']]
    else:
        sin.append(it['t'])
    it['x'] = extra(it.get('x', ''))

(RAIZ / 'data/recomendador.va.json').write_text(
    json.dumps(datos, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(f'data/recomendador.va.json: {len(datos)} recursos, {len(sin)} sin traducción')
for t in sin:
    print('  sin traducir:', t)
