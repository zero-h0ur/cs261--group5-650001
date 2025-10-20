// State สำหรับเก็บหมวดหมู่ที่เลือก
let selectedCategories = ['all'];

// ข้อมูลหมวดหมู่ทั้งหมด (สำหรับแมป value กับชื่อภาษาไทย)
const categoryNames = {
    'all': 'ทั้งหมด',
    'camp': 'ค่าย',
    'activity': 'กิจกรรม',
    'music': 'ดนตรี',
    'technology': 'เทคโนโลยี',
    'sports': 'กีฬา',
    'competition': 'แข่งขัน',
    'workshop': 'เวิร์คชอป',
    'art': 'ศิลปะ',
    'academic': 'วิชาการ',
    'finance': 'การเงิน',
    'business': 'ธุรกิจ'
};

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

// ฟังก์ชันสำหรับกรองกิจกรรม (ตัวอย่าง - แก้ไขตามโครงสร้างข้อมูลของคุณ)
function filterEvents() {
    console.log('Filtering events with categories:', selectedCategories);
    
    // ตัวอย่างการใช้งาน:
    // 1. ถ้าเลือก "ทั้งหมด" ให้แสดงกิจกรรมทั้งหมด
    if (selectedCategories.includes('all')) {
        console.log('Show all events');
        // TODO: เรียก API หรือฟังก์ชันแสดงกิจกรรมทั้งหมด
        // loadAllEvents();
        return;
    }
    
    // 2. ถ้าเลือกหมวดหมู่เฉพาะ ให้กรองตาม selectedCategories
    console.log('Filter events by:', selectedCategories);
    // TODO: เรียก API หรือฟังก์ชันกรองกิจกรรม
    // loadEventsByCategories(selectedCategories);
    
    // ตัวอย่างการใช้กับ API:
    /*
    fetch(`/api/events?categories=${selectedCategories.join(',')}`)
        .then(response => response.json())
        .then(data => {
            // แสดงผลกิจกรรมที่กรองแล้ว
            displayEvents(data);
        })
        .catch(error => {
            console.error('Error filtering events:', error);
        });
    */
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