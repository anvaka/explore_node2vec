import fs from 'fs';

export default function saveGraphToSvg(fileName, graph, layout, textContext) {
  let lines = [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  graph.forEachLink(link => {
    let from = layout.getNodePosition(link.fromId);
    let to = layout.getNodePosition(link.toId);
    updateMinMax(from); updateMinMax(to);

    lines.push(`<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="black" stroke-width="0.01"/>`)
  });

  let w = maxX - minX;
  let h = maxY - minY;
  let fontSize = Math.min(w, h) * .04;
  h += fontSize * textContext.length;

  let svg = [`<svg viewBox="${minX} ${minY} ${w} ${h}">`];

  svg.push('<g id="lines">')
  lines.forEach(l => svg.push(l));
  svg.push('</g>')

  let textY = maxY;
  let textX = minX;
  svg.push(`<text x="${textX}" y="${textY}" font-size="${fontSize}">`)
  textContext.forEach((line, idx) => {
    svg.push(`<tspan dy="1em" x="${textX}">${line}</tspan>`)
  })
  svg.push('</text>')
  svg.push("</svg>");

  fs.writeFileSync(fileName, svg.join('\n'), 'utf8');

  function updateMinMax(p) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
}