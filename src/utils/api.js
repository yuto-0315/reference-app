/**
 * src/utils/api.js
 */

/**
 * ISBNを元に国立国会図書館サーチAPIから書籍情報を取得します。
 * @param {string} isbn - ISBN（10桁または13桁）
 * @returns {Promise<object|null>} 書籍情報のオブジェクト、または見つからない場合はnull
 */
export const fetchBookInfoByISBN = async (isbn) => {
  const url = `https://ndlsearch.ndl.go.jp/api/sru?operation=searchRetrieve&query=isbn%3D${isbn}&recordSchema=dcndl&recordPacking=xml&onlyBib=true`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const record = xmlDoc.querySelector('recordData');
    // console.log(record);
    if (!record) {
      return null;
    }

    // helper: get simple values for dcterms: or dc: tags (fallback)
    const getValue = (tag) => {
        const el = record.querySelector(`dcterms\\:${tag}, dc\\:${tag}, ${tag}`);
        return el ? el.textContent : null;
    };

    // title: prefer rdf:value inside dc:title/rdf:Description
    const rdfNS = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
    const getTitle = () => {
      const dcTitleEls = Array.from(record.getElementsByTagNameNS(dcNS, 'title'));
      for (const t of dcTitleEls) {
        // look for rdf:Description/rdf:value
        const desc = t.getElementsByTagNameNS(rdfNS, 'Description')[0];
        if (desc) {
          const val = desc.getElementsByTagNameNS(rdfNS, 'value')[0];
          if (val && val.textContent.trim()) return val.textContent.trim();
        }
        // fallback: textContent of title element
        if (t.textContent && t.textContent.trim()) return t.textContent.trim();
      }
      return null;
    };

    // creators: process dcterms:creator entries only so publisher/other Agents are not included
    const foafNS = 'http://xmlns.com/foaf/0.1/';
    const dctermsNS = 'http://purl.org/dc/terms/';
    const dcNS = 'http://purl.org/dc/elements/1.1/';
    const dcndlNS = 'http://ndl.go.jp/dcndl/terms/';

    const creators = [];

    // Process each dcterms:creator element. If it contains a foaf:Agent, extract from that Agent;
    // otherwise use plain text inside the creator element.
    const dctermsCreators = Array.from(record.getElementsByTagNameNS(dctermsNS, 'creator'));
    dctermsCreators.forEach(el => {
      const agent = el.getElementsByTagNameNS(foafNS, 'Agent')[0];
      if (agent) {
        const nameEl = agent.getElementsByTagNameNS(foafNS, 'name')[0];
        const transcriptionEl = agent.getElementsByTagNameNS(dcndlNS, 'transcription')[0];
        const rawName = nameEl ? nameEl.textContent.trim() : agent.textContent.trim();
        const normalized = rawName.replace(/,\s*/g, ' ').replace(/\s+/g, ' ').trim();
        const reading = transcriptionEl ? transcriptionEl.textContent.trim() : '';
        creators.push({ name: normalized, reading });
      } else {
        const txt = el.textContent.trim();
        if (txt) creators.push({ name: txt.replace(/\s+/g, ' ').trim(), reading: '' });
      }
    });

    // dc:creator fallback - split by common separators and avoid duplicates
    const dcCreators = Array.from(record.getElementsByTagNameNS(dcNS, 'creator'));
    dcCreators.forEach(el => {
      const txt = el.textContent.trim();
      if (!txt) return;
      const parts = txt.split(/、|,| and | 著| 編著/).map(s => s.trim()).filter(Boolean);
      parts.forEach(part => {
        const normalized = part.replace(/\s+/g, ' ').trim();
        if (!creators.some(c => c.name === normalized)) {
          creators.push({ name: normalized, reading: '' });
        }
      });
    });

    // publisher: try to extract foaf:Agent inside dcterms:publisher
    let publisherObj = null;
    try {
      const dctermsPublisherEls = Array.from(record.getElementsByTagNameNS(dctermsNS, 'publisher'));
      if (dctermsPublisherEls.length > 0) {
        const pubEl = dctermsPublisherEls[0];
        const foafAgent = pubEl.getElementsByTagNameNS(foafNS, 'Agent')[0];
        if (foafAgent) {
          const nameEl = foafAgent.getElementsByTagNameNS(foafNS, 'name')[0];
          const transcriptionEl = foafAgent.getElementsByTagNameNS(dcndlNS, 'transcription')[0];
          const locationEl = foafAgent.getElementsByTagNameNS(dcndlNS, 'location')[0];
          const name = nameEl ? nameEl.textContent.trim() : pubEl.textContent.trim();
          const reading = transcriptionEl ? transcriptionEl.textContent.trim() : '';
          const location = locationEl ? locationEl.textContent.trim() : '';
          publisherObj = { name: name.replace(/\s+/g, ' ').trim(), reading, location };
        }
      }
    } catch (e) {
      console.error("Error extracting publisher info:", e);
    }

    return {
      // title: prefer rdf:value inside dc:title
      title: getTitle(),
      creators: creators,
  publisher: publisherObj ? publisherObj.name : getValue('publisher'),
  publisherObj,
  isbn: isbn,
      issued: getValue('issued'),
    };
  } catch (error) {
    console.error("Failed to fetch book info from NDL:", error);
    throw error; // エラーを呼び出し元に伝える
  }
};


/**
 * 論文タイトルを元にCiNii Articles APIから論文情報を検索します。
 * @param {string} title - 論文タイトル
 * @returns {Promise<Array>} 論文情報の配列
 */
export const searchCiNiiByTitle = async (title) => {
    const appId = 'OCtS3oAPLKiyuDYqZ3iN';
    const url = `https://cir.nii.ac.jp/opensearch/articles?q=${encodeURIComponent(title)}&format=json&appid=${appId}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    const data = await response.json();
    console.log("CiNii search results:", data);

    // Normalize possible shapes: top-level `items`, `@graph[*].items`,
    // or single object -> coerce into array
    let rawItems = [];
    if (data && data.items) {
      rawItems = Array.isArray(data.items) ? data.items : [data.items];
    } else if (data && data['@graph'] && Array.isArray(data['@graph'])) {
      // try @graph entries for items
      // prefer the first graph entry if it has items
      if (data['@graph'][0] && data['@graph'][0].items) {
        rawItems = Array.isArray(data['@graph'][0].items) ? data['@graph'][0].items : [data['@graph'][0].items];
      } else {
        // collect items from all graph entries
        rawItems = data['@graph'].flatMap(g => g && g.items ? (Array.isArray(g.items) ? g.items : [g.items]) : []);
      }
    }

    console.log("CiNii normalized rawItems count:", Array.isArray(rawItems) ? rawItems.length : 0);
    if (Array.isArray(rawItems) && rawItems.length > 0) {
      console.log("Sample rawItem[0]:", rawItems[0]);
    }
    if (!Array.isArray(rawItems) || rawItems.length === 0) return [];

  const normalizeAuthorField = (creatorsField) => {
      const unwrap = (c) => {
        if (!c && c !== '') return null;
        if (typeof c === 'string') return c;
        // direct language map: {"@language":"ja","@value":"名前"}
        if (c['@value'] && typeof c['@value'] === 'string') return c['@value'];
        if (c['@value'] && typeof c['@value'] === 'object') {
          // nested language map or object
          if (c['@value']['@value']) return c['@value']['@value'];
          if (c['@value']['@lang'] && c['@value']['@value']) return c['@value']['@value'];
          // fallback to first string value inside the object
          const vals = Object.values(c['@value']).filter(v => typeof v === 'string');
          if (vals.length) return vals[0];
        }
        // sometimes the object itself is a language map
        if (c['@language'] && c['@value']) return c['@value'];
        if (c['@id']) return c['@id'];
        // fallback: try to extract first string property
        const v = Object.values(c).find(x => typeof x === 'string');
        return v || null;
      };

      if (!creatorsField) return [];
      if (Array.isArray(creatorsField)) {
        return creatorsField.map(c => unwrap(c)).filter(Boolean);
      }
      if (typeof creatorsField === 'string') return [creatorsField];
      const single = unwrap(creatorsField);
      return single ? [single] : [];
    };
  const unwrapValue = (v) => {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'object') {
      if (v['@value'] && typeof v['@value'] === 'string') return v['@value'];
      if (v['@value'] && typeof v['@value'] === 'object') {
        const vals = Object.values(v['@value']).filter(x => typeof x === 'string');
        if (vals.length) return vals[0];
      }
      if (v['@id'] && typeof v['@id'] === 'string') return v['@id'];
      const s = Object.values(v).find(x => typeof x === 'string');
      return s || '';
    }
    return String(v);
  };

  // helper: extract DOI and NDL uri from dc:identifier-like arrays
  const extractIdentifiers = (identArr) => {
    const out = { doi: null, ndl: null, ndlBibId: null };
    if (!identArr) return out;
    const arr = Array.isArray(identArr) ? identArr : [identArr];
    for (const it of arr) {
      if (!it) continue;
      if (typeof it === 'string') {
        const s = it.trim();
        if (s.startsWith('http') && s.includes('ndl')) out.ndl = out.ndl || s;
        if (s.includes('10.')) out.doi = out.doi || s;
        continue;
      }
      const type = (it['@type'] || it.type || '').toString();
      const value = (it['@value'] || it.value || it['@id'] || it['id'] || '').toString();
      if (!value) continue;
      const lower = type.toLowerCase();
      if (lower.includes('doi')) {
        out.doi = out.doi || value;
      }
      if (lower.includes('uri') || value.startsWith('http')) {
        // prefer NDL search URL if it looks like ndlsearch
        if (value.includes('ndlsearch') || value.includes('id.ndl.go.jp')) {
          out.ndl = out.ndl || value;
        } else if (!out.ndl && value.startsWith('http')) {
          out.ndl = out.ndl || value;
        }
      }
      if (lower.includes('ndl_bib') || lower.includes('ndlbib') || lower.includes('ndl_bib_id')) {
        out.ndlBibId = out.ndlBibId || value;
      }
    }
    return out;
  };

    const mapped = rawItems.map(item => {
      const ids = extractIdentifiers(item['dc:identifier'] || item.identifier || item['identifier']);
      const defaultLink = unwrapValue((item.link && item.link['@id']) || item['@id'] || null) || null;
      // prefer NDL link when available
      const preferredLink = ids.ndl || defaultLink;
      return {
        title: unwrapValue(item.title || item['dc:title'] || ''),
        authors: normalizeAuthorField(item['dc:creator'] || item.creator || item['creator']),
        journal: unwrapValue(item['prism:publicationName'] || item['prism:publication'] || item['dc:source'] || ''),
        publisher: unwrapValue(item['dc:publisher'] || item['publisher'] || ''),
        volume: unwrapValue(item['prism:volume'] || ''),
        issue: unwrapValue(item['prism:number'] || item['prism:issue'] || ''),
        pages: (item['prism:startingPage'] && item['prism:endingPage']) ? `${unwrapValue(item['prism:startingPage'])}-${unwrapValue(item['prism:endingPage'])}` : unwrapValue(item['prism:startingPage'] || ''),
        year: item['prism:publicationDate'] ? String(item['prism:publicationDate']).split('-')[0] : unwrapValue(item['dc:date'] || ''),
        link: preferredLink || null,
        doi: ids.doi || null,
        ndlLink: ids.ndl || null,
        seeAlso: unwrapValue((item['rdfs:seeAlso'] && item['rdfs:seeAlso']['@id']) || (item.seeAlso && item.seeAlso['@id']) || null) || null,
      };
    });
  console.log("CiNii mapped results count:", mapped.length);
  return mapped;
    } catch (error) {
        console.error("Failed to search CiNii:", error);
        throw error;
    }
};


/**
 * CiNii の記事詳細（JSON）を取得して正規化して返す
 * @param {string} linkOrSeeAlso - 検索結果の link または seeAlso の URL
 * @returns {Promise<object>} 標準化された記事オブジェクト
 */
export const fetchCiNiiArticleDetails = async (linkOrSeeAlso) => {
  if (!linkOrSeeAlso) return null;

  console.log("Fetching CiNii article data from:", linkOrSeeAlso);
  const tryUrls = [];
  if (linkOrSeeAlso.endsWith('.json')) {
    tryUrls.push(linkOrSeeAlso);
  } else {
    tryUrls.push(linkOrSeeAlso + '.json');
    tryUrls.push(linkOrSeeAlso.replace(/\/$/, '') + '.json');
    tryUrls.push(linkOrSeeAlso);
  }

  const normalizeAuthors = (item) => {
    const creators = item['dc:creator'] || item.creator || item.creator || null;
    if (!creators) return [];
    const unwrap = (c) => {
      if (!c && c !== '') return null;
      if (typeof c === 'string') return c;
      if (c['@value'] && typeof c['@value'] === 'string') return c['@value'];
      if (c['@value'] && typeof c['@value'] === 'object') {
        if (c['@value']['@value']) return c['@value']['@value'];
        const vals = Object.values(c['@value']).filter(v => typeof v === 'string');
        if (vals.length) return vals[0];
      }
      if (c['@language'] && c['@value']) return c['@value'];
      if (c['@id']) return c['@id'];
      const v = Object.values(c).find(x => typeof x === 'string');
      return v || null;
    };

    if (Array.isArray(creators)) {
      return creators.map(c => unwrap(c)).filter(Boolean);
    }
    if (typeof creators === 'string') return [creators];
    const single = unwrap(creators);
    return single ? [single] : [];
  };

  for (const url of tryUrls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();

      // data may contain items array or be a single item
      const rawItems = data.items || (data['@graph'] && data['@graph'][0] && data['@graph'][0].items) || (Array.isArray(data) ? data : null);
      const first = Array.isArray(rawItems) && rawItems.length > 0 ? rawItems[0] : (data.items ? data.items[0] : data);
      const item = first || data;
      if (!item) continue;

      const unwrapValue = (v) => {
        if (v == null) return '';
        if (typeof v === 'string') return v;
        if (typeof v === 'object') {
          if (v['@value'] && typeof v['@value'] === 'string') return v['@value'];
          if (v['@value'] && typeof v['@value'] === 'object') {
            const vals = Object.values(v['@value']).filter(x => typeof x === 'string');
            if (vals.length) return vals[0];
          }
          if (v['@id'] && typeof v['@id'] === 'string') return v['@id'];
          const s = Object.values(v).find(x => typeof x === 'string');
          return s || '';
        }
        return String(v);
      };

      // extract identifiers like DOI / NDL from dc:identifier
      const ids = extractIdentifiers(item['dc:identifier'] || item.identifier || item['identifier']);
      const defaultLink = unwrapValue(item['@id'] || (item.link && item.link['@id']) || url);
      const preferredLink = ids.ndl || defaultLink;
      return {
        title: unwrapValue(item.title || item['dc:title'] || ''),
        authors: normalizeAuthors(item),
        journal: unwrapValue(item['prism:publicationName'] || item['prism:publication'] || item['dc:source'] || ''),
        publisher: unwrapValue(item['dc:publisher'] || item['publisher'] || ''),
        volume: unwrapValue(item['prism:volume'] || ''),
        issue: unwrapValue(item['prism:number'] || item['prism:issue'] || ''),
        pages: (item['prism:startingPage'] && item['prism:endingPage']) ? `${unwrapValue(item['prism:startingPage'])}-${unwrapValue(item['prism:endingPage'])}` : unwrapValue(item['prism:startingPage'] || ''),
        year: item['prism:publicationDate'] ? String(item['prism:publicationDate']).split('-')[0] : unwrapValue(item['dc:date'] || ''),
        link: preferredLink,
        doi: ids.doi || null,
        ndlLink: ids.ndl || null,
      };
    } catch (e) {
      // try next url
      continue;
    }
  }
  return null;
};
