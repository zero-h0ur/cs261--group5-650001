// home-events.js
console.log('[home-events] loaded');
(function () {
  const $ = s => document.querySelector(s);
  const API_BASE = '/api';

  function parseISODateLocal(s) {
    if (!s || typeof s !== 'string') return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) {
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    }
    const [, y, mo, d] = m.map(Number);
    return new Date(y, mo - 1, d);
  }

  function fmtDate(d) {
    if (!d) return '-';
    const dt = d instanceof Date ? d : parseISODateLocal(d);
    if (!dt || isNaN(dt.getTime())) return '-';
    return dt.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const pick = (...xs) => xs.find(v => v !== undefined && v !== null && v !== '');

  // helper ใช้ปุ่ม bookmark จาก FAV ถ้ามี
  const renderBookmark = (id) =>
    (window.FAV && typeof window.FAV.renderBookmarkButton === 'function')
      ? window.FAV.renderBookmarkButton(id)
      : '';

  function card(ev) {
    const id = pick(ev.eventId, ev.event_id, ev.id, '');
    const img = pick(
      ev.imageUrl, ev.imageURL, ev.image_url, ev.image, ev.imagePath,
      'Resourse/Poster/image 14.png'
    );

    const start = pick(ev.startDate, ev.start_date, ev.start, ev.dateStart);
    const end = pick(ev.endDate, ev.end_date, ev.end, ev.dateEnd);
    const date = (start && end) ? `${fmtDate(start)} - ${fmtDate(end)}` : fmtDate(start);

    const timeText = pick(ev.time, ev.startTime, ev.start_time, '-');
    const title = pick(ev.title, '(ไม่มีชื่อกิจกรรม)');
    const location = pick(ev.location, '-');

    return `
      <div class="search-page-group" data-event-id="${id}">
        ${renderBookmark(id)}
        <a href="event-detail.html?id=${encodeURIComponent(String(id))}">
          <img src="${img}" alt="Poster" class="search-page-Poster"
               onerror="this.src='Resourse/Poster/image 14.png'"/>
          <span class="search-page-date">${date}</span>
          <div class="search-page-time">
            <img src="Resourse/icon/clock.png" class="clock"/>
            <span class="search-page-clock">${timeText}</span>
          </div>
          <span class="search-page-name">${title}</span>
          <div class="search-page-place">
            <img src="Resourse/icon/pin" class="pin"/>
            <span class="search-page-pin">${location}</span>
          </div>
          <button class="register-btn">ลงทะเบียน</button>
        </a>
      </div>`;
  }

  async function fetchPage({ page, size, sort, dir, useFilter }) {
    const hasCategory = Array.isArray(ALL.categoryIds) && ALL.categoryIds.length > 0;
    const hasDate = !!(ALL.startDate || ALL.endDate);
    const applyFilter = useFilter !== false && (hasCategory || hasDate);

    let endpoint;
    let p;

    if (applyFilter) {
      endpoint = `${API_BASE}/events/filter`;
      p = new URLSearchParams({
        page: String(page - 1),
        size: String(size),
        sort: `${sort},${dir}`,
      });

      if (hasCategory) p.set('categories', ALL.categoryIds.join(','));
      if (ALL.startDate) p.set('start', ALL.startDate);
      if (ALL.endDate) p.set('end', ALL.endDate);
    } else {
      endpoint = `${API_BASE}/events`;
      p = new URLSearchParams({
        page: String(page - 1),
        limit: String(size),
        sort,
        dir,
      });
      if (hasCategory && useFilter !== false) {
        p.set('category', ALL.categoryIds.join(','));
      }
    }

    console.log('[home-events] fetchPage', {
      endpoint,
      params: p.toString(),
      ALL_snapshot: { startDate: ALL.startDate, endDate: ALL.endDate, categoryIds: ALL.categoryIds }
    });

    const res = await fetch(`${endpoint}?${p.toString()}`, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function loadRecommend() {
    const grid = $('#homeGridRec'), empty = $('#homeEmptyRec');
    if (!grid) return;
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#6b7280">กำลังโหลด…</div>`;
    try {
      const page = await fetchPage({
        page: 1,
        size: 5,
        sort: 'eventId',
        dir: 'desc',
        useFilter: false
      });
      const items = Array.isArray(page) ? page : (page?.content ?? []);
      if (!items.length) { grid.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
      if (empty) empty.style.display = 'none';
      grid.innerHTML = items.map(card).join('');
    } catch (e) {
      console.error(e);
      grid.innerHTML = `<div style="grid-column:1/-1;padding:12px;border:1px solid #fecaca;background:#fee2e2;color:#991b1b;border-radius:8px;">โหลดส่วนแนะนำไม่สำเร็จ (${e.message})</div>`;
      if (empty) empty.style.display = 'none';
    }
  }

  const ALL = {
    page: 1,
    size: 10,
    sort: 'eventId',
    dir: 'desc',
    totalPages: 1,
    startDate: null,
    endDate: null,
    categoryIds: []
  };

  function renderPager(page) {
    const wrap = $('#homePagerAll');
    if (!wrap) return;

    const total = page.totalPages ?? page.total_pages ?? 1;
    ALL.totalPages = total;

    const cur = ALL.page, tot = ALL.totalPages;

    wrap.innerHTML = `
      <div class="pagenumber"
           style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;">
        <i class="material-icons" id="HomePrev" style="cursor:pointer">keyboard_arrow_left</i>
        ${Array.from({ length: tot }, (_, i) => `
          <div class="page-dot" data-page="${i + 1}"
               style="
                 display:flex;align-items:center;justify-content:center;
                 width:${i + 1 === cur ? 35 : 30}px;height:${i + 1 === cur ? 35 : 30}px;
                 border-radius:50%; margin:6px; transition:all .2s; cursor:pointer;
                 font-family:Pridi, sans-serif; font-size:16px; font-weight:600;
                 ${i + 1 === cur ? 'background:#F68121;color:#fff;' : 'background:#f8bb86;color:#000;'}>
            ${i + 1}
          </div>
        `).join('')}
        <i class="material-icons" id="HomeNext" style="cursor:pointer">keyboard_arrow_right</i>
      </div>
      <div class="page-info" id="pageInfo"
           style="text-align:center;margin-top:10px;font-weight:500;
                  font-family:Pridi, sans-serif;font-size:16px;color:#00000075;">
      </div>
    `;

    const pageInfo = $('#pageInfo');
    if (pageInfo) pageInfo.textContent = `หน้า ${ALL.page} จาก ${ALL.totalPages}`;

    const prevBtn = $('#HomePrev');
    const nextBtn = $('#HomeNext');
    if (prevBtn) prevBtn.style.visibility = (ALL.page === 1) ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.style.visibility = (ALL.page === tot) ? 'hidden' : 'visible';

    prevBtn?.addEventListener('click', () => {
      if (ALL.page > 1) { ALL.page--; loadAll(); }
    });
    nextBtn?.addEventListener('click', () => {
      if (ALL.page < tot) { ALL.page++; loadAll(); }
    });

    wrap.querySelectorAll('.page-dot').forEach(el =>
      el.addEventListener('click', () => {
        const p = Number(el.dataset.page);
        if (p && p !== ALL.page) { ALL.page = p; loadAll(); }
      })
    );
  }

  async function loadAll() {
    const grid = $('#homeGridAll'), empty = $('#homeEmptyAll');
    if (!grid) return;

    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#6b7280">กำลังโหลดกิจกรรม...</div>`;
    const pager = $('#homePagerAll'); if (pager) pager.innerHTML = '';

    try {
      const page = await fetchPage(ALL);
      const items = Array.isArray(page) ? page : (page?.content ?? []);

      if (!items.length) {
        grid.innerHTML = `<div id="homenone-event">ไม่มีข้อมูลกิจกรรม</div>`;
        if (empty) empty.style.display = 'none';
        if (pager) pager.innerHTML = '';
        return;
      }

      if (empty) empty.style.display = 'none';
      grid.innerHTML = items.map(card).join('');
      renderPager(page);

    } catch (e) {
      console.error(e);
      grid.innerHTML = `
        <div style="grid-column:1/-1;padding:16px;margin:40px auto;
                    max-width:600px;text-align:center;
                    border-radius:12px;background:#fee2e2;
                    color:#991b1b;font-family:'Pridi';
                    border:1px solid #fecaca;">
          เกิดข้อผิดพลาดในการเชื่อมต่อ<br/>
          กรุณาลองใหม่ภายหลัง
        </div>`;
      const pager = $('#homePagerAll');
      if (pager) pager.innerHTML = '';
      if (empty) empty.style.display = 'none';
    }
  }

  // DOM READY
  document.addEventListener('DOMContentLoaded', () => {
    (async () => {
      if (window.FAV && typeof window.FAV.loadFavorites === 'function') {
        await window.FAV.loadFavorites();
      }
      if (window.FAV && typeof window.FAV.attachFavoriteClickHandler === 'function') {
        window.FAV.attachFavoriteClickHandler(document);
      }
      loadRecommend();
      loadAll();
    })();
  });
})();
