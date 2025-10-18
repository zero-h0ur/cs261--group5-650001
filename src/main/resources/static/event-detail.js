(function () {
    const $ = s => document.querySelector(s);

    const fmtDate = d => d
      ? new Date(d).toLocaleDateString('th-TH',{ day:'2-digit', month:'short', year:'numeric' })
      : '-';
    const fmtRange = (s, e) => (s && e) ? `${fmtDate(s)} - ${fmtDate(e)}` : fmtDate(s || e);

    function setText(sel, txt){
      const el = $(sel);
      if (el) el.textContent = txt;
    }
    function showAlert(msg, tone='info'){
      const box = $('#edAlert'); if (!box) return;
      box.style.display = 'block';
      box.style.padding = '12px'; box.style.borderRadius = '8px';
      if (tone==='error'){ box.style.background='#fee2e2'; box.style.border='1px solid #fecaca'; box.style.color='#991b1b'; }
      else { box.style.background='#eff6ff'; box.style.border='1px solid #bfdbfe'; box.style.color='#1e3a8a'; }
      box.textContent = msg;
    }

    async function loadDetail(){
      const id = new URLSearchParams(location.search).get('id');
      if(!id){ showAlert('ไม่พบรหัสกิจกรรมใน URL','error'); return; }

      showAlert('กำลังโหลดข้อมูล...','info');

      try{
        const res = await fetch(`/api/events/${encodeURIComponent(id)}`, { headers:{Accept:'application/json'} });
        if(res.status === 404){ showAlert('ไม่พบกิจกรรมนี้ (404)','error'); return; }
        if(!res.ok) throw new Error(`HTTP ${res.status}`);

        const ev = await res.json();

        // set ข้อมูล
        setText('#evt-title', ev.title || '(ไม่มีชื่อกิจกรรม)');
        setText('#evt-category-chip', ev.categoryName || 'หมวดหมู่');
        setText('#evt-dates', fmtRange(ev.startDate, ev.endDate));
        setText('#evt-time', ev.time || '-');
        setText('#evt-location', ev.location || '-');
        setText('#evt-capacity', String(ev.capacity ?? '-'));
        setText('#evt-organizer',
          [ev.organizer, ev.organizerContact].filter(Boolean).join(' • ') || '-');
        setText('#evt-detail', ev.detail || ev.description || '-');

        const img = $('#evt-poster');
        if (img){
          img.src = ev.imageUrl || ev.imageURL || 'Resourse/Poster/image 14.png';
          img.alt = ev.title || 'poster';
          img.onerror = () => { img.src = 'Resourse/Poster/image 14.png'; };
        }

        // ปุ่มลงทะเบียน (ถ้ามีลิงก์)
        const reg = $('#evt-register-link');
        if (reg && ev.registerUrl){ reg.href = ev.registerUrl; }

        // ปิด alert
        const box = $('#edAlert'); if (box) box.style.display = 'none';
        document.title = ev.title ? `${ev.title} | TUEvent` : 'TUEvent';
      }catch(err){
        console.error(err);
        showAlert('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + (err.message || 'unknown'),'error');
      }
    }

    document.addEventListener('DOMContentLoaded', loadDetail);
  })();