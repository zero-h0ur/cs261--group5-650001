
// JavaScript
function toggleFilterDropdown() {
  const dropdown = document.getElementById("filterDropdownList");
  const button = document.querySelector(".filter-dropdown-button");

  dropdown.classList.toggle("showFilter");
  button.classList.toggle("activeFilter");
}

document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("filterDropdownList");
  const button = document.querySelector(".filter-dropdown-button");
  const textElement = document.querySelector(".filter-dropdown-text");
  const datePicker = document.querySelector(".date-picker-container");

  // ฟังก์ชันหลัก: เรียกเมื่อเลือก filter
  window.selectFilter = (event, option) => {
    textElement.textContent = option; // เปลี่ยนข้อความในปุ่ม filter
    dropdown.classList.remove("showFilter");
    button.classList.remove("activeFilter");

    // ถ้าเลือก "กำหนดเอง" ให้แสดง date picker
    if (option === "กำหนดเอง") {
      datePicker.classList.add("show");
      datePicker.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      datePicker.classList.remove("show");
    }

    console.log("Selected filter:", option);
  };

  // toggle dropdown (จาก onclick ใน HTML)
  window.toggleFilterDropdown = () => {
    dropdown.classList.toggle("showFilter");
    button.classList.toggle("activeFilter");
  };
});

function togglecatagoriesDropdown() {
  const dropdown = document.getElementById("catagoriesDropdownList");
  const button = document.querySelector(".catagories-dropdown-button");

  dropdown.classList.toggle("showCatagory");
  button.classList.toggle("activeCatagory");
}

function selectcatagories(event, option) {
  event.stopPropagation();

  const textElement = document.querySelector(".catagories-dropdown-text");
  textElement.textContent = option;

  const dropdown = document.getElementById("catagoriesDropdownList");
  const button = document.querySelector(".catagories-dropdown-button");

  dropdown.classList.remove("showCatagory");
  button.classList.remove("activeCatagory");

  console.log("Selected catagories:", option);
}


// ปิด dropdown เมื่อคลิกข้างนอก
document.addEventListener("click", function (event) {
  const wrapper = document.querySelector(".filter-dropdown-wrapper");

  if (wrapper && !wrapper.contains(event.target)) {
    const dropdown = document.getElementById("filterDropdownList");
    const button = document.querySelector(".filter-dropdown-button");

    if (dropdown) dropdown.classList.remove("showFilter");
    if (button) button.classList.remove("activeFilter");
  }
});
// ปิด dropdown เมื่อคลิกข้างนอก
document.addEventListener("click", function (event) {
  const wrapper = document.querySelector(".catagories-dropdown-wrapper");

  if (wrapper && !wrapper.contains(event.target)) {
    const dropdown = document.getElementById("catagoriesDropdownList");
    const button = document.querySelector(".catagories-dropdown-button");

    if (dropdown) dropdown.classList.remove("showCatagory");
    if (button) button.classList.remove("activeCatagory");
  }
});



// scroll ไปหน้า searchpage เมื่ออยู่หน้าอื่น
window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const scrollTarget = params.get('scroll');
  if (scrollTarget) {
    const element = document.getElementById(scrollTarget);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
});



(function () {
  // ชื่อ function เฉพาะ: EWDate_onSubmit เพื่อไม่ชนกับฟังก์ชันอื่น
  window.EWDate_onSubmit = function () {
    var from = document.getElementById("ew-from")?.value.trim() || "";
    var to = document.getElementById("ew-to")?.value.trim() || "";

    // ตัวอย่าง validation แบบง่าย: ถ้าว่างทั้งคู่ ให้แจ้งผู้ใช้
    if (!from && !to) {
      alert("กรุณาใส่วันที่ตั้งแต่หรือถึงอย่างน้อยหนึ่งค่า");
      return;
    }

    // ตัวอย่าง: ส่งค่าไปฟิลเตอร์ผล (ปรับตามระบบจริงของคุณ)
    // ที่นี่ผมแสดง alert เป็นตัวอย่าง — คุณสามารถแทนที่ด้วยการเรียก API หรือ
    // ตั้งค่า query params แล้ว reload หน้าได้ตามต้องการ
    alert(
      "ค้นหาจาก: " + (from || "(ไม่ระบุ)") + "\nถึง: " + (to || "(ไม่ระบุ)")
    );

    // ตัวอย่าง: ถ้าคุณต้องการตั้งค่าใน input search หลักของหน้า (ถ้ามี)
    // var mainSearch = document.querySelector('.search-input');
    // if(mainSearch){
    //   mainSearch.value = 'from:' + from + ' to:' + to;
    // }
  };

  // optional: เanble Enter key inside the ew-input to trigger submit
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var active = document.activeElement;
      if (active && (active.id === "ew-from" || active.id === "ew-to")) {
        // ป้องกันจากการ submit ฟอร์มอื่น ๆ
        e.preventDefault();
        window.EWDate_onSubmit();
      }
    }
  });
});

/* ==== EW date picker script (append) ==== */
(function () {
  window.EWDate_onSubmit = function () {
    var from = document.getElementById("ew-from")?.value.trim() || "";
    var to = document.getElementById("ew-to")?.value.trim() || "";

    if (!from && !to) {
      alert("กรุณาใส่วันที่ตั้งแต่หรือถึงอย่างน้อยหนึ่งค่า");
      return;
    }

    // ตัวอย่างการใช้งาน: คุณสามารถเปลี่ยนเป็นส่งค่าไปเรียก API หรือเปลี่ยน query params ตามระบบของคุณ
    alert(
      "ค้นหาจาก: " + (from || "(ไม่ระบุ)") + "\nถึง: " + (to || "(ไม่ระบุ)")
    );
  };

  // enter key triggers submit for the two inputs
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var active = document.activeElement;
      if (active && (active.id === "ew-from" || active.id === "ew-to")) {
        e.preventDefault();
        window.EWDate_onSubmit();
      }
    }
  });
});
