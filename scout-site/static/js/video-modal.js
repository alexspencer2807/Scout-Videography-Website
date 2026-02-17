document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");
  const closeBtn = document.querySelector(".modal .close");

  if (!modal || !modalVideo) return; // allows pages without videos

  document.querySelectorAll(".video-card").forEach(card => {
    card.addEventListener("click", () => {
      const videoSrc = card.dataset.video;
      modalVideo.querySelector("source").src = videoSrc;
      modalVideo.load();
      modalVideo.play();
      modal.style.display = "flex";
    });
  });

  function closeModal() {
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modal.style.display = "none";
  }

  closeBtn.addEventListener("click", closeModal);

  window.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
});
