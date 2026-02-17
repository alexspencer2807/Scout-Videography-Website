document.addEventListener("DOMContentLoaded", () => {
  const API = "https://script.google.com/macros/s/AKfycby1j8qGH7W5GlKhVMosEfFs5FFv6vGYkb2xZH5Yyi5vwotbK8VGcPGkANAxUOwjFidecA/exec";
  const calendarBody = document.getElementById("calendar-body");
  const selectedSlotInput = document.getElementById("selected-slot");
  let selectedCell = null;

  const startHour = 0;
  const endHour = 24;
  const interval = 2;

  // --- Get ISO date for backend + readable date for header ---
  function getWeekDates() {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const options = { month: "long", day: "numeric" };
      days.push({
        iso: d.toISOString().split('T')[0],             // for backend
        display: d.toLocaleDateString("en-US", options) // e.g., April 4
      });
    }
    return days;
  }

  // --- Convert 24-hour time to 12-hour time ---
  function formatTime(hour) {
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:00 ${period}`;
  }

  // --- Generate calendar table ---
  function generateCalendar(booked = []) {
    const weekDates = getWeekDates();
    calendarBody.innerHTML = "";

    // --- Header row for dates ---
    const headerRow = document.createElement("tr");
    const timeHeader = document.createElement("th");
    timeHeader.textContent = "Date";
    headerRow.appendChild(timeHeader);

    weekDates.forEach(day => {
      const th = document.createElement("th");
      th.textContent = day.display; // shows readable date
      headerRow.appendChild(th);
    });

    calendarBody.appendChild(headerRow); // add header to table

    // --- Time slots ---
    for (let h = startHour; h < endHour; h += interval) {
      const tr = document.createElement("tr");
      const timeCell = document.createElement("td");
      timeCell.textContent = `${formatTime(h)} - ${formatTime(h + interval)}`;
      tr.appendChild(timeCell);

      for (let d = 0; d < 7; d++) {
        const td = document.createElement("td");
        td.dataset.date = weekDates[d].iso;       // ISO date for backend
        td.dataset.time = timeCell.textContent;   // displayed time
        td.textContent = "Available";

        if (booked.some(b => b.date === td.dataset.date && b.time === td.dataset.time)) {
          td.classList.add("booked");
          td.textContent = "Booked";
        } else {
          td.classList.add("available");
          td.onclick = () => {
            if (td.classList.contains("booked")) return;
            if (selectedCell) selectedCell.classList.remove("selected");
            td.classList.add("selected");
            selectedCell = td;
            selectedSlotInput.value = `${td.dataset.date} | ${td.dataset.time}`;
          };
        }

        tr.appendChild(td);
      }

      calendarBody.appendChild(tr);
    }
  }

  // --- Load booked slots from API ---
  async function loadBooked() {
    const res = await fetch(API);
    const booked = await res.json();
    generateCalendar(booked);
  }

  // --- Handle booking form click ---
  document.getElementById("calendar-body").addEventListener("click", async () => {
    if (!selectedCell) return alert("Select a slot!");
    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      date: selectedCell.dataset.date,
      time: selectedCell.dataset.time
    };

    const res = await fetch(API, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });

    const out = await res.json();
    if (out.status === "success") {
      alert("Booked successfully!");
      loadBooked();
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      selectedSlotInput.value = "";
      selectedCell = null;
    } else {
      alert("Error booking slot.");
    }
  });

  loadBooked();
});
