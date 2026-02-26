document.addEventListener("DOMContentLoaded", function () {

  function handleForm(formId, feedbackId) {
    const form = document.getElementById(formId);
    const feedback = document.getElementById(feedbackId);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(form);

      fetch("/submit", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"  // Tell Flask we want JSON
        }
      })
      .then(res => res.json()) // parse JSON
      .then(data => {
        if (data.status === "success") {
          feedback.innerHTML = '<div class="flash-message success">Form submitted successfully!</div>';
          form.reset();
        } else {
          feedback.innerHTML = '<div class="flash-message error">Failed to submit form. Please try again.</div>';
        }
        setTimeout(() => feedback.innerHTML = '', 4000);
      })
      .catch(() => {
        feedback.innerHTML = '<div class="flash-message error">Failed to submit form. Please try again.</div>';
        setTimeout(() => feedback.innerHTML = '', 4000);
      });
    });
  }

  handleForm("questionForm", "questionFeedback");
  handleForm("newsletterForm", "newsletterFeedback");
});