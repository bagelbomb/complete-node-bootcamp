export const hideAlert = () => {
  const el = document.querySelector('.alert');

  if (el) {
    el.parentElement.removeChild(el);
  }
};

// type is either 'success' or 'error'
export const showAlert = (type, message, time = 6) => {
  hideAlert();

  const html = `<div class="alert alert--${type}">${message}</div>`;

  document.querySelector('body').insertAdjacentHTML('afterbegin', html);

  window.setTimeout(hideAlert, time * 1000);
};
