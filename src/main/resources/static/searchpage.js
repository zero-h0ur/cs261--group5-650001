// searchpage.js
// ใช้สำหรับหน้า searchpage.html เท่านั้น
// ทำงาน: keyword + category + date + pagination + highlight

(() => {
  'use strict';

  // ---------- Helpers ----------
  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[ch]));
  }

  function fmtDate(d) {
    if (!d) return '-';
    const dt = new Date(d);
    if (isNaN(dt)) return '-';
    return dt.toLocaleDateString('th-TH', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  // ---------- STATE ----------
  const STATE = {
    keyword: '',
    page: 1,           // 1-based
    size: 10,          // การ์ดต่อหน้า
    sort: 'eventId',
    dir:  'desc',
    totalPages: 1,
    categoryIds: [],   // [1,3,...]
    startDate: null,   // 'YYYY-MM-DD'
    endDate:   null
  };

  // ให้ไฟล์อื่น (category-filter, search.js) เรียกใช้ได้
  window.SEARCH_STATE = STATE;

  // ---------- สร้างการ์ด ----------
  const pick = (...xs) => xs.find(v => v !== undefined && v !== null && v !== '');

  // card ใช้โครงเดียวกับหน้า index เพื่อให้ data / รูป / วันที่เหมือนกัน
  function buildCard(ev) {
    // id
    const id = pick(ev.eventId, ev.id, ev.event_id, '');

    // title
    const title = pick(ev.title, ev.eventTitle, ev.name, '(ไม่มีชื่อกิจกรรม)');

    // รูปโปสเตอร์
    const img = pick(
      ev.imageUrl,
      ev.imageURL,
      ev.image_url,
      ev.imagePath,
      ev.image,
      'Resourse/Poster/image 14.png'
    );

    // start / end date รองรับทั้ง startDate, dateStart ฯลฯ
    const startRaw = pick(
      ev.startDate,
      ev.start_date,
      ev.dateStart,
      ev.eventStartDate,
      ev.start
    );
    const endRaw = pick(
      ev.endDate,
      ev.end_date,
      ev.dateEnd,
      ev.eventEndDate,
      ev.end
    );

    const startText = fmtDate(startRaw);  // ใช้ fmtDate / fmtTH ตัวเดียวกับ index
    const endText   = fmtDate(endRaw);

    const dateText =
      (startRaw && endRaw)
        ? `${startText} - ${endText}`
        : startText;

    // time
    const timeText = pick(ev.time, ev.startTime, ev.start_time, '-');

    // สถานที่
    const loc = pick(ev.location, ev.place, ev.venue, '-');

    return `
      <div class="search-page-group">
        <a href="event-detail.html?id=${encodeURIComponent(String(id))}">
          <img src="${img}" alt="${escapeHtml(title)}"
               class="search-page-Poster"
               onerror="this.src='Resourse/Poster/image 14.png'"/>
          <div class="bookmark-btn"><img src="Resourse/icon/fav-button.png" class="bookmark-icon"></div>
          <span class="search-page-date">${dateText}</span>

          <div class="search-page-time">
            <img src="Resourse/icon/clock.png" alt="clock" class="clock"/>
            <span class="search-page-clock">${timeText}</span>
          </div>

          <span class="search-page-name">${title}</span>

          <div class="search-page-place">
            <img src="Resourse/icon/pin.png" alt="pin" class="pin"/>
            <span class="search-page-pin">${loc}</span>
          </div>

          <button class="register-btn">ลงทะเบียน</button>
        </a>
      </div>
    `;
  }

  // ---------- เรียก API ----------
  async function fetchPage() {
    const haveCats   = Array.isArray(STATE.categoryIds) && STATE.categoryIds.length > 0;
    const haveSearch = !!(STATE.keyword && STATE.keyword.trim());
    const haveRange  = !!(STATE.startDate || STATE.endDate);

    const p = new URLSearchParams();
    p.set('page', String(STATE.page - 1));          // Spring 0-based
    p.set('size', String(STATE.size));
    p.set('sort', 'eventId,desc');

    if (haveCats)   p.set('categories', STATE.categoryIds.join(','));
    if (haveSearch) p.set('keyword', STATE.keyword.trim());
    if (STATE.startDate) p.set('start', STATE.startDate);
    if (STATE.endDate)   p.set('end',   STATE.endDate);

    const endpoint = (haveCats || haveSearch || haveRange)
      ? '/api/events/filter'
      : '/api/events';

    const url = `${endpoint}?${p.toString()}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();       // Spring Page<Event> หรือ Array<Event>
  }

  // ---------- Empty / Error ----------
  function showEmpty(msg = 'ไม่พบกิจกรรมที่ต้องการ ') {
    const list  = $('#resultList');
    const empty = $('#emptyState');
    if (list) list.innerHTML = '';

    if (empty) {
      empty.innerHTML = `
        <div style="text-align:center; padding:40px 0;">
          <img src="Resourse/icon/Icon_Search.png" alt="empty" style="width:80px; opacity:0.5;">
          <p style="margin-top:10px; font-family:Pridi; font-size:24px; color:#000000; opacity:0.5;">
            ${msg}
          </p>
        </div>`;
      empty.style.display = 'block';
    }
    const pager = $('#searchPager');
    if (pager) pager.innerHTML = '';
    const info = $('#searchPageInfo');
    if (info) info.textContent = '';
  }

  function hideEmpty() {
    const empty = $('#emptyState');
    if (empty) empty.style.display = 'none';
  }

  // ---------- Pagination ----------
  function renderPager() {
    const wrap = $('#searchPager');
    const info = $('#searchPageInfo');
    if (!wrap) return;

    const cur = STATE.page;
    const tot = Math.max(1, STATE.totalPages || 1);

    if (info) info.textContent = `หน้า ${cur} จาก ${tot}`;
    if (tot <= 1) { wrap.innerHTML = ''; return; }

    wrap.innerHTML = `
      <div class="pagenumber"
           style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;">
        <i class="material-icons" id="SearchPrev" data-act="prev" style="cursor:pointer">
          keyboard_arrow_left
        </i>
        ${Array.from({ length: tot }).map((_, i) => `
          <div class="page-dot ${i + 1 === cur ? 'active' : ''}" data-p="${i + 1}"
               style="
                 display:flex;align-items:center;justify-content:center;
                 width:${i + 1 === cur ? 35 : 30}px;
                 height:${i + 1 === cur ? 35 : 30}px;
                 border-radius:50%; margin:6px; transition:all .2s; cursor:pointer;
                 font-family:Pridi, sans-serif; font-size:16px; font-weight:600;
                 ${i + 1 === cur ? 'background:#F68121;color:#fff;' : 'background:#f8bb86;color:#000;'}
               ">
            ${i + 1}
          </div>
        `).join('')}
        <i class="material-icons" id="SearchNext" data-act="next" style="cursor:pointer">
          keyboard_arrow_right
        </i>
      </div>
    `;

    const prevBtn = $('#SearchPrev');
    const nextBtn = $('#SearchNext');
    if (prevBtn)  prevBtn.style.visibility = (STATE.page === 1) ? 'hidden' : 'visible';
    if (nextBtn)  nextBtn.style.visibility = (STATE.page === tot) ? 'hidden' : 'visible';

    wrap.querySelector('[data-act="prev"]')?.addEventListener('click', () => {
      if (STATE.page > 1) { STATE.page--; load(); }
    });
    wrap.querySelector('[data-act="next"]')?.addEventListener('click', () => {
      if (STATE.page < tot) { STATE.page++; load(); }
    });
    wrap.querySelectorAll('.page-dot').forEach(el => {
      el.addEventListener('click', () => {
        const p = +el.dataset.p;
        if (p && p !== STATE.page) { STATE.page = p; load(); }
      });
    });
  }

  // ---------- Loader ----------
  async function load() {
    const list = $('#resultList');
    if (!list) return;

    // ถ้าไม่มี keyword ให้แสดง "ทั้งหมด"
    if (!STATE.keyword) {
      const t2 = $('.search-page-text2');
      if (t2) t2.textContent = 'ทั้งหมด';
    }

    hideEmpty();

    list.innerHTML = `
      <div style="grid-column:1/-1;display:flex;flex-direction:column;
                  align-items:center;gap:8px;color:#6b7280">
        <div class="ew-spin" style="
          width:36px;height:36px;border-radius:50%;
          border:4px solid #e5e7eb;border-top-color:#111827;
          animation:ew-rot 0.9s linear infinite"></div>
        <div>กำลังโหลด…</div>
      </div>
      <style>@keyframes ew-rot { to { transform: rotate(360deg); } }</style>
    `;
    const pager = $('#searchPager');
    if (pager) pager.innerHTML = '';
    const info = $('#searchPageInfo');
    if (info) info.textContent = '';

    try {
      const page = await fetchPage();
      const items = Array.isArray(page) ? page : (page.content ?? []);
      STATE.totalPages = page.totalPages ?? page.total_pages ?? 1;

      if (!items.length) { showEmpty(); return; }

      list.innerHTML = items.map(buildCard).join('');
      renderPager();

      // highlight คำค้นหลังโหลดเสร็จ
      if (typeof highlightKeyword === 'function' && STATE.keyword) {
        highlightKeyword(STATE.keyword);
      }
    } catch (e) {
      console.error(e);
      showEmpty('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  }

  // ---------- resetSearch (ใช้ในปุ่ม ล้าง) ----------
  window.resetSearch = function () {
    const ipt = document.querySelector('#eventSearchInput,.search-input,input[type="search"]');
    if (ipt) ipt.value = '';

    try {
      document.getElementById('ew-start-date').value = '';
      document.getElementById('ew-start-time').value = '';
      document.getElementById('ew-end-date').value   = '';
      document.getElementById('ew-end-time').value   = '';
      const st = document.getElementById('dateStatus');
      if (st) { st.textContent = ''; st.removeAttribute('style'); }
    } catch {}

    const url = new URL(location.origin + '/searchpage.html');
    location.href = url.toString();
  };

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', () => {
    // อ่าน q จาก URL
    const params = new URLSearchParams(location.search);
    STATE.keyword = (params.get('q') || '').trim();

    // sync into input
    const ipt = document.querySelector('#eventSearchInput,.search-input,input[type="search"]');
    if (ipt) ipt.value = STATE.keyword;

    // กัน submit ว่าง ๆ
    const form = document.querySelector('.search-page-searchbar, form.searchbar, form#globalSearch');
    form?.addEventListener('submit', (e) => {
      const v = (form.querySelector('.search-input,input[type="search"]')?.value || '').trim();
      if (!v) {
        e.preventDefault();
        form.querySelector('.search-input,input[type="search"]')?.focus();
      }
    });

    // ส่งฟังก์ชันให้ไฟล์อื่นใช้
    window.SEARCH_STATE = STATE;
    window.searchLoad   = load;

    // โหลดครั้งแรก
    load();
  });
    document.addEventListener('click', e => {
  const btn = e.target.closest('.bookmark-btn');
  if (!btn) return;

  e.preventDefault();
  const icon = btn.querySelector('.bookmark-icon');
  const isActive = btn.classList.toggle('active');

  // เปลี่ยนรูปภาพตอนคลิก
  icon.src = isActive
    ? 'Resourse/icon/fav-button-active.png'
    : 'Resourse/icon/fav-button.png';
  });
})();
