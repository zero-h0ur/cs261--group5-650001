// searchpage.js
// ค้นหาอีเวนต์ผ่าน /api/events?search=... + เพจจิเนชัน

const STATE = {
  keyword: '',
  page: 1,
  size: 10,
  sort: 'eventId',
  dir: 'desc',
  totalPages: 1,
  categoryIds: [],
  startDate: null,
  endDate: null
};

(() => {
  'use strict';

  // ---------- helpers ----------
  const $ = (s) => document.querySelector(s);
  const pick = (o, ...keys) => { for (const k of keys) if (o && o[k] != null) return o[k]; };

  const fmtTH = (d) => {
    if (!d) return '-';
    const iso = /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00` : d;
    const dt = new Date(iso);
    if (isNaN(dt)) return '-';
    return dt.toLocaleDateString('th-TH', { day:'2-digit', month:'short', year:'numeric' });
  };

  const card = (ev) => {
    const id    = pick(ev, 'eventId', 'id', 'event_id');
    const title = pick(ev, 'title') ?? '(ไม่มีชื่อกิจกรรม)';
    const img   = pick(ev, 'imageUrl', 'imageURL', 'image_url') || 'Resourse/Poster/image 14.png';
    const start = pick(ev, 'startDate', 'start_date');
    const end   = pick(ev, 'endDate',   'end_date');
    const time  = pick(ev, 'time');
    const loc   = pick(ev, 'location');
    const dateText = start && end ? `${fmtTH(start)} - ${fmtTH(end)}` : fmtTH(start);

    return `
      <div class="search-page-group">
        <a href="event-detail.html?id=${encodeURIComponent(id ?? '')}">
          <img src="${img}" alt="${title}" class="search-page-Poster"
               onerror="this.src='Resourse/Poster/image 14.png'"/>
          <span class="search-page-date">${dateText}</span>
          <div class="search-page-time">
            <img src="Resourse/icon/clock.png" alt="clock" class="clock"/>
            <span class="search-page-clock">${time ?? '-'}</span>
          </div>
          <span class="search-page-name">${title}</span>
          <div class="search-page-place">
            <img src="Resourse/icon/pin.png" alt="pin" class="pin"/>
            <span class="search-page-pin">${loc ?? '-'}</span>
          </div>
          <button class="register-btn">ลงทะเบียน</button>
        </a>
      </div>
    `;
  };

  // ---------- state ----------
  const STATE = {
    keyword: '',
    page: 1,           // 1-based บน UI
    size: 10,          // จำนวนการ์ดต่อหน้า
    sort: 'eventId',
    dir:  'desc',
	totalPages: 1,
	categoryIds: []
  };

  // ---------- API ----------
  async function fetchPage() {
    const u = new URL('/api/events', location.origin);
    if (STATE.keyword) u.searchParams.set('search', STATE.keyword.trim().toLowerCase());
	
	if (Array.isArray(STATE.categoryIds) && STATE.categoryIds.length > 0) {
	  const csv = STATE.categoryIds.join(',');
	  ['categories', 'categoryIds', 'category', 'category_id'].forEach(k => {
	    u.searchParams.set(k, csv);
	  });
	}
    u.searchParams.set('page', String(STATE.page - 1)); // Spring 0-based
    // รองรับทั้ง size (Spring default) และ limit (ถ้าทีมใช้)
    u.searchParams.set('size',  String(STATE.size));
    u.searchParams.set('limit', String(STATE.size));
    u.searchParams.set('sort',  STATE.sort);
    u.searchParams.set('dir',   STATE.dir);

    const res = await fetch(u.toString(), { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  // ---------- render ----------
  function showEmpty(msg = 'ไม่พบกิจกรรมที่ต้องการ ') {
    const list  = $('#resultList');
    const empty = $('#emptyState');
    if (list)  list.innerHTML = '';
    if (empty) {
    empty.innerHTML = `
      <div style="text-align:center; padding:40px 0;">
        <img src="Resourse/icon/Icon_Search.png" alt="empty" style="width:80px; opacity:0.5;">
        <p style="margin-top:10px; font-family:Pridi; font-size:24px; color:#000000; opacity:0.5;">${msg}</p>
      </div>
    `;
    empty.style.display = 'block';
  }
    if ($('#searchPager'))    $('#searchPager').innerHTML = '';
    if ($('#searchPageInfo')) $('#searchPageInfo').textContent = '';
  }

  function hideEmpty() {
    const empty = $('#emptyState');
    if (empty) empty.style.display = 'none';
  }

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
      <i class="material-icons" id="SearchPrev" data-act="prev" style="cursor:pointer">keyboard_arrow_left</i>
      ${Array.from({length: tot}).map((_,i)=>`
        <div class="page-dot ${i+1===cur?'active':''}" data-p="${i+1}"
             style="
                 display:flex;align-items:center;justify-content:center;
                 width:${i + 1 === cur ? 35 : 30}px;height:${i + 1 === cur ? 35 : 30}px;
                 border-radius:50%; margin:6px; transition:all .2s; cursor:pointer;
                 font-family:Pridi, sans-serif; font-size:16px; font-weight:600;
                 ${i + 1 === cur ? 'background:#F68121;color:#fff;' : 'background:#f8bb86;color:#000;'}
               ">
          ${i+1}
        </div>
      `).join('')}
      <i class="material-icons" id="SearchNext" data-act="next" style="cursor:pointer">keyboard_arrow_right</i>
    `;
    const prevBtn = $('#SearchPrev');
    const nextBtn = $('#SearchNext');
    if (prevBtn)  prevBtn.style.visibility = (STATE.page === 1) ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.style.visibility = (STATE.page === tot) ? 'hidden' : 'visible';
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

  // ---------- main loader ----------
  async function load() {
    const list = $('#resultList');
    if (!list) return;
	  // ถ้าไม่มี keyword ให้แสดง "ทั้งหมด" (เหมือน index)
	  if (!STATE.keyword) {
	    const title2 = document.querySelector('.search-page-text2');
	    if (title2) title2.textContent = 'ทั้งหมด';
	  }	
	  hideEmpty();
	  // Loading spinner
	  list.innerHTML = `
	    <div style="grid-column:1/-1;display:flex;flex-direction:column;align-items:center;gap:8px;color:#6b7280">
	      <div class="ew-spin" style="width:36px;height:36px;border-radius:50%;
	           border:4px solid #e5e7eb;border-top-color:#111827;animation:ew-rot 0.9s linear infinite"></div>
	      <div>กำลังโหลด…</div>
	    </div>
	    <style>
	      @keyframes ew-rot { to { transform: rotate(360deg); } }
	    </style>
	  `;
    list.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#6b7280">กำลังโหลด…</div>`;
    $('#searchPager') && ($('#searchPager').innerHTML = '');
    $('#searchPageInfo') && ($('#searchPageInfo').textContent = '');

    try {
      const page = await fetchPage();
      const items = Array.isArray(page) ? page : (page.content ?? []);
      STATE.totalPages = page.totalPages ?? page.total_pages ?? 1;

      if (!items.length) { showEmpty(); return; }

      list.innerHTML = items.map(card).join('');
      renderPager();
	  if (typeof highlightKeyword === 'function' && STATE.keyword) {
	    highlightKeyword(STATE.keyword);
	  }
    } catch (e) {
      console.error(e);
      showEmpty('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  }
  
  // ให้ปุ่ม Clear ใช้รีเซ็ตทุกอย่างกลับไป "ทั้งหมด"
  window.resetSearch = function () {
    // ล้างช่องค้นหา (ถ้ามี)
    const ipt = document.querySelector('#eventSearchInput,.search-input,input[type="search"]');
    if (ipt) ipt.value = '';

    // ล้างช่วงวันที่ (ถ้าใช้ชุดของ search.js อยู่)
    try {
      document.getElementById('ew-start-date').value = '';
      document.getElementById('ew-start-time').value = '';
      document.getElementById('ew-end-date').value = '';
      document.getElementById('ew-end-time').value = '';
      const st = document.getElementById('dateStatus');
      if (st) { st.textContent = ''; st.removeAttribute('style'); }
    } catch {}

    // กลับหน้าค้นหาแบบไม่มี q → backend คืน "ทั้งหมด"
    const url = new URL(location.origin + '/searchpage.html');
    location.href = url.toString();
  };

  // ---------- boot ----------
  document.addEventListener('DOMContentLoaded', () => {
    // อ่าน q จาก URL
    const params = new URLSearchParams(location.search);
    STATE.keyword = (params.get('q') || '').trim();

    // sync กลับไปในช่องค้นหา (ถ้ามี)
    const ipt = document.querySelector('#eventSearchInput,.search-input,input[type="search"]');
    if (ipt) ipt.value = STATE.keyword;

    // กัน submit ว่าง ๆ
    const form = document.querySelector('.search-page-searchbar, form.searchbar, form#globalSearch');
    form?.addEventListener('submit', (e) => {
      const v = (form.querySelector('.search-input,input[type="search"]')?.value || '').trim();
      if (!v) { e.preventDefault(); form.querySelector('.search-input,input[type="search"]')?.focus(); }
    });
	window.SEARCH_STATE = STATE;
	window.searchLoad = load;
	
    load();
  });
})();
