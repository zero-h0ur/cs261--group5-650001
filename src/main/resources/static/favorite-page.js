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