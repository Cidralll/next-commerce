export const formatPrice = (price: number | null) => {
    if (!price) return "R$ 00,00";

    return new Intl.NumberFormat("pr-BR", {
        style: "currency",
        currency: "BRL"
    }).format(price / 100);
}