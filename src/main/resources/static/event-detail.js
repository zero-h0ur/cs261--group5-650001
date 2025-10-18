(function() {
	const $ = s => document.querySelector(s);

	const fmtDate = d => d
		? new Date(d).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })
		: '-';
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
		  if (!res.ok) {
		    throw new Error(`HTTP Error ${res.status}`);
		  }

		  const ev = await res.json();

		  // ตรวจ empty data
		  if (
		    !ev ||
		    Object.keys(ev).length === 0 ||
		    (!ev.title && !ev.detail && !ev.description && !ev.categoryName)
		  ) {
		    hideContent();
		    showAlert('ไม่พบข้อมูลกิจกรรม', 'error');
		    return;
		  }


			// แสดงข้อมูลปกติ
			setText('#evt-title', ev.title || '(ไม่มีชื่อกิจกรรม)');
			setText('#evt-category-chip', ev.categoryName || 'หมวดหมู่');
			setText('#evt-dates', fmtRange(ev.startDate, ev.endDate));
			setText('#evt-time', ev.time || '-');
			setText('#evt-location', ev.location || '-');
			setText('#evt-capacity', String(ev.capacity ?? '-'));
			setText('#evt-organizer', [ev.organizer, ev.organizerContact].filter(Boolean).join(' • ') || '-');
			setText('#evt-detail', ev.detail || ev.description || '-');


			const img = $('#evt-poster');
			if (img) {
				img.src = ev.imageUrl || ev.imageURL || 'Resourse/Poster/image 14.png';
				img.alt = ev.title || 'poster';
				img.onerror = () => { img.src = 'Resourse/Poster/image 14.png'; };
			}


			const reg = $('#evt-register-link');
			if (reg && ev.registerUrl) reg.href = ev.registerUrl;


			const box = $('#edAlert');
			if (box) box.style.display = 'none';
			document.title = ev.title ? `${ev.title} | TUEvent` : 'TUEvent';


		} catch (err) {
		  console.error('Error loading event detail:', err);
		  hideContent();
		  showAlert('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่ภายหลัง', 'error');
		}
	}

	document.addEventListener('DOMContentLoaded', loadDetail);
})();