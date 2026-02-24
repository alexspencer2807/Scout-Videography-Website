document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("searchInput");
    const resultsBox = document.getElementById("searchResults");

    if (!input || !resultsBox) return;

    input.addEventListener("input", function () {
        const query = this.value.trim();

        if (query.length < 2) {
            resultsBox.style.display = "none";
            resultsBox.innerHTML = "";
            return;
        }

        fetch("/search?query=" + encodeURIComponent(query))
            .then(res => res.json())
            .then(data => {
                resultsBox.innerHTML = "";

                if (data.length === 0) {
                    resultsBox.innerHTML = "<div class='result-item'>No results</div>";
                } else {
                    data.forEach(item => {
                        const div = document.createElement("div");
                        div.className = "result-item";
                        div.textContent = item.title + (item.type === "Media" ? " 📹" : "");
                        div.addEventListener("click", () => {window.location.href = item.url;});
                        resultsBox.appendChild(div);
                    });
                }

                resultsBox.style.display = "block";
            })
            .catch(() => {
                resultsBox.style.display = "none";
            });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
        if (!e.target.closest(".search-box")) {
            resultsBox.style.display = "none";
        }
    });

});