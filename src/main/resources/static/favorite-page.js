// favorite-page.js
// ================================
// เวอร์ชันใหม่: โหลดรายการที่สนใจจาก backend /api/favorites (มี pagination)
// ใช้โค้ด bookmark ร่วมกับ favorites.js
// ================================

/*
  โค้ดเดิม (demo localStorage) ถูกย้ายมาเก็บไว้ใน block comment นี้
  เผื่ออยากย้อนกลับไปใช้ภายหลัง

document.addEventListener("DOMContentLoaded", function () {
  const resultList = document.getElementById("resultList");
  const emptyState = document.getElementById("emptyState");

  // ตัวอย่างข้อมูล favorite
  let favorites = JSON.parse(localStorage.getItem("favoriteEvents")) || [
    {
      id: 1,
      title: "งานดนตรีกลางคืน",
      date: "20 ธันวาคม 2568",
      location: "มหาวิทยาลัยธรรมศาสตร์",
      img: "Resourse/event-sample.jpg",
    },
    {
      id: 2,
      title: "TU Hackathon 2025",
      date: "15 มกราคม 2568",
      location: "SC อาคารเรียนรวม",
      img: "Resourse/event-sample2.jpg",
    },
  ];

  // แสดงผลอีเว้นท์
  function renderFavorites() {
    resultList.innerHTML = "";

    if (favorites.length === 0) {
      emptyState.style.display = "block";
      return;
    } else {
      emptyState.style.display = "none";
    }

    favorites.forEach((event) => {
      const card = document.createElement("div");
      card.classList.add("event-card");
      card.innerHTML = `
        <img src="${event.img}" alt="${event.title}" class="event-img" />
        <div class="event-info">
          <h3>${event.title}</h3>
          <p>${event.date}</p>
          <p>${event.location}</p>
          <button class="unfavorite-btn" data-id="${event.id}">
            <i class="material-icons">favorite</i> นำออกจากรายการโปรด
          </button>
        </div>
      `;
      resultList.appendChild(card);
    });

    // ลบ favorite
    document.querySelectorAll(".unfavorite-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.closest("button").dataset.id);
        favorites = favorites.filter((f) => f.id !== id);
        localStorage.setItem("favoriteEvents", JSON.stringify(favorites));
        renderFavorites();
      });
    });
  }

  renderFavorites();
});
*/

// ================================
// เวอร์ชันใหม่
// ================================

(function () {
  const API_BASE = '/api';
  const PAGE_SIZE = 10; // ให้ตรงกับ DEFAULT_SIZE ใน FavoriteController

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  // state ของหน้า favorite
  const FAV_PAGE = {
    page: 1,        // 1-based (หน้าแรก = 1)
    size: PAGE_SIZE,
    totalPages: 1,
  };

  // helper เลือกค่าตัวแรกที่ไม่ว่าง
  const pick = (...xs) => xs.find(v => v !== undefined && v !== null && v !== '');

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
    return dt.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // ใช้ปุ่ม bookmark จาก FAV ถ้ามี
  const renderBookmark = (id) =>
    (window.FAV && typeof window.FAV.renderBookmarkButton === 'function')
      ? window.FAV.renderBookmarkButton(id)
      : '';

  // โครงการ์ด: ให้เหมือน home-events.js ให้มากที่สุด
  function card(ev) {
    const id = pick(ev.eventId, ev.event_id, ev.id, '');

    const img = pick(
      ev.imageUrl, ev.imageURL, ev.image_url, ev.image, ev.imagePath,
      'Resourse/Poster/image 14.png'
    );

    const start = pick(ev.startDate, ev.start_date, ev.start, ev.dateStart);
    const end = pick(ev.endDate, ev.end_date, ev.end, ev.dateEnd);
    const dateText = (start && end)
      ? `${fmtDate(start)} - ${fmtDate(end)}`
      : fmtDate(start || end);

    const timeText = pick(ev.time, ev.startTime, ev.start_time, '-');
    const title = pick(ev.title, '(ไม่มีชื่อกิจกรรม)');
    const location = pick(ev.location, '-');

    return `
      <div class="search-page-group" data-event-id="${id}">
        ${renderBookmark(id)}
        <a href="event-detail.html?id=${encodeURIComponent(String(id))}">
          <img src="${img}" alt="Poster" class="search-page-Poster"
               onerror="this.src='Resourse/Poster/image 14.png'"/>
          <span class="search-page-date">${dateText}</span>
          <div class="search-page-time">
            <img src="Resourse/icon/clock.png" class="clock"/>
            <span class="search-page-clock">${timeText}</span>
          </div>
          <span class="search-page-name">${title}</span>
          <div class="search-page-place">
            <img src="Resourse/icon/pin.png" class="pin"/>
            <span class="search-page-pin">${location}</span>
          </div>
          <button class="register-btn">ลงทะเบียน</button>
        </a>
      </div>
    `;
  }

  // ดึงข้อมูลจาก /api/favorites?page=...&size=...&sort=createdAt,desc
  async function fetchFavoritePage(page1Based, size) {
    const page0 = Math.max(0, (page1Based || 1) - 1);
    const sz = size || PAGE_SIZE;

    const params = new URLSearchParams({
      page: String(page0),
      size: String(sz),
      sort: 'createdAt,desc'
    });

    const res = await fetch(`${API_BASE}/favorites?${params.toString()}`, {
      headers: { Accept: 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`Favorites API error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  }

  // แปลง response เป็นรูปแบบกลาง
  function normalizePage(data) {
    if (Array.isArray(data)) {
      return {
        items: data,
        page: 1,
        totalPages: 1,
        totalElements: data.length
      };
    }
    const items = Array.isArray(data.content) ? data.content : [];
    const page0 = Number.isFinite(data.number) ? Number(data.number) : 0;
    const totalPages = Number.isFinite(data.totalPages) ? Number(data.totalPages) : 1;
    const total = Number.isFinite(data.totalElements) ? Number(data.totalElements) : items.length;

    return {
      items,
      page: page0 + 1,     // แปลงเป็น 1-based
      totalPages: Math.max(1, totalPages),
      totalElements: total
    };
  }

  function renderPager(pageMeta) {
    const pagerEl = $('#searchPager');
    const infoEl = $('#searchPageInfo');
    if (!pagerEl || !infoEl) return;

    const current = pageMeta.page;
    const total = pageMeta.totalPages;

    FAV_PAGE.page = current;
    FAV_PAGE.totalPages = total;

    if (total <= 1) {
      pagerEl.innerHTML = '';
      infoEl.textContent = '';
      return;
    }

    let html = '';

    // prev
    const prevDisabled = current <= 1 ? ' disabled' : '';
    html += `
      <button class="Selectpage${prevDisabled}" data-page="${current - 1}" ${prevDisabled ? 'aria-disabled="true"' : ''}>
        &lt;
      </button>
    `;

    // page numbers (แบบง่าย: แสดงทุกหน้า ถ้าหน้าน้อย)
    for (let i = 1; i <= total; i++) {
      const active = i === current ? ' active' : '';
      html += `
        <button class="Selectpage${active}" data-page="${i}">
          ${i}
        </button>
      `;
    }

    // next
    const nextDisabled = current >= total ? ' disabled' : '';
    html += `
      <button class="Selectpage${nextDisabled}" data-page="${current + 1}" ${nextDisabled ? 'aria-disabled="true"' : ''}>
        &gt;
      </button>
    `;

    pagerEl.innerHTML = html;
    infoEl.textContent = `หน้า ${current} จาก ${total}`;

    // bind click
    pagerEl.addEventListener('click', onPagerClick, { once: true });
  }

  function onPagerClick(e) {
    const btn = e.target.closest('.Selectpage');
    if (!btn || btn.disabled) return;
    const page = Number(btn.dataset.page);
    if (!page || page === FAV_PAGE.page || page < 1 || page > FAV_PAGE.totalPages) return;
    FAV_PAGE.page = page;
    loadFavoritePage();
  }

  async function loadFavoritePage() {
    const resultList = $('#resultList');
    const emptyState = $('#emptyState');
    if (!resultList || !emptyState) return;

    // เคลียร์ของเก่า
    resultList.innerHTML = '';
    emptyState.style.display = 'none';
    emptyState.textContent = 'กำลังโหลดรายการที่สนใจ...';

    try {
      // ให้ FAV โหลด set favorites ก่อน (จะได้ renderBookmark ถูก)
      if (window.FAV && typeof window.FAV.loadFavorites === 'function') {
        await window.FAV.loadFavorites();
      }

      const raw = await fetchFavoritePage(FAV_PAGE.page, FAV_PAGE.size);
      const page = normalizePage(raw);

      resultList.innerHTML = '';

      if (!page.items.length) {

        const filterBox = document.querySelector(".filter-dropdown-wrapper");
        if (filterBox) filterBox.style.display = "none";

        emptyState.style.display = 'block';
        emptyState.innerHTML = `
        <div class="favorite-empty">
            <div class="star-wrapper">
                <img src="Resourse/png/TU EVENT (2) 1.png" alt="star" class="star-img">
            </div>
            <p class="favorite-empty-text">ไม่พบรายการที่สนใจ</p>
        </div>
      `;
        renderPager(page); // เคลียร์ pager
        return;
      }

      emptyState.style.display = 'none';

      const html = page.items.map(card).join('');
      resultList.innerHTML = html;

      renderPager(page);

      // ติด event favorite ให้ปุ่มทุกอันในหน้านี้
      setupFavoriteButtons(resultList);

    } catch (err) {
      console.error('[favorite-page] loadFavoritePage error', err);
      resultList.innerHTML = '';
      emptyState.style.display = 'block';
      emptyState.textContent = 'เกิดข้อผิดพลาดในการโหลดรายการที่สนใจ กรุณาลองใหม่อีกครั้ง';
    }
  }

  function setupFavoriteButtons(root) {
    if (!window.FAV) return;

    // ให้ favorites.js จัดการ logic toggle + modal + call API
    if (typeof window.FAV.attachFavoriteClickHandler === 'function') {
      window.FAV.attachFavoriteClickHandler(root);
    }

    // เพิ่ม handler เพิ่มเติมสำหรับหน้านี้:
    // ถ้าผู้ใช้ "นำรายการที่สนใจออก" → reload รายการให้การ์ดหาย
    if (!root.__favPageHandlerAttached) {
      root.__favPageHandlerAttached = true;

      root.addEventListener('click', (e) => {
        const btn = e.target.closest('.bookmark-btn');
        if (!btn) return;

        // รอให้ favorites.js ทำงานเสร็จก่อน (toggleFavoriteByButton async)
        setTimeout(() => {
          const stillActive = btn.classList.contains('active');
          if (!stillActive) {
            // ตอนนี้รายการนี้ไม่ได้อยู่ใน Favorites แล้ว → reload หน้านี้
            loadFavoritePage();
          }
        }, 350);
      });
    }
  }

  // DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    loadFavoritePage();
  });
})();
