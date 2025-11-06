// State สำหรับเก็บหมวดหมู่ที่เลือก
let selectedCategories = ['all'];

// ข้อมูลหมวดหมู่ทั้งหมด (สำหรับแมป value กับชื่อภาษาไทย)
const categoryNames = {
    'all': 'ทั้งหมด',
    'camp': 'ค่าย',
    'activity': 'กิจกรรม',
    'music': 'ดนตรี',
    'technology': 'เทคโนโลยี',
    'sport': 'กีฬา',
    'competition': 'แข่งขัน',
    'workshop': 'เวิร์คชอป',
    'art': 'ศิลปะ',
    'academic': 'วิชาการ',
    'finance': 'การเงิน',
    'business': 'ธุรกิจ'
};

// ===== เพิ่ม: slug -> id ของหมวด (ปรับเลข id ให้ตรง backend เก่าของคุณ) =====
const CATEGORY_ID_MAP = {
  camp: 1,
  activity: 2,
  music: 3,
  technology: 4,
  sport: 5,       // ถ้า backend ใช้ "sport" ให้แก้ key เป็น sport
  competition: 6,
  workshop: 7,
  art: 8,
  academic: 9,
  finance: 10,
  business: 11,
};

// ===== เพิ่ม: ชื่อพารามฯ ที่แบ็กเอนด์เก่าอาจรองรับ (กันเหนียว) =====
 const CATEGORY_PARAM_KEYS = ['categories', 'categoryIds', 'category', 'category_id'];

// ===== เพิ่ม: สร้าง query string คงค่า search/page/sort เดิมไว้ด้วย =====
function buildQueryFromState() {
  const url = new URL(location.href);
  const keepKeys = ['search', 'page', 'limit', 'sort', 'startDate', 'endDate'];

  const keepParams = new URLSearchParams();
  keepKeys.forEach(k => {
    const v = url.searchParams.get(k);
    if (v != null && v !== '') keepParams.set(k, v);
  });

  // กรณี "ทั้งหมด" -> ไม่ส่งคีย์ category ใด ๆ
  if (selectedCategories.includes('all')) {
    return keepParams.toString();
  }

  // map slug -> id (กรองออกเฉพาะที่แมปได้จริง)
  const ids = selectedCategories
    .map(slug => CATEGORY_ID_MAP[slug])
    .filter(id => Number.isInteger(id));

  if (ids.length === 0) return keepParams.toString();

  const csv = ids.join(',');
  CATEGORY_PARAM_KEYS.forEach(key => keepParams.set(key, csv));
  return keepParams.toString();
}


// ฟังก์ชันสำหรับ toggle dropdown
function toggleCategoryDropdown() {
    const dropdownList = document.getElementById('categoryDropdownList');
    const button = document.querySelector('.category-dropdown-button');
    
    if (dropdownList && button) {
        dropdownList.classList.toggle('showCategory');
        button.classList.toggle('activeCategory');
    }
}

// ฟังก์ชันสำหรับปิด dropdown เมื่อคลิกข้างนอก
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.category-dropdown-wrapper');
    const dropdownList = document.getElementById('categoryDropdownList');
    const button = document.querySelector('.category-dropdown-button');
    
    if (dropdown && !dropdown.contains(event.target)) {
        if (dropdownList) dropdownList.classList.remove('showCategory');
        if (button) button.classList.remove('activeCategory');
    }
});

// ฟังก์ชันสำหรับจัดการการเลือก checkbox
function handleCategoryChange(checkbox) {
    const value = checkbox.value;
    const allCheckbox = document.querySelector('input[value="all"]');
    const allOtherCheckboxes = document.querySelectorAll('.category-checkbox-item input[type="checkbox"]:not([value="all"])');
    
    // ถ้าเลือก "ทั้งหมด"
    if (value === 'all') {
        if (checkbox.checked) {
            // เลือกทั้งหมด - ยกเลิกการเลือกอื่นๆ
            selectedCategories = ['all'];
            allOtherCheckboxes.forEach(cb => {
                cb.checked = false;
                cb.parentElement.classList.remove('active');
            });
            checkbox.parentElement.classList.add('active');
        } else {
            // ไม่ให้ยกเลิก "ทั้งหมด" ถ้าไม่มีอะไรเลือก
            checkbox.checked = true;
        }
    } 
    // ถ้าเลือกหมวดหมู่อื่นๆ
    else {
        // ยกเลิก "ทั้งหมด" ถ้าเลือกหมวดหมู่ใดๆ
        if (checkbox.checked) {
            if (allCheckbox) {
                allCheckbox.checked = false;
                allCheckbox.parentElement.classList.remove('active');
            }
            
            // เพิ่มหมวดหมู่ที่เลือกเข้า state
            selectedCategories = selectedCategories.filter(cat => cat !== 'all');
            if (!selectedCategories.includes(value)) {
                selectedCategories.push(value);
            }
            checkbox.parentElement.classList.add('active');
        } else {
            // ลบหมวดหมู่ออกจาก state
            selectedCategories = selectedCategories.filter(cat => cat !== value);
            checkbox.parentElement.classList.remove('active');
            
            // ถ้าไม่มีอะไรเลือกเลย ให้กลับไปเลือก "ทั้งหมด"
            if (selectedCategories.length === 0) {
                if (allCheckbox) {
                    allCheckbox.checked = true;
                    allCheckbox.parentElement.classList.add('active');
                }
                selectedCategories = ['all'];
            }
        }
    }
    
    // อัปเดต UI
    updateSelectedText();
    
    // เรียกฟังก์ชันกรองข้อมูล (คุณสามารถแก้ไขตรงนี้ตามต้องการ)
    filterEvents();
    
    // Log state สำหรับ debug
    console.log('Selected Categories:', selectedCategories);
}

// ฟังก์ชันสำหรับอัปเดตข้อความที่แสดงในปุ่ม
function updateSelectedText() {
    const textElement = document.querySelector('.category-selected-text');
    if (!textElement) return;
    
    if (selectedCategories.includes('all') || selectedCategories.length === 0) {
        textElement.textContent = 'ทุกหมวดหมู่';
    } else if (selectedCategories.length === 1) {
        textElement.textContent = categoryNames[selectedCategories[0]];
    } else if (selectedCategories.length === 2) {
        textElement.textContent = `${categoryNames[selectedCategories[0]]}, ${categoryNames[selectedCategories[1]]}`;
    } else {
        textElement.textContent = `${selectedCategories.length} หมวดหมู่`;
    }
}

// ฟังก์ชันสำหรับล้างการเลือกทั้งหมด
function clearAllCategories() {
    // รีเซ็ต state
    selectedCategories = ['all'];
    
    // รีเซ็ต checkbox ทั้งหมด
    const allCheckboxes = document.querySelectorAll('.category-checkbox-item input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        if (checkbox.value === 'all') {
            checkbox.checked = true;
            checkbox.parentElement.classList.add('active');
        } else {
            checkbox.checked = false;
            checkbox.parentElement.classList.remove('active');
        }
    });
    
    // อัปเดต UI
    updateSelectedText();
    
    // กรองข้อมูลใหม่
    filterEvents();
    
    console.log('Categories cleared. Selected:', selectedCategories);
}

// ===== เพิ่ม: วาดการ์ดกิจกรรมให้ตรงกับโครง HTML ของคุณ =====
function renderEventCards(items) {
  const grid = document.querySelector('#events-grid'); // ปรับให้ตรงกับหน้าเว็บคุณ
  if (!grid) return;

  grid.innerHTML = '';

  if (!items || items.length === 0) {
    grid.innerHTML = `<p class="text-gray-500">ไม่พบกิจกรรม</p>`;
    return;
  }

  for (const ev of items) {
    const el = document.createElement('article');
    el.className = 'event-card';
    el.innerHTML = `
      <img src="${ev.coverImageUrl ?? '/img/placeholder.jpg'}" alt="">
      <h3 class="event-title">${ev.title ?? '-'}</h3>
      <p class="event-dates">
        ${(ev.startDate ?? '').toString().slice(0,10)} – ${(ev.endDate ?? '').toString().slice(0,10)}
      </p>
      <a class="event-link" href="/event.html?id=${ev.id}">ดูรายละเอียด</a>
    `;
    grid.appendChild(el);
  }
}

// ===== เพิ่ม: ดึงข้อมูลจาก API (รองรับทั้ง array ตรง ๆ และ Spring Page {content:[]}) =====
async function fetchAndRenderEvents() {
  const qs = buildQueryFromState();
  const url = qs ? `/api/events?${qs}` : '/api/events';

  try {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' }});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.content ?? []);
    renderEventCards(items);

    // TODO: ถ้าคุณมีเพจจิเนชันบน backend เดิม ให้ต่อยอดอัปเดตปุ่ม/หมายเลขหน้าได้ที่นี่
    // renderPagination(data);

  } catch (err) {
    console.error('Fetch events failed:', err);
    renderEventCards([]);
  }
}

// ฟังก์ชันสำหรับกรองกิจกรรม (ตัวอย่าง - แก้ไขตามโครงสร้างข้อมูลของคุณ)
// ฟังก์ชันสำหรับกรองกิจกรรม (เชื่อม API แล้ววาดการ์ด)
function filterEvents() {
  const ids = selectedCategories.includes('all')
    ? []
    : selectedCategories.map(s => CATEGORY_ID_MAP[s]).filter(Number.isInteger);

  if (document.querySelector('#homeGridAll')) {
    if (window.ALL) window.ALL.categoryIds = ids;
    if (typeof window.loadAll === 'function') window.loadAll();
    return;
  }
  if (document.querySelector('#resultList')) {
    if (window.SEARCH_STATE) window.SEARCH_STATE.categoryIds = ids;
    if (typeof window.searchLoad === 'function') window.searchLoad();
    return;
  }
  console.warn('[category-filter] ไม่พบกริดเป้าหมาย');
}

// ฟังก์ชัน Helper: ดึง state ปัจจุบัน (สำหรับใช้งานจากไฟล์อื่น)
function getSelectedCategories() {
    return [...selectedCategories]; // return copy ของ array
}

// ฟังก์ชัน Helper: ตั้งค่า categories (สำหรับใช้งานจากไฟล์อื่น)
function setSelectedCategories(categories) {
    if (!Array.isArray(categories) || categories.length === 0) {
        clearAllCategories();
        return;
    }
    
    selectedCategories = [...categories];
    
    // อัปเดต checkbox UI
    const allCheckboxes = document.querySelectorAll('.category-checkbox-item input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        if (selectedCategories.includes(checkbox.value)) {
            checkbox.checked = true;
            checkbox.parentElement.classList.add('active');
        } else {
            checkbox.checked = false;
            checkbox.parentElement.classList.remove('active');
        }
    });
    
    // อัปเดต UI
    updateSelectedText();
    filterEvents();
}

// Initialize เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', function() {
    // ตั้งค่าเริ่มต้น
	  // ===== เพิ่ม: init จาก URL ถ้ามีพารามฯ categories เดิม =====
	  const url = new URL(location.href);
	  const raw =
	    url.searchParams.get('categories') ||
	    url.searchParams.get('categoryIds') ||
	    url.searchParams.get('category') || '';

	  if (raw) {
	    const ids = raw.split(',').map(s => Number(s.trim())).filter(n => Number.isInteger(n));
	    // map id -> slug ย้อนกลับ
	    const inverse = Object.fromEntries(Object.entries(CATEGORY_ID_MAP).map(([k,v]) => [v,k]));
	    const slugs = ids.map(id => inverse[id]).filter(Boolean);
	    if (slugs.length) {
	      setSelectedCategories(slugs);      // ฟังก์ชันเดิมในไฟล์
	    } else {
	      filterEvents(); // โหลดทั้งหมด
	    }
	  } else {
	    filterEvents();   // โหลดทั้งหมดครั้งแรก
	  }
	
    updateSelectedText();
    
    // เพิ่ม active class ให้ "ทั้งหมด" ตั้งแต่เริ่มต้น
    const allCheckbox = document.querySelector('input[value="all"]');
    if (allCheckbox) {
        allCheckbox.parentElement.classList.add('active');
    }
    
    console.log('Category filter initialized');
    console.log('Initial state:', selectedCategories);
});

// Export functions สำหรับใช้งานภายนอก (ถ้าต้องการ)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getSelectedCategories,
        setSelectedCategories,
        clearAllCategories,
        filterEvents
    };
}