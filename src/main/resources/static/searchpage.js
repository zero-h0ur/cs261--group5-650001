// searchpage.js
// ค้นหาอีเวนต์ผ่าน /api/events?search=... + เพจจิเนชัน
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
    totalPages: 1
  };

  // ---------- API ----------
  async function fetchPage() {
    const u = new URL('/api/events', location.origin);
    if (STATE.keyword) u.searchParams.set('search', STATE.keyword);
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
  function showEmpty(msg = 'ไม่พบกิจกรรมที่ตรงกับคำค้นหา') {
    const list  = $('#resultList');
    const empty = $('#emptyState');
    if (list)  list.innerHTML = '';
    if (empty) { empty.textContent = msg; empty.style.display = 'block'; }
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
      <i class="material-icons" data-act="prev">keyboard_arrow_left</i>
      ${Array.from({length: tot}).map((_,i)=>`
        <div class="page-dot ${i+1===cur?'active':''}" data-p="${i+1}"
             style="display:inline-flex;width:36px;height:36px;border-radius:50%;
             align-items:center;justify-content:center;${i+1===cur?'background:#111827;color:#fff;':'border:1px solid #e5e7eb;'}">
          ${i+1}
        </div>
      `).join('')}
      <i class="material-icons" data-act="next">keyboard_arrow_right</i>
    `;

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
    if (!STATE.keyword) { showEmpty('พิมพ์คำค้นหาในช่องด้านบน'); return; }

    hideEmpty();
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
    } catch (e) {
      console.error(e);
      showEmpty('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  }

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

    load();
  });
})();
