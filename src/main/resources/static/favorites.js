// favorites.js
(function () {
  const API_BASE = '/api';
  const FAVORITES = new Set();
  let loaded = false;

  // =====================================================
  // ฟังก์ชันสร้าง Modal Popup
  // =====================================================
  function showFavoriteModal(isAdded) {
    // ลบ modal เก่าถ้ามี
    const existingModal = document.querySelector('.favorite-modal-overlay');
    if (existingModal) {
      existingModal.remove();
    }

    // สร้าง modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'favorite-modal-overlay';
    
    // สร้าง modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'favorite-modal-content';
    
    // สร้างไอคอน
    const icon = document.createElement('div');
    icon.className = 'favorite-modal-icon';
    
    if (isAdded) {
      // ไอคอน checkmark สีเขียว
      icon.innerHTML = `
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="28" fill="#4CAF50" stroke="#fff" stroke-width="2"/>
          <path d="M17 30L26 39L43 22" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    } else {
      // ไอคอน X สีแดง
      icon.innerHTML = `
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="28" fill="#E64D4F" stroke="#fff" stroke-width="2"/>
          <path d="M20 20L40 40M40 20L20 40" stroke="white" stroke-width="4" stroke-linecap="round"/>
        </svg>
      `;
    }
    
    // สร้างข้อความ
    const message = document.createElement('div');
    message.className = 'favorite-modal-message';
    message.textContent = isAdded ? 'เพิ่มรายการที่สนใจแล้ว' : 'นำรายการที่สนใจออก';
    
    // สร้างปุ่มปิด
    const closeBtn = document.createElement('button');
    closeBtn.className = 'favorite-modal-close';
    closeBtn.textContent = '×';
    closeBtn.onclick = () => {
      modalOverlay.classList.add('fade-out');
      setTimeout(() => modalOverlay.remove(), 300);
    };
    
    // ประกอบ modal
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(icon);
    modalContent.appendChild(message);
    modalOverlay.appendChild(modalContent);
    
    // เพิ่ม modal เข้า body
    document.body.appendChild(modalOverlay);
    
    // เพิ่ม animation เข้า
    setTimeout(() => modalOverlay.classList.add('show'), 10);
    
    // ปิดอัตโนมัติหลัง 1.5 วินาที
    setTimeout(() => {
      modalOverlay.classList.add('fade-out');
      setTimeout(() => modalOverlay.remove(), 300);
    }, 1500);
    
    // คลิกที่ overlay ก็ปิดได้
    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.add('fade-out');
        setTimeout(() => modalOverlay.remove(), 300);
      }
    };
  }

  // =====================================================
  // Original Functions
  // =====================================================
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
      loaded = true;
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

    // สำรอง: ลองparse จาก href ถ้ามี
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
      // ✅ แสดง modal เมื่อเพิ่มสำเร็จ
      showFavoriteModal(true);
      return;
    }
    if (method === 'DELETE' && res.status === 204) {
      setFavoriteLocal(eventId, false);
      // ✅ แสดง modal เมื่อลบสำเร็จ
      showFavoriteModal(false);
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
  
  async function addFavorite(eventId) {
      const id = Number(eventId);
      if (!id) return false;

      try {
        const res = await fetch(`${API_BASE}/favorites/${encodeURIComponent(id)}`, {
          method: 'POST'
        });
        if (res.status === 201 || res.status === 409) {
          setFavoriteLocal(id, true);
          return true;
        }
        console.warn('[FAV] addFavorite failed status', res.status);
        return false;
      } catch (err) {
        console.error('[FAV] addFavorite error', err);
        return false;
      }
    }

    async function removeFavorite(eventId) {
      const id = Number(eventId);
      if (!id) return false;

      try {
        const res = await fetch(`${API_BASE}/favorites/${encodeURIComponent(id)}`, {
          method: 'DELETE'
        });
        if (res.status === 204 || res.status === 404) {
          setFavoriteLocal(id, false);
          return true;
        }
        console.warn('[FAV] removeFavorite failed status', res.status);
        return false;
      } catch (err) {
        console.error('[FAV] removeFavorite error', err);
        return false;
      }
    }

  // ✅ export ให้หน้าอื่นใช้
  window.FAV = {
    loadFavorites,
    isFavorite,
    renderBookmarkButton,
    attachFavoriteClickHandler,
    setButtonUI,
    showFavoriteModal,  // ← export เพิ่มเผื่อต้องการเรียกใช้จากภายนอก
	addFavorite,
	removeFavorite
  };
  
})();