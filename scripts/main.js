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

const fields = {
  name: {
    input: form?.querySelector('input[name="name"]'),
    error: document.getElementById('error-name'),
    validate: (val) => (val.trim() ? '' : 'Name is required.')
  },
  email: {
    input: form?.querySelector('input[name="email"]'),
    error: document.getElementById('error-email'),
    validate: (val) => {
      if (!val.trim()) return 'Email is required.';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val.trim())) return 'Please enter a valid email address.';
      return '';
    }
  },
  message: {
    input: form?.querySelector('textarea[name="message"]'),
    error: document.getElementById('error-message'),
    validate: (val) => (val.trim() ? '' : 'Message is required.')
  }
};

let submissionAttempted = false;

function validateField(name) {
  const field = fields[name];
  if (!field || !field.input) return true;

  const errorMsg = field.validate(field.input.value);
  
  if (errorMsg) {
    field.input.classList.add('is-invalid');
    field.input.setAttribute('aria-invalid', 'true');
    field.input.setAttribute('aria-describedby', `error-${name}`);
    if (field.error) {
      field.error.textContent = errorMsg;
      field.error.hidden = false;
    }
    return false;
  } else {
    field.input.classList.remove('is-invalid');
    field.input.removeAttribute('aria-invalid');
    field.input.removeAttribute('aria-describedby');
    if (field.error) {
      field.error.textContent = '';
      field.error.hidden = true;
    }
    return true;
  }
}

if (form) {
  Object.keys(fields).forEach((name) => {
    fields[name].input?.addEventListener('input', () => {
      if (submissionAttempted) {
        validateField(name);
      }
    });
  });
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setFormMessage(null);

  submissionAttempted = true;
  let isValid = true;
  
  Object.keys(fields).forEach((name) => {
    if (!validateField(name)) {
      isValid = false;
    }
  });

  if (!isValid) {
    return;
  }

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
