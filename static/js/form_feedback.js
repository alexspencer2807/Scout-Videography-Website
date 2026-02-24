document.addEventListener("DOMContentLoaded", function () {

  // Helper function for AJAX form submit
  function handleForm(formId, feedbackId) {
    const form = document.getElementById(formId);
    const feedback = document.getElementById(feedbackId);

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(form);

      fetch("/submit", {
        method: "POST",
        body: formData
      })
      .then(res => {
        if (res.ok) {
          feedback.innerHTML = '<div class="success">Form submitted successfully!</div>';
          form.reset();
        } else {
          feedback.innerHTML = '<div class="error">Failed to submit form. Please try again.</div>';
        }

        setTimeout(() => {
          feedback.innerHTML = '';
        }, 4000);
      })
      .catch(() => {
        feedback.innerHTML = '<div class="error">Failed to submit form. Please try again.</div>';
        setTimeout(() => {
          feedback.innerHTML = '';
        }, 4000);
      });
    });
  }

  handleForm("questionForm", "questionFeedback");
  handleForm("newsletterForm", "newsletterFeedback");

});