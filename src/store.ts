import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductType } from "@/types/ProductType";

type CartState = {
    cart: ProductType[];
    addProduct: (product: ProductType) => void;
    removeProduct: (product: ProductType) => void;
    isOpen: boolean;
    toggleCart: () => void;
    clearCart: () => void;
    onCheckout: string;
    setCheckout: (checkot: string) => void;
    paymentIntent: string;
    setPaymentIntent: (paymentIntent: string) => void;
}

export const userCartStore = create<CartState>()(
    persist((set) => ({
        cart: [],
        addProduct: (item) =>
            set((state) => {
                const product = state.cart.find((p) => p.id === item.id); // Verifica se o produdo existe antes de adicionar
                if (product) { // Se existe no carrinho vai aumentar a quantidade
                    const updateCart = state.cart.map((p) => {
                        if (p.id === item.id) {
                            return {...p, quantity: p.quantity ? p.quantity + 1 : 1}
                        }
                        return p;
                    });
                    return { cart: updateCart }
                }else { // Se nao existe vai colocar a quantidade como 1
                    return { cart: [...state.cart, {...item, quantity: 1}] }
                }
            }),
        removeProduct: (item) =>
        set((state) => {
            const existingProduct = state.cart.find((p) => p.id === item.id); // Encontra o produdo para remover
            
            if (existingProduct && existingProduct.quantity! > 1) { // Quando o produto tem uma quantidade maior que 1
                const updatedCart = state.cart.map((p) => {
                    if (p.id === item.id) {
                        return {...p, quantity: p.quantity! - 1}
                    }
                    return p;
                });
                return { cart: updatedCart }
            }else { // Quando tem apenas um produto remove ele da lista
                const filterCart = state.cart.filter((p) => p.id !== item.id);
                return { cart: filterCart }
            }
        }),
        isOpen: false,
        toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
        clearCart: () => set(() => ({ cart: [] })),
        onCheckout: 'cart',
        setCheckout: (checkout) => set(() => ({ onCheckout: checkout })),
        paymentIntent: '',
        setPaymentIntent: (paymentIntent) => set(() => ({ paymentIntent })),
    }), {name: 'cart-storage'}
    )
);