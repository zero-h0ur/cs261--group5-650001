(function() {
	const $ = s => document.querySelector(s);

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

		// ไม่มี event_id ใน URL
		if (!id) {
		  hideContent();
		  showAlert('ไม่พบรหัสกิจกรรมใน URL', 'error');
		  return;
		}

		// แสดงข้อความกำลังโหลด
		showAlert('กำลังโหลดข้อมูลกิจกรรม...', 'info');

		try {
		  const res = await fetch(`/api/events/${encodeURIComponent(id)}`, { headers: { Accept: 'application/json' } });

		  // ตรวจ HTTP Error ก่อน parse JSON
		  if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
		  const ev = await res.json();

		  // ตรวจ empty data
		  if (!ev || Object.keys(ev).length === 0) {
		    hideContent();
		    showAlert('ไม่พบข้อมูลกิจกรรม', 'error');
		    return;
		  }
		  
		  // --- อ่านค่าแบบ snake/camel + เผื่ออยู่ใน object ซ้อน ---
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

		  // ✅ ครอบทุกกรณีของ category name (root/object + snake/camel)
		  const categoryNameRaw =
		    ev.category_name
		    ?? ev.category?.category_name
		    ?? ev.categoryName
		    ?? ev.category?.categoryName
		    ?? '';

		  const categoryName = (typeof categoryNameRaw === 'string' ? categoryNameRaw.trim() : categoryNameRaw);

		  // ===== DEBUG ช่วยเช็คค่าที่ได้จริง ๆ =====
		  console.log('[event-detail] category candidates =', {
		    root_snake: ev.category_name,
		    nested_snake: ev.category?.category_name,
		    root_camel: ev.categoryName,
		    nested_camel: ev.category?.categoryName,
		    chosen: categoryName
		  });

		  // Title
      	  setText('#evt-title', title || '(ไม่มีชื่อกิจกรรม)');

		  // Poster
		  const img = $('#evt-poster');
		  if (img) {
		    img.src = imageUrl || 'Resourse/Poster/image 14.png';
		    img.alt = title || 'poster';
		    img.onerror = () => { img.src = 'Resourse/Poster/image 14.png'; };
		  }

			// แสดงข้อมูลปกติ
			setText('#evt-dates', fmtRange(startDate, endDate));
			setText('#evt-time', time);
			setText('#evt-location', locationText);
			setText('#evt-capacity', String(capacity));
			setText('#evt-organizer', [organizer, organizerContact].filter(Boolean).join(' • ') || '-');
			setText('#evt-detail', detail);

			const catChip = document.querySelector('#evt-category-chip');
			if (catChip) {
			  catChip.textContent = categoryName || '-';
			}

			const reg = document.querySelector('#evt-register-link');
			const registerUrl = ev.register_url ?? ev.registerUrl;
			if (reg && registerUrl) reg.href = registerUrl;

			const box = document.querySelector('#edAlert');
			if (box) box.style.display = 'none';
			document.title = title ? `${title} | TUEvent` : 'TUEvent';

		} catch (err) {
		  console.error('Error loading event detail:', err);
		  hideContent();
		  showAlert('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่ภายหลัง', 'error');
		}
	}

	document.addEventListener('DOMContentLoaded', loadDetail);
})();