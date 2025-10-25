//search.js (updated)

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

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function fmtDate(d) {
  if (!d) return '-';
  const dt = new Date(d);
  return dt.toLocaleDateString('th-TH', { day:'2-digit', month:'short', year:'numeric' });
}

// ---------- Build Query & Fetch ----------
function buildEndpointAndParams() {
  const haveCats   = EW.categoryIds && EW.categoryIds.length > 0;
  const haveSearch = EW.keyword && EW.keyword.trim();
  const haveRange  = EW.startDate || EW.endDate;

  const p = new URLSearchParams();
  // ใช้ Pageable มาตรฐาน
  p.set('page', String(EW.pageUI - 1));
  p.set('size', String(EW.limit));
  p.set('sort', `${EW.sort},${EW.dir}`);

  if (haveCats)   p.set('categories', EW.categoryIds.join(','));
  if (haveSearch) p.set('search', EW.keyword.trim());
  if (EW.startDate) p.set('start', EW.startDate); // ถ้า backend ใช้ชื่ออื่น ปรับให้ตรง
  if (EW.endDate)   p.set('end',   EW.endDate);

  // ถ้ามีตัวกรองใด ๆ → ใช้ /filter (รองรับ compose)
  const endpoint = (haveCats || haveSearch || haveRange) ? '/api/events/filter' : '/api/events';
  return { endpoint, params: p.toString() };
}

async function fetchEvents() {
  const { endpoint, params } = buildEndpointAndParams();
  const res = await fetch(`${endpoint}?${params}`, { headers: { 'Accept':'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // Page<Event>
}

// ---------- Rendering ----------
function buildCard(ev) {
  const start = fmtDate(ev.startDate), end = fmtDate(ev.endDate);
  const img = ev.imageUrl || ev.imageURL || ev.image || 'Resourse/Poster/image 14.png';
  const time = ev.time ?? '-';
  const title = ev.title ?? '(ไม่มีชื่อกิจกรรม)';
  const place = ev.location ?? '-';
  const cap = ev.capacity ?? '-';
  const id = ev.eventId ?? ev.id ?? '';

  return `
    <div class="search-page-group">
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

  $('#EWPrev').onclick = () => { if (EW.pageUI > 1) { EW.pageUI--; load(); } };
  $('#EWNext').onclick = () => { if (EW.pageUI < EW.totalPages) { EW.pageUI++; load(); } };
  $$('#eventsPager .page-dot').forEach(el => el.onclick = () => {
    const p = Number(el.dataset.page);
    if (p && p !== EW.pageUI) { EW.pageUI = p; load(); }
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

// ---------- Dropdown: FILTER ----------
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

  if (textEl) textEl.textContent = option;
  dropdown?.classList.remove('showFilter');
  button?.classList.remove('activeFilter');

  if (option === 'กำหนดเอง') {
    datePicker?.classList.add('show');
    datePicker?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // ยังไม่ยิง API จนกว่าจะกดตกลงใน date picker
  } else {
    datePicker?.classList.remove('show');
    // ตัวอย่าง preset (วันนี้/สัปดาห์นี้/เดือนนี้) — ปรับตามที่ต้องการ
    const today = new Date();
    if (option === 'วันนี้') {
      const s = today.toISOString().slice(0,10);
      EW.startDate = s; EW.endDate = s;
    } else if (option === 'สัปดาห์นี้') {
      const first = new Date(today); first.setDate(today.getDate()-today.getDay()+1);
      const last  = new Date(first); last.setDate(first.getDate()+6);
      EW.startDate = first.toISOString().slice(0,10);
      EW.endDate   = last.toISOString().slice(0,10);
    } else if (option === 'เดือนนี้') {
      const a = new Date(today.getFullYear(), today.getMonth(), 1);
      const b = new Date(today.getFullYear(), today.getMonth()+1, 0);
      EW.startDate = a.toISOString().slice(0,10);
      EW.endDate   = b.toISOString().slice(0,10);
    } else {
      EW.startDate = null; EW.endDate = null;
    }
    EW.pageUI = 1; load();
  }
};

// ---------- Dropdown: CATEGORIES (สะกดเดิม) ----------
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

  // อ่าน id จาก data-id (เช่น <li data-id="2" ...>)
  const id = event?.target?.dataset?.id;
  EW.categoryIds = id ? [Number(id)] : [];
  EW.pageUI = 1; load();
};

// ---------- Click Outside: ปิดทั้งสอง dropdown ----------
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

// ---------- Scroll target (optional) ----------
window.addEventListener('load', () => {
  const params = new URLSearchParams(location.search);
  const scrollTarget = params.get('scroll');
  if (scrollTarget) document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth' });
});

// ---------- Date Picker Submit (กำหนดเอง) ----------
window.EWDate_onSubmit = function () {
  const from = $('#ew-from')?.value.trim() || '';
  const to   = $('#ew-to')?.value.trim()   || '';
  if (!from && !to) { alert('กรุณาใส่วันที่ตั้งแต่หรือถึงอย่างน้อยหนึ่งค่า'); return; }
  EW.startDate = from || null;
  EW.endDate   = to   || null;
  EW.pageUI = 1;
  load();
};

// ---------- Enhanced DateTime Picker ----------
function formatDateTimeLocal(dateStr, timeStr) {
  if (!dateStr) return null;
  const date = new Date(`${dateStr}T${timeStr || '00:00'}`);
  return date.toISOString().slice(0,16); // YYYY-MM-DDTHH:mm
}

function applyDateRange() {
  const mode = document.getElementById('rangeMode').value;
  const sDate = document.getElementById('ew-start-date').value;
  const sTime = document.getElementById('ew-start-time').value;
  const eDate = document.getElementById('ew-end-date').value;
  const eTime = document.getElementById('ew-end-time').value;
  const status = document.getElementById('dateStatus');

  if (!sDate) {
    status.textContent = '⚠ กรุณาเลือกวันที่เริ่มต้น';
    status.style.color = '#E64D4F';
    return;
  }

  let start = new Date(`${sDate}T${sTime || '00:00'}`);
  let end   = mode === 'single' ? start : new Date(`${eDate}T${eTime || '23:59'}`);

  if (mode === 'range' && (!eDate || start > end)) {
    status.textContent = '⚠ ช่วงเวลาไม่ถูกต้อง (Start > End)';
    status.style.color = '#E64D4F';
    return;
  }

  // Update state
  EW.startDate = start.toISOString().slice(0,10);
  EW.endDate   = mode === 'range' ? end.toISOString().slice(0,10) : EW.startDate;
  EW.pageUI = 1;
  load();

  status.textContent = `✔ ใช้ตัวกรอง: ${EW.startDate} ถึง ${EW.endDate}`;
  status.style.color = '#1B5E20';
}

function clearDateRange() {
  document.getElementById('ew-start-date').value = '';
  document.getElementById('ew-start-time').value = '';
  document.getElementById('ew-end-date').value = '';
  document.getElementById('ew-end-time').value = '';
  document.getElementById('dateStatus').textContent = 'ล้างข้อมูลเรียบร้อย';
  document.getElementById('dateStatus').style.color = '#444';
  EW.startDate = null;
  EW.endDate = null;
  load();
}
// ---------- Enhanced DateTime Picker ----------

// Enter ในช่องวันที่ให้ trigger submit
document.addEventListener('keydown', (e) => {
  const a = document.activeElement;
  if (e.key === 'Enter' && a && (a.id === 'ew-from' || a.id === 'ew-to')) {
    e.preventDefault(); window.EWDate_onSubmit();
  }
});

// ---------- Search Bar ที่แก้ไข ----------
document.addEventListener('DOMContentLoaded', () => {
  // หา form ค้นหาที่มีอยู่ (อย่างน้อยอันใดอันหนึ่ง)
  const form =
    document.getElementById('globalSearch') ||                // ถ้าตั้ง id ให้ฟอร์มบน navbar
    document.querySelector('.search-page-searchbar');          // ฟอร์มบนหน้า search

  if (!form) return;

  form.addEventListener('submit', (e) => {
    const ipt = form.querySelector('input[name="q"]') || form.querySelector('.search-input');
    const q = (ipt?.value || '').trim();

    // กันค่าว่าง
    if (!q) {
      e.preventDefault();
      ipt?.focus();
      return;
    }

    // ถ้าเป็นฟอร์มบน navbar ที่ไม่ได้ตั้ง action ให้ redirect ไปหน้า search พร้อม q
    if (!form.getAttribute('action')) {
      e.preventDefault();
      const url = new URL('/searchpage.html', location.origin);
      url.searchParams.set('q', q);
      location.href = url.toString();
	  return;
    }
    // ถ้าฟอร์มมี action อยู่แล้ว (เช่น หน้า search ตั้ง action="searchpage.html") ปล่อยให้ submit ตามปกติ
  });
});

const ids = EW.categoryIds;               // [1,3]
const params = new URLSearchParams();
if (ids.length) params.set('categories', ids.join(','));
if (EW.keyword) params.set('search', EW.keyword);
if (EW.startDate) params.set('start', EW.startDate);
if (EW.endDate)   params.set('end', EW.endDate);
params.set('page', String(EW.pageUI - 1));
params.set('size', String(EW.limit));
params.set('sort', `${EW.sort},${EW.dir}`);

fetch(`/api/events/filter?${params}`, { headers:{Accept:'application/json'} });



// ---------- Pagination ----------

/* 
การทำงานที่นี่เพิ่มมามี 
- ตัวปุ่มหน้าแรกกับหน้าสุดท้าย visible 
- แสดงหน้า 10 หน้าต่อเลขหน้า
- แสดงเลขหน้าเฉพาะ 3 ตัวแล้วเลื่อนโดยหน้าที่ปัจจุบันอยู่ตรงกลาง
- เพิ่ม UI บอกข้อมูลว่าอยู่หน้าไหนมีทั้งหมดกี่หน้า
*/

document.addEventListener("DOMContentLoaded", () => {
  const posters = document.querySelectorAll(".Poster .search-page-group");
  const itemsPerPage = 10;
  const totalPages = Math.ceil(posters.length / itemsPerPage);
  let currentPage = 1;

  const prevBtn = document.getElementById("Previous");
  const nextBtn = document.getElementById("Next");
  const pageContainer = document.getElementById("pageNumbers");

  function renderPageButtons() {
    pageContainer.innerHTML = "";
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + 2);

    // ถ้าอยู่ท้ายสุดให้เลื่อนช่วงเลขกลับ
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

    pageNumbers.forEach((num, i) => {
      num.classList.toggle("active", i + 1 === page);
    });
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

function search() {
  const keyword = document.getElementById('searchInput').value.trim();

  // ✅ ถ้ายังไม่มี q ใน URL -> ให้ Redirect พร้อม keyword
  if (!location.search.includes('q=')) {
    window.location.href = 'searchpage.html?scroll=Content&q=' + encodeURIComponent(keyword);
    return;
  }
  // ✅ ถ้ามี q แล้ว -> ให้ทำไฮไลท์
  highlightKeyword(keyword);
  goToContent();
}

function highlightKeyword(keyword) {
  const results = document.querySelectorAll('#results .search-page-group');

  results.forEach(item => {
    const title = item.querySelector('.search-page-name');

    // รีเซ็ตข้อความก่อนเน้นคำ
    title.innerHTML = title.textContent;

    if (keyword) {
      const regex = new RegExp(`(${keyword})`, 'gi');
      title.innerHTML = title.textContent.replace(regex, '<span class="highlight">$1</span>');
    }
  });
}

function goToContent() {
  const content = document.getElementById('Content');
  if (content) {
    content.scrollIntoView({ behavior: 'smooth' });
  }
}


// ✅ ให้ทำงานเมื่อโหลดหน้า ถ้ามี ?q= อยู่ใน URL
window.addEventListener('load', () => {
  const urlQ = new URL(location.href).searchParams.get('q');
  if (urlQ) {
    document.getElementById('searchInput').value = urlQ;
    highlightKeyword(urlQ);
  }
});
