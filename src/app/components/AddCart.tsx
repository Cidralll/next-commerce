'use client';
import { userCartStore } from "@/store";
import { ProductType } from "@/types/ProductType";

export default function AddCart({ product } : { product: ProductType }) {
    const { addProduct } = userCartStore();

    return (
        <button 
            className=" rounded-md bg-teal-600 text-white px-3.5 py-2.5 text-sm text-center"
            onClick={() => addProduct(product)}
        >
            Adicionar ao carrinho
        </button>
    );
}