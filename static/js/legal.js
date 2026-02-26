document.addEventListener("DOMContentLoaded", function () {

  const modal = document.getElementById("legalModal");
  const textContainer = document.getElementById("legalText");
  const closeBtn = document.querySelector(".legal-close");

  const legalContent = {
    privacy: `
      <h1>Privacy Policy</h1>
      <h2>Information We Collect</h2>
      <p>We collect information submitted through booking and contact forms.</p>
      <h2>How We Use Information</h2>
      <p>Information is used to process bookings and improve services.</p>
      <h2>Data Protection</h2>
      <p>We do not sell or distribute personal information.</p>
    `,
    accessibility: `
      <h1>Accessibility Statement</h1>
      <p>We are committed to ensuring digital accessibility for all users.</p>
    `,
    terms: `
      <h1>Terms & Conditions</h1>
      <p>By using this website, you agree to our terms and policies.</p>
    `,
    refund: `
      <h1>Refund Policy</h1>
      <p>Refunds are subject to contract terms and booking agreements.</p>
    `
  };

  document.querySelectorAll("[data-legal]").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const type = this.getAttribute("data-legal");
      textContainer.innerHTML = legalContent[type];
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

});