import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const alertMessage = document.querySelector('body').dataset.alert;

if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', async e => {
    e.preventDefault();

    const saveSettingsBtn = document.querySelector('.btn--save-data');

    saveSettingsBtn.textContent = 'Updating settings...';

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    // TODO: reflect to the user that a photo has been selected (like changing the label text to the filename)

    await updateSettings(form, 'data');

    saveSettingsBtn.textContent = 'Save settings';
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();

    const savePasswordBtn = document.querySelector('.btn--save-password');
    const currentPasswordField = document.getElementById('password-current');
    const newPasswordField = document.getElementById('password');
    const newPasswordConfirmField = document.getElementById('password-confirm');

    savePasswordBtn.textContent = 'Updating password...';

    await updateSettings(
      {
        currentPassword: currentPasswordField.value,
        newPassword: newPasswordField.value,
        newPasswordConfirm: newPasswordConfirmField.value,
      },
      'password'
    );

    savePasswordBtn.textContent = 'Save password';
    currentPasswordField.value = '';
    newPasswordField.value = '';
    newPasswordConfirmField.value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Loading...'
    
    const { tourId } = e.target.dataset;

    bookTour(tourId);
  });
}

if (alertMessage) {
  showAlert('success', alertMessage, 20);
}

// TODO: update/replace Parcel/Babel?
