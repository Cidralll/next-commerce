'use client';
import { userCartStore } from "@/store";
import { useEffect } from "react";

export default function Checkout() {
    const cartStore = userCartStore();

    useEffect(() => {
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
            console.log(data.paymentIntent)
        })
    },[cartStore.cart, cartStore.paymentIntent]);

    return (
        <div>
            <h1>Checkout</h1>
        </div>
    );
}