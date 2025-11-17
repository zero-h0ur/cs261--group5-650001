(function() {
  const $ = s => document.querySelector(s);
  const ERROR_IMG = 'Resourse/Poster/Error.png';
  const API_BASE = '/api';

  const fmtDate = d => {
    if (!d) return '-';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '-';
    return dt.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  const fmtRange = (s, e) => (s && e) ? `${fmtDate(s)} - ${fmtDate(e)}` : fmtDate(s || e);

  function setText(sel, txt) {
    const el = $(sel);
    if (el) el.textContent = txt;
  }

  function setPoster(src) {
    const img = $('#evt-poster');
    if (!img) return;
    img.src = src;
    img.alt = 'poster';
    img.onerror = () => { img.src = ERROR_IMG; };
  }

  function showAlert(msg, tone = 'info') {
    const box = $('#edAlert');
    if (!box) return;
    box.style.display = 'block';
    box.style.padding = '16px';
    box.style.borderRadius = '8px';
    box.style.fontFamily = 'Pridi, sans-serif';
    box.style.textAlign = 'center';
    box.style.marginTop = '16px';
    if (tone === 'error') {
      box.style.background = '#fee2e2';
      box.style.border = '1px solid #fecaca';
      box.style.color = '#991b1b';
    } else {
      box.style.background = '#eff6ff';
      box.style.border = '1px solid #bfdbfe';
      box.style.color = '#1e3a8a';
    }
    box.textContent = msg;
  }

  function hideContent() {
    const section = document.querySelector('.event-content');
    if (section) section.style.display = 'none';
  }

  async function loadDetail() {
    const id = new URLSearchParams(location.search).get('id');

    if (!id) {
      hideContent();
      setPoster(ERROR_IMG);
      showAlert('ไม่พบรหัสกิจกรรมใน URL', 'error');
      return;
    }
    if (!/^\d+$/.test(id)) {
      hideContent();
      showAlert('รหัสกิจกรรมไม่ถูกต้อง', 'error');
      return;
    }

    showAlert('กำลังโหลดข้อมูลกิจกรรม...', 'info');

    try {
      const res = await fetch(`/api/events/${encodeURIComponent(id)}`, {
        headers: { Accept: 'application/json' }
      });

      if (!res.ok) {
        let body = null;
        try {
          if (res.headers.get('content-type')?.includes('application/json')) {
            body = await res.json();
          }
        } catch (_) {}
        const code   = body?.code;
        const srvMsg = body?.message;

        if (res.status === 404 || code === 'EVT_NOT_FOUND') {
          hideContent();
          setPoster(ERROR_IMG);
          showAlert('ไม่พบข้อมูลกิจกรรม', 'error');
          return;
        }
        if (res.status === 400 || code === 'BAD_ID_FORMAT') {
          hideContent();
          setPoster(ERROR_IMG);
          showAlert('รหัสกิจกรรมไม่ถูกต้อง', 'error');
          return;
        }

        hideContent();
        setPoster(ERROR_IMG);
        showAlert(srvMsg || 'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่ภายหลัง', 'error');
        return;
      }

      const ev = await res.json();
      if (!ev || Object.keys(ev).length === 0) {
        hideContent();
        setPoster(ERROR_IMG);
        showAlert('ไม่พบข้อมูลกิจกรรม', 'error');
        return;
      }

      const title            = ev.title ?? '';
      const imageUrl         = ev.image_url ?? ev.imageUrl ?? ev.imageURL;
      const startDate        = ev.start_date ?? ev.startDate;
      const endDate          = ev.end_date ?? ev.endDate;
      const time             = ev.time ?? '';
      const locationText     = ev.location ?? '';
      const capacity         = ev.capacity ?? '-';
      const organizer        = ev.organizer ?? '';
      const organizerContact = ev.organizer_contact ?? ev.organizerContact ?? '';
      const detail           = ev.detail ?? ev.description ?? '-';

      const categoryNameRaw =
        ev.category_name
        ?? ev.category?.category_name
        ?? ev.categoryName
        ?? ev.category?.categoryName
        ?? '';
      const categoryName =
        (typeof categoryNameRaw === 'string' ? categoryNameRaw.trim() : categoryNameRaw);

      setText('#evt-title', title || '(ไม่มีชื่อกิจกรรม)');

      const img = $('#evt-poster');
      if (img) {
        img.src = imageUrl || ERROR_IMG;
        img.alt = title || 'poster';
        img.onerror = () => { img.src = ERROR_IMG; };
      }

      setText('#evt-dates', fmtRange(startDate, endDate));
      setText('#evt-time', time);
      setText('#evt-location', locationText);
      setText('#evt-capacity', String(capacity));
      setText('#evt-organizer', [organizer, organizerContact].filter(Boolean).join(' • ') || '-');
      setText('#evt-detail', detail);

      const catChip = document.querySelector('#evt-category-chip');
      if (catChip) catChip.textContent = categoryName || '-';

      const reg = document.querySelector('#evt-register-link');
      const registerUrl = ev.register_url ?? ev.registerUrl;
      if (reg && registerUrl) reg.href = registerUrl;

      const box = document.querySelector('#edAlert');
      if (box) box.style.display = 'none';
      document.title = title ? `${title} | TUEvent` : 'TUEvent';

    } catch (err) {
      console.error('Error loading event detail:', err);
      hideContent();
      setPoster(ERROR_IMG);
      showAlert('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่ภายหลัง', 'error');
    }
  }

    async function initFavoriteButton() {
      const btn = document.querySelector('.bookmark-btn');
      if (!btn) return;

      const url = new URL(location.href);
      const eventId = Number(url.searchParams.get('id'));
      if (!eventId) return;

      btn.dataset.eventId = eventId;

      if (window.FAV && typeof window.FAV.loadFavorites === 'function') {
        await window.FAV.loadFavorites();
      }

      const isFav = (window.FAV && typeof window.FAV.isFavorite === 'function')
        ? window.FAV.isFavorite(eventId)
        : false;

      const icon = btn.querySelector('.bookmark-icon');
      btn.classList.toggle('active', isFav);
      if (icon) {
        icon.src = isFav
          ? 'Resourse/icon/fav-button-active.png'
          : 'Resourse/icon/fav-button-red.png';
      }

      if (window.FAV && typeof window.FAV.attachFavoriteClickHandler === 'function') {
        window.FAV.attachFavoriteClickHandler(document);
      }
    }

    // DOM ready
    document.addEventListener('DOMContentLoaded', () => {
      loadDetail();
      initFavoriteButton();
    });
	
	// เพิ่มโค้ดนี้ใน event-detail.js หรือไฟล์ favorites.js

	// ฟังก์ชันสร้าง modal popup
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
	  
	  
	  // ประกอบ modal
	  modalContent.appendChild(icon);
	  modalContent.appendChild(message);
	  modalOverlay.appendChild(modalContent);
	  
	  // เพิ่ม modal เข้า body
	  document.body.appendChild(modalOverlay);
	  
	  // เพิ่ม animation เข้า
	  setTimeout(() => modalOverlay.classList.add('show'), 10);
	  
	  // ปิดอัตโนมัติหลัง 2 วินาที
	  setTimeout(() => {
	    modalOverlay.classList.add('fade-out');
	    setTimeout(() => modalOverlay.remove(), 300);
	  }, 1000);
	  
	  // คลิกที่ overlay ก็ปิดได้
	  modalOverlay.onclick = (e) => {
	    if (e.target === modalOverlay) {
	      modalOverlay.classList.add('fade-out');
	      setTimeout(() => modalOverlay.remove(), 300);
	    }
	  };
	}

	// แก้ไขฟังก์ชัน toggle favorite ใน favorites.js
	// เพิ่มการเรียก showFavoriteModal เมื่อมีการเปลี่ยนแปลง

	// ตัวอย่างการใช้งาน (เพิ่มในส่วนที่จัดการ click ของปุ่ม favorite)
	document.addEventListener('DOMContentLoaded', function() {
	  const favoriteBtn = document.querySelector('.bookmark-btn');
	  
	  if (favoriteBtn) {
	    favoriteBtn.addEventListener('click', function(e) {
	      e.preventDefault();
	      e.stopPropagation();
	      
	      const eventId = this.dataset.eventId;
	      if (!eventId) return;
	      
	      // ตรวจสอบสถานะปัจจุบัน
	      const isCurrentlyFavorite = this.classList.contains('active');
	      
	      // Toggle สถานะ
	      this.classList.toggle('active');
	      
	      // เปลี่ยนรูปภาพ
	      const icon = this.querySelector('.bookmark-icon');
	      if (icon) {
	        icon.src = this.classList.contains('active') 
	          ? 'Resourse/icon/fav-button-active.png'
	          : 'Resourse/icon/fav-button-red.png';
	      }
	      
	      // แสดง modal
	      showFavoriteModal(!isCurrentlyFavorite);
	      
	      // บันทึกลง favorites (ถ้ามี function จาก favorites.js)
	      if (window.FAV) {
	        if (!isCurrentlyFavorite) {
	          window.FAV.addFavorite(Number(eventId));
	        } else {
	          window.FAV.removeFavorite(Number(eventId));
	        }
	      }
	    });
	  }
	});

  })();
