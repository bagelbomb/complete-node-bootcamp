import axios from 'axios';
import { showAlert } from './alerts';

// TODO: install stripe with npm instead of using script tag?

export const bookTour = async tourId => {
  try {
    // TODO: move this into config.env?
    const stripe = Stripe(
      ''
    );

    const res = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    await stripe.redirectToCheckout({
      sessionId: res.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
