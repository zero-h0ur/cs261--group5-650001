// favorites.js
(function () {
  const API_BASE = '/api';
  const FAVORITES = new Set();
  let loaded = false;

  function pickId(ev) {
    return ev.eventId ?? ev.event_id ?? ev.id ?? null;
  }

  function setFavoriteLocal(id, active) {
    const num = Number(id);
    if (!num) return;
    if (active) FAVORITES.add(num);
    else FAVORITES.delete(num);
  }

  async function loadFavorites() {
    if (loaded) return;
    try {
      const res = await fetch(`${API_BASE}/favorites?page=0&size=1000`, {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) {
        console.warn('[FAV] loadFavorites non-OK:', res.status);
        loaded = true;
        return;
      }
      const data = await res.json();
      const content = Array.isArray(data) ? data : (data.content || []);
      FAVORITES.clear();
      for (const ev of content) {
        const id = pickId(ev);
        if (id != null) FAVORITES.add(Number(id));
      }
      loaded = true;
      console.log('[FAV] loaded favorites:', Array.from(FAVORITES));
    } catch (err) {
      console.error('[FAV] loadFavorites failed', err);
      loaded = true; // กันลูปโหลดซ้ำรัว ๆ
    }
  }

  function isFavorite(id) {
    return FAVORITES.has(Number(id));
  }

  function renderBookmarkButton(id) {
    const active = isFavorite(id);
    const activeClass = active ? ' active' : '';
    const iconSrc = active
      ? 'Resourse/icon/fav-button-active.png'
      : 'Resourse/icon/fav-button-red.png';

    return `
      <div class="bookmark-btn${activeClass}" data-event-id="${id}">
        <img src="${iconSrc}" class="bookmark-icon" alt="favorite"/>
      </div>
    `;
  }

  function getEventIdFromButton(btn) {
    const card = btn.closest('.search-page-group');
    let eventId = btn.dataset.eventId || card?.dataset.eventId;

    // สำรอง: ลอง parse จาก href ถ้ามี
    if (!eventId && card) {
      const link = card.querySelector('a[href*="event-detail.html"]');
      if (link) {
        try {
          const url = new URL(link.getAttribute('href'), window.location.origin);
          eventId = url.searchParams.get('id');
        } catch (err) {
          console.error('[FAV] cannot parse eventId from link', err);
        }
      }
    }

    // สุดท้ายลองจาก query string ของหน้าปัจจุบัน (ใช้กับหน้า detail)
    if (!eventId) {
      const url = new URL(location.href);
      eventId = url.searchParams.get('id');
    }

    return eventId ? Number(eventId) : null;
  }

  // ✅ ฟังก์ชันกลางสำหรับเซ็ต UI ปุ่ม (ใช้ได้ทุกหน้า)
  function setButtonUI(btn, active) {
    const icon = btn.querySelector('.bookmark-icon');
    btn.classList.toggle('active', active);
    if (icon) {
      icon.src = active
        ? 'Resourse/icon/fav-button-active.png'
        : 'Resourse/icon/fav-button-red.png';
    }
  }

  async function toggleFavoriteByButton(btn) {
    if (btn.dataset.loading === '1') return;

    let eventId = getEventIdFromButton(btn);
    if (!eventId) {
      console.warn('[FAV] no eventId on bookmark button');
      return;
    }

    const currentlyActive = btn.classList.contains('active');
    const nextActive = !currentlyActive;

    // optimistic update
    setButtonUI(btn, nextActive);
    btn.dataset.loading = '1';

    const method = nextActive ? 'POST' : 'DELETE';
    const url = `${API_BASE}/favorites/${encodeURIComponent(eventId)}`;

    let res;
    try {
      res = await fetch(url, { method });
    } catch (err) {
      console.error('[FAV] network error', err);
      // revert
      setButtonUI(btn, currentlyActive);
      btn.dataset.loading = '0';
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้\nกรุณาลองใหม่อีกครั้ง');
      return;
    }

    btn.dataset.loading = '0';

    // success
    if (method === 'POST' && res.status === 201) {
      setFavoriteLocal(eventId, true);
      return;
    }
    if (method === 'DELETE' && res.status === 204) {
      setFavoriteLocal(eventId, false);
      return;
    }

    // fail → revert
    setButtonUI(btn, currentlyActive);

    let msg = 'เกิดข้อผิดพลาดที่ไม่คาดคิด';
    switch (res.status) {
      case 401: msg = 'ไม่สามารถระบุผู้ใช้ได้ (anon cookie)'; break;
      case 404: msg = 'ไม่พบกิจกรรมนี้ในระบบแล้ว'; break;
      case 409: msg = 'กิจกรรมนี้อยู่ใน Favorites ของคุณอยู่แล้ว'; break;
      default:  msg = `เซิร์ฟเวอร์ตอบกลับด้วยสถานะ ${res.status}`;
    }
    alert(msg + '\n\nถ้ายังต้องการ favorite/unfavorite ให้ลองกดอีกครั้งเพื่อ retry');
  }

  function attachFavoriteClickHandler(root = document) {
    if (!root || root.__favHandlerAttached) return;
    root.__favHandlerAttached = true;

    root.addEventListener('click', e => {
      const btn = e.target.closest('.bookmark-btn');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      toggleFavoriteByButton(btn);
    });
  }

  // ✅ export ให้หน้าอื่นใช้
  window.FAV = {
    loadFavorites,
    isFavorite,
    renderBookmarkButton,
    attachFavoriteClickHandler,
    setButtonUI,      // <— สำคัญ ใช้ในหน้า detail
  };
  
})();
