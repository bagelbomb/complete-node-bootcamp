import axios from 'axios';
import { showAlert } from './alerts';

// TODO: install stripe with npm instead of using script tag?

export const bookTour = async tourId => {
  try {
    const stripe = Stripe(
      'pk_test_51NkX3bHpCjIYpA1vAIovketvoScVip7ooIWAYbnmpvj5TRHysYZoOdrGQ9skT2LybmHLtZJMfgbEWiHXgDLrwJCN00m1VGeYOx'
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
