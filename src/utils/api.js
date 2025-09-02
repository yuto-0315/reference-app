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
    const url = `https://ci.nii.ac.jp/opensearch/search?q=${encodeURIComponent(title)}&format=json&appid=${appId}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data['@graph'] && data['@graph'][0].items) {
            return data['@graph'][0].items.map(item => ({
                title: item.title,
                authors: item['dc:creator'] ? item['dc:creator'].map(c => c['@value']) : [],
                journal: item['prism:publicationName'] || '',
                volume: item['prism:volume'] || '',
                issue: item['prism:number'] || '',
                pages: item['prism:startingPage'] && item['prism:endingPage'] 
                    ? `${item['prism:startingPage']}-${item['prism:endingPage']}` 
                    : item['prism:startingPage'] || '',
                year: item['prism:publicationDate'] ? item['prism:publicationDate'].split('-')[0] : '',
                link: item['@id']
            }));
        }
        return [];
    } catch (error) {
        console.error("Failed to search CiNii:", error);
        throw error;
    }
};
