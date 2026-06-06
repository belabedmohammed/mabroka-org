const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('form-submit');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error');

const formspreeId = import.meta.env.VITE_FORMSPREE_ID;

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  nav?.classList.toggle('is-open');
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  });
});

function setFormMessage(type) {
  formSuccess.hidden = type !== 'success';
  formError.hidden = type !== 'error';
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setFormMessage(null);

  if (!formspreeId) {
    console.warn('Set VITE_FORMSPREE_ID in .env to enable form delivery.');
    setFormMessage('error');
    formError.textContent =
      'Contact form is not configured yet. Add your Formspree ID to enable submissions.';
    return;
  }

  const formData = new FormData(form);
  if (formData.get('_gotcha')) {
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Form submission failed');
    }

    form.reset();
    setFormMessage('success');
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch {
    setFormMessage('error');
    formError.textContent =
      'Something went wrong. Please try again or email us directly.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send message';
  }
});
