// scripts/parse_ndl.js
// Usage: node scripts/parse_ndl.js /tmp/ndl.xml
const fs = require('fs');
const path = require('path');
const { DOMParser } = require('xmldom');

function text(node) {
  return node && node.textContent ? node.textContent.trim() : '';
}

function getFirstByTagNS(root, ns, tag) {
  try {
    const els = root.getElementsByTagNameNS(ns, tag);
    return els && els.length > 0 ? els[0] : null;
  } catch (e) {
    return null;
  }
}

function getValue(record, tag) {
  const dctermsNS = 'http://purl.org/dc/terms/';
  const dcNS = 'http://purl.org/dc/elements/1.1/';
  let el = getFirstByTagNS(record, dctermsNS, tag);
  if (!el) el = getFirstByTagNS(record, dcNS, tag);
  if (!el) {
    // fallback: try by tag name without namespace
    const els = record.getElementsByTagName(tag);
    if (els && els.length > 0) el = els[0];
  }
  return text(el);
}

function parseCreators(record) {
  const foafNS = 'http://xmlns.com/foaf/0.1/';
  const dctermsNS = 'http://purl.org/dc/terms/';
  const dcNS = 'http://purl.org/dc/elements/1.1/';
  const dcndlNS = 'http://ndl.go.jp/dcndl/terms/';

  const creators = [];
  // foaf:Agent
  const foafAgents = Array.from(record.getElementsByTagNameNS(foafNS, 'Agent'));
  foafAgents.forEach(agentEl => {
    const nameEl = agentEl.getElementsByTagNameNS(foafNS, 'name')[0];
    const transcriptionEl = agentEl.getElementsByTagNameNS(dcndlNS, 'transcription')[0];
    const rawName = nameEl ? text(nameEl) : text(agentEl);
    const normalized = rawName.replace(/,\s*/g, ' ').replace(/\s+/g, ' ').trim();
    const reading = transcriptionEl ? text(transcriptionEl) : '';
    creators.push({ name: normalized, reading });
  });

  // dcterms:creator without foaf:Agent
  const dctermsCreators = Array.from(record.getElementsByTagNameNS(dctermsNS, 'creator'));
  dctermsCreators.forEach(el => {
    if (el.getElementsByTagNameNS(foafNS, 'Agent').length > 0) return;
    const txt = text(el);
    if (txt) creators.push({ name: txt.replace(/\s+/g, ' ').trim(), reading: '' });
  });

  // dc:creator fallback, split heuristically
  const dcCreators = Array.from(record.getElementsByTagNameNS(dcNS, 'creator'));
  dcCreators.forEach(el => {
    const txt = text(el);
    if (!txt) return;
    const parts = txt.split(/、|,| and | 著| 編著/).map(s => s.trim()).filter(Boolean);
    parts.forEach(part => {
      const normalized = part.replace(/\s+/g, ' ').trim();
      if (!creators.some(c => c.name === normalized)) {
        creators.push({ name: normalized, reading: '' });
      }
    });
  });

  return creators;
}

function mapCreatorsToAuthors(creators) {
  return creators.map(creator => {
    if (typeof creator === 'string') {
      const name = creator.trim();
      let last = '';
      let first = '';
      if (name.includes(',')) {
        const parts = name.split(',').map(s => s.trim());
        last = parts[0] || '';
        first = parts[1] || '';
      } else {
        const parts = name.split(/\s+/);
        last = parts[0] || '';
        first = parts.slice(1).join(' ') || '';
      }
      return { lastName: last, firstName: first, reading: '' };
    }
    const name = (creator.name || '').trim();
    let last = '';
    let first = '';
    if (name.includes(',')) {
      const parts = name.split(',').map(s => s.trim());
      last = parts[0] || '';
      first = parts[1] || '';
    } else {
      const parts = name.split(/\s+/);
      last = parts[0] || '';
      first = parts.slice(1).join(' ') || '';
    }
    const rawReading = creator.reading || '';
    const normalizedReading = rawReading.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
    return { lastName: last, firstName: first, reading: normalizedReading };
  });
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node scripts/parse_ndl.js /path/to/ndl.xml');
    process.exit(1);
  }
  const xml = fs.readFileSync(filePath, 'utf8');
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const record = doc.getElementsByTagName('recordData')[0] || doc.getElementsByTagName('rdf:RDF')[0] || doc.documentElement;

  const title = getValue(record, 'title');
  const publisher = getValue(record, 'publisher');
  const issued = getValue(record, 'issued');

  const creators = parseCreators(record);
  const authors = mapCreatorsToAuthors(creators);

  console.log(JSON.stringify({ title, publisher, issued, creators, authors }, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
