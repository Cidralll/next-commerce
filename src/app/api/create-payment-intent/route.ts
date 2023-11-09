import { auth } from "@clerk/nextjs";
import { stripe } from "@/lib/stripe";
import { ProductType } from "@/types/ProductType";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const calculateOrderAmount = (items: ProductType[]) => {
    const totalPrice = items.reduce((acc, item) => {
        return acc + item.price! * item.quantity!
    }, 0)
    return totalPrice;
}

export async function POST(req:Request) {
    const {userId} = auth();
    const { items, payment_intent_id } = await req.json();

    if (!userId) {
        return new Response("Unauthorized", { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
        where: { externalId: userId }
    });

    if (!currentUser) {
        return new Response("User not found", { status: 404 })
    }

    const total = calculateOrderAmount(items);

    const orderData = {
        user: { connect: { id: currentUser.id } },
        amount: total,
        currency: 'brl',
        status: 'pending',
        paymentIntentID: payment_intent_id,
        products: {
            create: items.map((item: ProductType) => ({
                name: item.name,
                description: item.description,
                quantity: item.quantity,
                price: item.price,
                image: item.image
            }))
        }
    }

    if (payment_intent_id) {
        const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

        if (payment_intent_id) {
            const update_intent = await stripe.paymentIntents.update(payment_intent_id, {
                amount: total
            });

            const [existing_order, update_order] = await Promise.all([
                prisma.order.findFirst({
                    where: { paymentIntentID: payment_intent_id },
                    include: { products: true }
                }),
                prisma.order.update({
                    where: { paymentIntentID: payment_intent_id },
                    data: {
                        amount: total,
                        products: {
                            deleteMany: {},
                            create: items.map((item: ProductType) => ({
                                name: item.name,
                                description: item.description,
                                quantity: item.quantity,
                                price: item.price,
                                image: item.image
                            })) 
                        }
                    }
                })
            ]);

            if (!existing_order) {
                return new Response("Order not found", {status: 404});
            }

            return NextResponse.json({ paymentIntent: update_intent }, { status: 200});
        }
    }else {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: 'brl',
            automatic_payment_methods: { enabled: true }
        });

        orderData.paymentIntentID = paymentIntent.id;

        const newOrder = await prisma.order.create({
            data: orderData
        });

        return NextResponse.json({ paymentIntent }, { status: 200});
    }
}