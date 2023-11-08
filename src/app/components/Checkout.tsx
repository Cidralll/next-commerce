'use client';
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { userCartStore } from "@/store";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout() {
    const cartStore = userCartStore();
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (clientSecret) {
            return; // Evita a execução adicional
        }

        if (cartStore.cart.length > 0 && !cartStore.paymentIntent) {    
            console.log('Exec')
            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    items: cartStore.cart,
                    payment_intend_id: cartStore.paymentIntent
                })
            }).then((res) => { return res.json() }).then((data) => {
                cartStore.setPaymentIntent(data.paymentIntent.id);
                setClientSecret(data.paymentIntent?.client_secret);
            })
        }
    },[cartStore, clientSecret]);

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: 'night',
            labels: 'floating'
        }
    }

    return (
        <div>
            {
                clientSecret ? (
                    <>
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm clientSecret={clientSecret} />
                        </Elements>
                    </>
                ) : (
                    <div>
                        <h1>Carregando...</h1>
                    </div>
                )
            }
        </div>
    );
}