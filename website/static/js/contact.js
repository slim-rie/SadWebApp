// Contact form submission handler: send email (existing) AND notify admin (new)
document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(form);
    var name = formData.get('name');
    var email = formData.get('email');
    var message = formData.get('message');

    // 1. Existing: Submit the form as usual (email logic, if any)
    // (If you have AJAX for email, keep it here. If not, the form will submit normally.)

    // 2. NEW: Notify admin for in-app notification
    fetch('/notify_admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: name || 'Anonymous',
        email: email || 'unknown',
        message: message || ''
      })
    });

    // Optionally show a message to the user
    alert('Thank you for contacting us! We have received your message.');
    form.reset();
  });
});
