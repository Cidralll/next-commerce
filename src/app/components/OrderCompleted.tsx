'use client';
import { userCartStore } from "@/store";
import { useEffect } from "react";

export default function OrderCompleted() {
    const cartStore = userCartStore();

    useEffect(() => {
        cartStore.setPaymentIntent("");
        cartStore.clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h1>Pedido concluído com sucesso!</h1>
            <button className="bg-teal-600 text-white py-2 px-4 rounded-md" onClick={() => {
                setTimeout(() => {
                    cartStore.setCheckout("cart");
                })
                cartStore.toggleCart()
            }}>
                Voltar para loja
            </button>
        </div>
    );
}