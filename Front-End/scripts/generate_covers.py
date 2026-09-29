#!/usr/bin/env python3
"""Gera capas SVG originais (2:3) em public/covers/{slug}.svg. Uso: python3 scripts/generate_covers.py

São ilustrações próprias do projeto, não reproduções de capas reais. O slug segue a mesma regra
do SlugUtil do backend, então coverUrl = /covers/{slug}.svg."""
import html
import pathlib
import re
import unicodedata

OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "covers"

# título, autor, fundo, cor de destaque, motivo
BOOKS = [
    ("Dom Casmurro", "Machado de Assis", "#1f3a5f", "#e8c26b", "sun"),
    ("Memórias Póstumas de Brás Cubas", "Machado de Assis", "#4a2c3d", "#f0d9b5", "arches"),
    ("O Alienista", "Machado de Assis", "#2f5d50", "#f4e3b2", "circles"),
    ("O Cortiço", "Aluísio Azevedo", "#7a3b1e", "#f2cf8f", "stripes"),
    ("Iracema", "José de Alencar", "#2d6a4f", "#f7e8a4", "waves"),
    ("A Metamorfose", "Franz Kafka", "#2b2b2b", "#c9c2b0", "diagonal"),
    ("Crime e Castigo", "Fiódor Dostoiévski", "#5a1e1e", "#e8d5b5", "bars"),
    ("Meditações", "Marco Aurélio", "#3d4f6b", "#eadfc4", "columns"),
    ("A República", "Platão", "#6b5a3a", "#f3ead2", "arches"),
    ("Assim Falou Zaratustra", "Friedrich Nietzsche", "#1e2a44", "#f0b429", "sun"),
    ("O Príncipe", "Nicolau Maquiavel", "#6e1f2b", "#e9d8a6", "diagonal"),
    ("A Arte da Guerra", "Sun Tzu", "#8a2b1f", "#f5e6c8", "circles"),
    ("Poemas Escolhidos", "Fernando Pessoa", "#3b3f6b", "#f2e2c2", "waves"),
]


def slugify(text: str) -> str:
    t = unicodedata.normalize("NFD", text)
    t = "".join(c for c in t if unicodedata.category(c) != "Mn").lower()
    return re.sub(r"(^-|-$)", "", re.sub(r"[^a-z0-9]+", "-", t))


def wrap(text: str, width: int) -> list[str]:
    lines, cur = [], ""
    for word in text.split():
        if cur and len(cur) + 1 + len(word) > width:
            lines.append(cur)
            cur = word
        else:
            cur = f"{cur} {word}".strip()
    if cur:
        lines.append(cur)
    return lines


def motif(kind: str, accent: str) -> str:
    a = f'fill="{accent}"'
    s = f'fill="none" stroke="{accent}" stroke-width="3"'
    if kind == "sun":
        rays = "".join(f'<line x1="150" y1="120" x2="{150 + 78 * __import__("math").cos(i * 0.5236):.1f}" y2="{120 + 78 * __import__("math").sin(i * 0.5236):.1f}" stroke="{accent}" stroke-width="3" opacity=".6"/>' for i in range(12))
        return f'{rays}<circle cx="150" cy="120" r="42" {a}/>'
    if kind == "arches":
        return "".join(f'<path d="M{40 + i * 74} 190 v-70 a37 37 0 0 1 74 0 v70" {s} opacity="{0.9 - i * 0.15}"/>' for i in range(3))
    if kind == "circles":
        return f'<circle cx="120" cy="120" r="55" {s}/><circle cx="180" cy="120" r="55" {s}/><circle cx="150" cy="120" r="12" {a}/>'
    if kind == "stripes":
        return "".join(f'<rect x="40" y="{60 + i * 22}" width="{220 - i * 24}" height="10" {a} opacity="{0.95 - i * 0.12}"/>' for i in range(6))
    if kind == "waves":
        return "".join(f'<path d="M30 {80 + i * 26} q30 -22 60 0 t60 0 t60 0 t60 0" {s} opacity="{0.95 - i * 0.18}"/>' for i in range(4))
    if kind == "diagonal":
        return "".join(f'<line x1="{40 + i * 40}" y1="40" x2="{i * 40 - 20}" y2="200" stroke="{accent}" stroke-width="4" opacity="{0.9 - i * 0.1}"/>' for i in range(8))
    if kind == "bars":
        return "".join(f'<rect x="{50 + i * 34}" y="{200 - h}" width="22" height="{h}" {a} opacity=".85"/>' for i, h in enumerate([90, 130, 60, 150, 100, 120]))
    if kind == "columns":
        return "".join(f'<rect x="{62 + i * 50}" y="80" width="26" height="110" {a} opacity=".9"/><rect x="{56 + i * 50}" y="70" width="38" height="10" {a}/>' for i in range(4))
    return ""


def cover(title: str, author: str, bg: str, accent: str, kind: str) -> str:
    lines = wrap(title, 13)
    size = 34 if max(len(l) for l in lines) <= 9 else 28 if max(len(l) for l in lines) <= 12 else 24
    y0 = 300 - (len(lines) - 1) * size * 0.6
    tspans = "".join(
        f'<tspan x="150" y="{y0 + i * size * 1.15:.0f}">{html.escape(l)}</tspan>' for i, l in enumerate(lines)
    )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" role="img" aria-label="Capa de {html.escape(title)}">
<rect width="300" height="450" fill="{bg}"/>
<rect x="12" y="12" width="276" height="426" fill="none" stroke="{accent}" stroke-width="1.5" opacity=".7"/>
<g>{motif(kind, accent)}</g>
<text text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="{size}" fill="{accent}">{tspans}</text>
<line x1="110" y1="374" x2="190" y2="374" stroke="{accent}" stroke-width="1.5" opacity=".7"/>
<text x="150" y="398" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="15" letter-spacing="1.5" fill="{accent}">{html.escape(author.upper())}</text>
<text x="150" y="428" text-anchor="middle" font-family="Georgia, serif" font-size="10" letter-spacing="4" fill="{accent}" opacity=".7">OTIUM</text>
</svg>
'''


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for title, author, bg, accent, kind in BOOKS:
        (OUT / f"{slugify(title)}.svg").write_text(cover(title, author, bg, accent, kind), encoding="utf-8")
    print(f"{len(BOOKS)} capas geradas em {OUT}")
