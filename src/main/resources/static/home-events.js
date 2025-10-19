console.log('[home-events] loaded');
(function () {
  const $ = s => document.querySelector(s);

  // แปลง "YYYY-MM-DD" → Date แบบ local-safe (กัน Safari/บางเบราว์เซอร์พัง)
  function parseISODateLocal(s) {
    if (!s || typeof s !== 'string') return null;
    // รูปแบบที่ API ส่งมา: "2025-12-15"
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) {
      // ถ้าไม่ใช่รูปแบบนี้ ค่อย fallback ใช้ Date ปกติ
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    }
    const [, y, mo, d] = m.map(Number);
    // สร้าง Date แบบ local timezone (ไม่ใช่ UTC)
    return new Date(y, mo - 1, d);
  }

  function fmtDate(d) {
    if (!d) return '-';
    let dt = d instanceof Date ? d : parseISODateLocal(d);  // ใช้ parse แบบปลอดภัย
    if (!dt || isNaN(dt.getTime())) return '-';
    return dt.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });
  }
<<<<<<< HEAD

  function card(ev) {
    // รองรับทั้ง snake + camel
    const id  = ev.event_id ?? ev.eventId ?? ev.id ?? '';
    const img = ev.image_url ?? ev.imageUrl ?? ev.imageURL ?? 'Resourse/Poster/image 14.png';

    // ดึงวันที่จาก snake ก่อน แล้วค่อย fallback มา camel
    const s = ev.start_date ?? ev.startDate;
    const e = ev.end_date   ?? ev.endDate;

    const dateText = (s && e) ? `${fmtDate(s)} - ${fmtDate(e)}` : fmtDate(s || e);

 
=======
  function card(ev){
    const id   = ev.eventId ?? ev.id ?? '';
	const img =
	  ev.imageUrl       // camelCase
	  || ev.imageURL    // Pascal-ish
	  || ev.image_url   // <-- รองรับ snake_case จาก API
	  || ev.image       // เผื่อกรณีชื่อฟิลด์อื่น
	  || ev.imagePath
	  || 'Resourse/Poster/image 14.png'; // fallback
    const date = (ev.startDate && ev.endDate)
      ? `${fmtDate(ev.startDate)} - ${fmtDate(ev.endDate)}`
      : fmtDate(ev.startDate);
>>>>>>> 6d0ce80 (Fix bug)
    return `
      <div class="search-page-group">
        <a href="event-detail.html?id=${id}">
          <img src="${img}" alt="Poster" class="search-page-Poster"
               onerror="this.src='Resourse/Poster/image 14.png'"/>
          <span class="search-page-date">${dateText}</span>
          <div class="search-page-time">
            <img src="Resourse/icon/clock.png" alt="clock" class="clock"/>
            <span class="search-page-clock">${ev.time ?? '-'}</span>
          </div>
          <span class="search-page-name">${ev.title ?? '(ไม่มีชื่อกิจกรรม)'}</span>
          <div class="search-page-place">
            <img src="Resourse/icon/pin.png" alt="pin" class="pin"/>
            <span class="search-page-pin">${ev.location ?? '-'}</span>
          </div>
          <button class="register-btn">ลงทะเบียน</button>
        </a>
      </div>`;
  }

  async function fetchPage({ page, size, sort, dir }) {
    const p = new URLSearchParams({ page: String(page - 1), limit: String(size), sort, dir });
    const res = await fetch(`/api/events?${p}`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function loadRecommend() {
    const grid = $('#homeGridRec'), empty = $('#homeEmptyRec');
    if (!grid) return;
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#6b7280">กำลังโหลด…</div>`;
    try {
      const page = await fetchPage({ page: 1, size: 5, sort: 'eventId', dir: 'desc' });
      const items = page?.content ?? [];
      if (!items.length) { grid.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
      if (empty) empty.style.display = 'none';
      grid.innerHTML = items.map(card).join('');
    } catch (e) {
      console.error(e);
      grid.innerHTML = `<div style="grid-column:1/-1;padding:12px;border:1px solid #fecaca;background:#fee2e2;color:#991b1b;border-radius:8px;">โหลดส่วนแนะนำไม่สำเร็จ (${e.message})</div>`;
      if (empty) empty.style.display = 'none';
    }
  }

  const ALL = { page: 1, size: 10, sort: 'eventId', dir: 'desc', totalPages: 1 };

  function renderPager(page) {
    const wrap = $('#homePagerAll');
    if (!wrap) return;

    const total = page.totalPages ?? page.total_pages ?? 1;
    ALL.totalPages = total;

    const cur = ALL.page, tot = ALL.totalPages;
    wrap.innerHTML = `
      <i class="material-icons" id="HomePrev">keyboard_arrow_left</i>
      ${[...Array(tot)].map((_, i) => `
        <div class="page-dot" data-page="${i + 1}"
             style="display:inline-flex;width:36px;height:36px;border-radius:50%;
                    align-items:center;justify-content:center;
                    ${i + 1 === cur ? 'background:#eda81f;color:#fff;' : 'border:1px solid #e5e7eb;'}">
          ${i + 1}
        </div>`).join('')}
      <i class="material-icons" id="HomeNext">keyboard_arrow_right</i>
    `;

    $('#HomePrev')?.addEventListener('click', () => {
      if (ALL.page > 1) { ALL.page--; loadAll(); }
    });
    $('#HomeNext')?.addEventListener('click', () => {
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
      const items = page?.content ?? [];

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
      if (pager) pager.innerHTML = '';
      if (empty) empty.style.display = 'none';
    }
  }

  if (!window.toggleFilterDropdown) {
    window.toggleFilterDropdown = function () {
      const d = document.getElementById('filterDropdownList');
      const b = document.querySelector('.filter-dropdown-button');
      d?.classList.toggle('showFilter');
      b?.classList.toggle('activeFilter');
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadRecommend();
    loadAll();
  });
})();