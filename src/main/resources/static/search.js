// ========== search.js (shared utilities) ==========

// state เดิมของ EW (เผื่อหน้าอื่นใช้ในอนาคต)
const EW = {
  pageUI: 1,          // UI page (1-based)
  totalPages: 1,
  limit: 12,
  sort: 'eventId',
  dir: 'desc',
  categoryIds: [],    // e.g., [1,3]
  startDate: null,    // 'YYYY-MM-DD' (optional)
  endDate: null,      // 'YYYY-MM-DD' (optional)
  keyword: ''         // search keyword
};

// ---------- Helpers ----------
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));


// ใช้ปุ่ม bookmark กลางจาก FAV
const renderBookmark = (id) =>
  (window.FAV && typeof window.FAV.renderBookmarkButton === 'function')
    ? window.FAV.renderBookmarkButton(id)
    : '';


function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));
}

function fmtDate(d) {
  if (!d) return '-';
  const dt = new Date(d);
  return dt.toLocaleDateString('th-TH', { day:'2-digit', month:'short', year:'numeric' });
}

// ---------- Build Query & Fetch (ใช้ได้ถ้าหน้าไหนอยากใช้ EW) ----------
function buildEndpointAndParams() {
  const haveCats   = EW.categoryIds && EW.categoryIds.length > 0;
  const haveSearch = EW.keyword && EW.keyword.trim();
  const haveRange  = EW.startDate || EW.endDate;

  const p = new URLSearchParams();
  p.set('page', String(EW.pageUI - 1));        // Spring 0-based
  p.set('size', String(EW.limit));
  p.set('sort', `${EW.sort},${EW.dir}`);       // eventId,desc

  if (haveCats)   p.set('categories', EW.categoryIds.join(','));
  if (haveSearch) p.set('keyword', EW.keyword.trim());   // <-- ชื่อ param ที่ backend ใช้
  if (EW.startDate) p.set('start', EW.startDate);
  if (EW.endDate)   p.set('end',   EW.endDate);

  const endpoint = (haveCats || haveSearch || haveRange)
    ? '/api/events/filter'
    : '/api/events';

  return { endpoint, params: p.toString() };
}

async function fetchEvents() {
  const { endpoint, params } = buildEndpointAndParams();
  const res = await fetch(`${endpoint}?${params}`, {
    headers: { 'Accept':'application/json' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // Page<Event>
}

// ---------- Rendering (ถ้าหน้าไหนใช้ EW grid) ----------
function buildCard(ev) {
  const start = fmtDate(ev.startDate), end = fmtDate(ev.endDate);
  const img = ev.imageUrl || ev.imageURL || ev.image || 'Resourse/Poster/image 14.png';
  const time = ev.time ?? '-';
  const title = ev.title ?? '(ไม่มีชื่อกิจกรรม)';
  const place = ev.location ?? '-';
  const cap = ev.capacity ?? '-';
  const id = ev.eventId ?? ev.id ?? '';

  return `
    <div class="search-page-group" data-event-id="${id}">
      ${renderBookmark(id)}
      <a href="event-detail.html?id=${id}">
        <img src="${img}" alt="Poster" class="search-page-Poster" />
        <span class="search-page-date">${start} - ${end}</span>
        <div class="search-page-time">
          <img src="Resourse/icon/clock.png" alt="clock" class="clock" />
          <span class="search-page-clock">${time}</span>
        </div>
        <span class="search-page-name">${escapeHtml(title)}</span>
        <div class="search-page-place">
          <img src="Resourse/icon/pin.png" alt="pin" class="pin" />
          <span class="search-page-pin">${escapeHtml(place)}</span>
        </div>
        <div class="search-page-capacity" style="margin-top:6px;color:#374151;font-size:.92rem;">
          จำนวนคน: ${cap}
        </div>
        <button class="register-btn">ลงทะเบียน</button>
      </a>
    </div>
  `;
}

function renderGrid(page) {
  const grid = $('#eventsGrid');
  if (!grid) return;
  const items = page?.content || [];
  if (!items.length) {
    const q = EW.keyword ? `สำหรับคำค้น "${escapeHtml(EW.keyword)}"` : '';
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#6b7280">ไม่พบกิจกรรม ${q}</div>`;
    return;
  }
  grid.innerHTML = items.map(buildCard).join('');
}

function renderPager(page) {
  const pager = $('#eventsPager');
  if (!pager) return;
  EW.totalPages = page.totalPages ?? 1;
  const cur = EW.pageUI, tot = EW.totalPages;

  const nums = [];
  const start = Math.max(1, cur - 1), end = Math.min(tot, cur + 1);
  for (let i = start; i <= end; i++) {
    nums.push(`
      <div class="page-dot" data-page="${i}"
           style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;
                  ${i===cur ? 'background:#111827;color:#fff;' : 'border:1px solid #e5e7eb;'}">${i}</div>
    `);
  }

  pager.innerHTML = `
    <i class="material-icons" id="EWPrev" role="button">keyboard_arrow_left</i>
    ${nums.join('')}
    <i class="material-icons" id="EWNext" role="button">keyboard_arrow_right</i>
  `;

  $('#EWPrev')?.addEventListener('click', () => {
    if (EW.pageUI > 1) { EW.pageUI--; load(); }
  });
  $('#EWNext')?.addEventListener('click', () => {
    if (EW.pageUI < EW.totalPages) { EW.pageUI++; load(); }
  });
  $$('#eventsPager .page-dot').forEach(el => {
    el.addEventListener('click', () => {
      const p = Number(el.dataset.page);
      if (p && p !== EW.pageUI) { EW.pageUI = p; load(); }
    });
  });
}

async function load() {
  const grid = $('#eventsGrid');
  const pager = $('#eventsPager');
  if (grid) grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#6b7280">กำลังโหลด…</div>`;
  if (pager) pager.innerHTML = '';

  try {
    const page = await fetchEvents();
    renderGrid(page);
    renderPager(page);
  } catch (e) {
    console.error(e);
    if (grid) grid.innerHTML =
      `<div style="grid-column:1/-1;padding:12px;border:1px solid #fecaca;background:#fee2e2;color:#991b1b;border-radius:8px;">
        เกิดข้อผิดพลาดในการดึงข้อมูล (${e.message})
       </div>`;
  }
}

// ---------- Dropdown: FILTER (ช่วงวันที่) ----------
window.toggleFilterDropdown = function () {
  const dropdown = $('#filterDropdownList');
  const button = $('.filter-dropdown-button');
  dropdown?.classList.toggle('showFilter');
  button?.classList.toggle('activeFilter');
};

window.selectFilter = (event, option) => {
  const dropdown   = $('#filterDropdownList');
  const button     = $('.filter-dropdown-button');
  const textEl     = $('.filter-dropdown-text');
  const datePicker = $('.date-picker-container');
  const status     = document.getElementById('dateStatus');

  if (textEl) textEl.textContent = option;
  dropdown?.classList.remove('showFilter');
  button?.classList.remove('activeFilter');

  const isIndex   = !!document.getElementById('homeGridAll');
  const useIndex  = isIndex && window.ALL && typeof window.loadAll === 'function';
  const isSearch  = !!document.getElementById('resultList');
  const useSearch = isSearch && window.SEARCH_STATE && typeof window.searchLoad === 'function';

  // "กำหนดเอง" → แค่เปิด date picker
  if (option === 'กำหนดเอง') {
    datePicker?.classList.add('show');
    if (status) status.textContent = '';
    return;
  }
  datePicker?.classList.remove('show');

  const today = new Date();
  const toIso = d => d.toISOString().slice(0, 10);

  let start = null;
  let end   = null;

  if (option === 'วันนี้') {
    start = end = toIso(today);
  } else if (option === 'สัปดาห์นี้') {
    const day = today.getDay();
    const monday = new Date(today);
    const diff = (day === 0 ? -6 : 1 - day);
    monday.setDate(today.getDate() + diff);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    start = toIso(monday);
    end   = toIso(sunday);
  } else if (option === 'เดือนนี้') {
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    const last  = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    start = toIso(first);
    end   = toIso(last);
  } else {
    // "ทั้งหมด"
    start = null;
    end   = null;
  }

  // sync ลง input date
  const sInput = document.getElementById('ew-start-date');
  const eInput = document.getElementById('ew-end-date');
  const mode   = document.getElementById('rangeMode');

  if (sInput) sInput.value = start || '';
  if (eInput) eInput.value = end   || '';
  if (mode) {
    if (option === 'วันนี้') mode.value = 'single';
    else if (option === 'สัปดาห์นี้' || option === 'เดือนนี้') mode.value = 'range';
  }

  // อัปเดต state แล้วเรียก backend
  if (useIndex) {
    ALL.startDate = start;
    ALL.endDate   = end;
    ALL.page = 1;
    window.loadAll();
  } else if (useSearch) {
    const S = window.SEARCH_STATE;
    S.startDate = start;
    S.endDate   = end;
    S.page = 1;
    window.searchLoad();
  } else {
    EW.startDate = start;
    EW.endDate   = end;
    EW.pageUI = 1;
    load();
  }

  if (status) {
    if (start && end) {
      status.textContent = `✔ ใช้ตัวกรอง: ${start} ถึง ${end}`;
      status.style.color = '#1B5E20';
    } else {
      status.textContent = '';
    }
  }
};

// ---------- Categories dropdown (ของเก่า ถ้าไม่ใช้จะไม่ error) ----------
window.togglecatagoriesDropdown = function () {
  const dropdown = $('#catagoriesDropdownList');
  const button = $('.catagories-dropdown-button');
  dropdown?.classList.toggle('showCatagory');
  button?.classList.toggle('activeCatagory');
};

window.selectcatagories = function (event, option) {
  event?.stopPropagation?.();

  const textEl = $('.catagories-dropdown-text');
  if (textEl) textEl.textContent = option;

  $('#catagoriesDropdownList')?.classList.remove('showCatagory');
  $('.catagories-dropdown-button')?.classList.remove('activeCatagory');

  const id = event?.target?.dataset?.id;
  EW.categoryIds = id ? [Number(id)] : [];
  EW.pageUI = 1;
  load();   // ใช้ EW path ถ้ามีหน้าไหนใช้ dropdown นี้จริง
};

// ---------- Click Outside: ปิด dropdown ----------
document.addEventListener('click', (ev) => {
  const fWrap = $('.filter-dropdown-wrapper');
  const cWrap = $('.catagories-dropdown-wrapper');
  if (!(fWrap && fWrap.contains(ev.target))) {
    $('#filterDropdownList')?.classList.remove('showFilter');
    $('.filter-dropdown-button')?.classList.remove('activeFilter');
  }
  if (!(cWrap && cWrap.contains(ev.target))) {
    $('#catagoriesDropdownList')?.classList.remove('showCatagory');
    $('.catagories-dropdown-button')?.classList.remove('activeCatagory');
  }
});

// ---------- DateRange: apply / clear ----------
function applyDateRange() {
  const modeSel = document.getElementById('rangeMode');
  const mode    = modeSel ? modeSel.value : 'single';

  const sDateInput = document.getElementById('ew-start-date');
  const eDateInput = document.getElementById('ew-end-date');
  const status     = document.getElementById('dateStatus');

  const sDate = (sDateInput?.value || '').trim();
  const eDate = (eDateInput?.value || '').trim();

  if (!sDate) {
    if (status) {
      status.textContent = '⚠ กรุณาเลือกวันที่เริ่มต้น';
      status.style.color = '#E64D4F';
    }
    return;
  }

  let start = sDate;
  let end   = sDate;

  if (mode === 'range') {
    if (!eDate) {
      if (status) {
        status.textContent = '⚠ กรุณาเลือกวันที่สิ้นสุด';
        status.style.color = '#E64D4F';
      }
      return;
    }
    if (eDate < sDate) {
      if (status) {
        status.textContent = '⚠ ช่วงวันที่ไม่ถูกต้อง (Start > End)';
        status.style.color = '#E64D4F';
      }
      return;
    }
    end = eDate;
  }

  const isIndex   = !!document.getElementById('homeGridAll');
  const useIndex  = isIndex && window.ALL && typeof window.loadAll === 'function';
  const isSearch  = !!document.getElementById('resultList');
  const useSearch = isSearch && window.SEARCH_STATE && typeof window.searchLoad === 'function';

  if (useIndex) {
    ALL.startDate = start;
    ALL.endDate   = end;
    ALL.page = 1;
    window.loadAll();
  } else if (useSearch) {
    const S = window.SEARCH_STATE;
    S.startDate = start;
    S.endDate   = end;
    S.page = 1;
    window.searchLoad();
  } else {
    EW.startDate = start;
    EW.endDate   = end;
    EW.pageUI = 1;
    load();
  }

  if (status) {
    status.textContent = `✔ ใช้ตัวกรอง: ${start} ถึง ${end}`;
    status.style.color = '#1B5E20';
  }
}

function clearDateRange() {
  const sDateInput = document.getElementById('ew-start-date');
  const eDateInput = document.getElementById('ew-end-date');
  const sTimeInput = document.getElementById('ew-start-time');
  const eTimeInput = document.getElementById('ew-end-time');
  const status     = document.getElementById('dateStatus');

  if (sDateInput) sDateInput.value = '';
  if (eDateInput) eDateInput.value = '';
  if (sTimeInput) sTimeInput.value = '';
  if (eTimeInput) eTimeInput.value = '';

  const isIndex   = !!document.getElementById('homeGridAll');
  const useIndex  = isIndex && window.ALL && typeof window.loadAll === 'function';
  const isSearch  = !!document.getElementById('resultList');
  const useSearch = isSearch && window.SEARCH_STATE && typeof window.searchLoad === 'function';

  if (useIndex) {
    ALL.startDate = null;
    ALL.endDate   = null;
    ALL.page = 1;
    window.loadAll();
  } else if (useSearch) {
    const S = window.SEARCH_STATE;
    S.startDate = null;
    S.endDate   = null;
    S.page = 1;
    window.searchLoad();
  } else {
    EW.startDate = null;
    EW.endDate   = null;
    EW.pageUI = 1;
    load();
  }

  if (status) {
    status.textContent = 'ล้างข้อมูลเรียบร้อย';
    status.style.color = '#444';
  }
}

// ---------- Enter ในช่อง ew-from / ew-to ----------
document.addEventListener('keydown', (e) => {
  const a = document.activeElement;
  if (e.key === 'Enter' && a && (a.id === 'ew-from' || a.id === 'ew-to')) {
    e.preventDefault();
    window.EWDate_onSubmit();
  }
});

// ---------- Global Search Bar ----------
document.addEventListener('DOMContentLoaded', async () => {
  const form =
    document.getElementById('globalSearch') ||
    document.querySelector('.search-page-searchbar');

  if (form) {
    form.addEventListener('submit', (e) => {
    const ipt =
      form.querySelector('input[name="q"]') ||
      form.querySelector('.search-input') ||
      form.querySelector('input[type="search"]');

    const q = (ipt?.value || '').trim();

    // กันค่าว่าง
    if (!q) {
      e.preventDefault();
      ipt?.focus();
      return;
    }

    // ถ้า form ไม่มี action → redirect ไป searchpage.html เอง
    if (!form.getAttribute('action')) {
      e.preventDefault();
      const url = new URL('/searchpage.html', location.origin);
      url.searchParams.set('q', q);
      url.searchParams.set('scroll', 'Content');
      location.href = url.toString();
      return;
    		}
 		});
	}
	 if (window.FAV && typeof window.FAV.loadFavorites === 'function') {
	    await window.FAV.loadFavorites();
	 }
	 if (window.FAV && typeof window.FAV.attachFavoriteClickHandler === 'function') {
	    window.FAV.attachFavoriteClickHandler(document);
	 }
});

// ปุ่มค้นหาที่หน้า searchpage (onclick="search()")
function search() {
  const ipt =
    document.querySelector('.search-page-searchbar input[name="q"]') ||
    document.querySelector('#globalSearch input[name="q"]') ||
    document.querySelector('.search-input');

  if (!ipt) return;
  const keyword = ipt.value.trim();
  if (!keyword) {
    ipt.focus();
    return;
  }
  // ไม่ต้อง redirect ที่นี่ ปล่อยให้ form submit ตามปกติ
}

// ---------- Pagination เดิม (ใช้เฉพาะหน้าเก่าที่มี .Poster) ----------
document.addEventListener("DOMContentLoaded", () => {
  const posters = document.querySelectorAll(".Poster .search-page-group");
  const prevBtn = document.getElementById("Previous");
  const nextBtn = document.getElementById("Next");
  const pageContainer = document.getElementById("pageNumbers");
  const pageInfo = document.getElementById("pageInfo");

  // ถ้า element ไม่ครบ แปลว่าไม่ได้ใช้ pagination แบบนี้ → ไม่ต้องทำอะไร
  if (!posters.length || !prevBtn || !nextBtn || !pageContainer || !pageInfo) return;

  const itemsPerPage = 10;
  const totalPages = Math.ceil(posters.length / itemsPerPage);
  let currentPage = 1;

  function renderPageButtons() {
    pageContainer.innerHTML = "";
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + 2);

    if (end - start < 2) {
      start = Math.max(1, end - 2);
    }
    for (let i = start; i <= end; i++) {
      const num = document.createElement("div");
      num.classList.add("page-number");
      num.textContent = i;
      if (i === currentPage) num.classList.add("active");
      num.addEventListener("click", () => {
        currentPage = i;
        showPage(currentPage);
      });
      pageContainer.appendChild(num);
    }
  }

  function showPage(page) {
    posters.forEach((poster, i) => {
      poster.style.display = (i >= (page - 1) * itemsPerPage && i < page * itemsPerPage)
        ? "block"
        : "none";
    });
    renderPageButtons();
    pageInfo.textContent = `หน้า ${page} จาก ${totalPages}`;

    prevBtn.style.visibility = (page === 1) ? "hidden" : "visible";
    nextBtn.style.visibility = (page === totalPages) ? "hidden" : "visible";
  }

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      showPage(currentPage);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      showPage(currentPage);
    }
  });

  showPage(currentPage);
});

// ---------- highlight ผลลัพธ์บน searchpage ----------
function highlightKeyword(keyword) {
  if (!keyword) return;
  const results = document.querySelectorAll('#resultList .search-page-group');
  results.forEach(item => {
    const title = item.querySelector('.search-page-name');
    if (!title) return;
    const originalText = title.textContent;
    const regex = new RegExp(`(${keyword})`, 'gi');
    const highlighted = originalText.replace(regex, '<span class="highlight">$1</span>');
    title.innerHTML = highlighted;
  });
}

function goToContent() {
  const content = document.getElementById('Content');
  if (content) content.scrollIntoView({ behavior: 'smooth' });
}

// auto-highlight ถ้ามี ?q=
window.addEventListener('load', () => {
  const urlQ = new URL(location.href).searchParams.get('q');
  if (!urlQ) return;
  const ipt =
    document.querySelector('input[name="q"]') ||
    document.querySelector('.search-input');
  if (ipt) ipt.value = urlQ;
  highlightKeyword(urlQ);
});
