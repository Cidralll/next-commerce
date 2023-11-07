import { formatPrice } from "@/lib/utils";
import { userCartStore } from "@/store";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type CheckoutButtonProps = {
    totalPrice: number
}

export default function CheckoutButton({ totalPrice }: CheckoutButtonProps) {
    const cartStore = userCartStore();
    const { user } = useUser();
    const router = useRouter();

    const handleCheckout = async () => {
        if (!user) {
            cartStore.toggleCart();
            router.push(`/sign-in?redirectUrl=/`);
            return;
        }
        cartStore.setCheckout('checkout');

    }
    
    return (
        <div>
                <p className="text-teal-600 font-bold">Total: {formatPrice(totalPrice)}</p>
                    <button
                        className="w-full rounded-md bg-teal-600 text-white py-2 mt-2"
                        onClick={() => handleCheckout()}
                    >
                        Finalizar compra
                </button>
            </div>
    );
}