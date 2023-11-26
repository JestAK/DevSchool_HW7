import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // const orders = await prisma.orders.create({
    //     data: {
    //         employee: {
    //             connect: {
    //                 id: 3
    //             }
    //         },
    //         customer: {
    //             connect: {
    //                 id: 1
    //             }
    //         },
    //         orderAddress: "Kyiv",
    //         deliveryCost: 6.9,
    //         ProductsOnOrders: {
    //             create: {
    //                 product: {
    //                     create: {
    //                         name: "PS5",
    //                         category: "Technique",
    //                         amount: 500,
    //                         price: 19999.99
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // });
    //
    // console.log(orders);


    const customer = await prisma.customers.create({
        data: {
            first_name: "Bob",
            last_name: "Johnson",
            email: "test2@gmail.com",
            birth_date: new Date("2023-11-27"),
            Orders: {
                create: [
                    {
                        employee: {
                            create: {
                                first_name: "Name",
                                last_name: "Last Name",
                                position: "Seller"
                            }
                        },
                        orderAddress: "Kyiv",
                        deliveryCost: 6.7,
                        ProductsOnOrders: {
                            create: {
                                product: {
                                    create: {
                                        name: "Something",
                                        category: "Drink",
                                        amount: 1000,
                                        price: 24.99
                                    }
                                },
                                orderedAmount: 20
                            }
                        }
                    }
                ]
            }
        },
        include: {
            Orders: {
                include: {
                    employee: true,
                    ProductsOnOrders: {
                        include: {
                            product: true
                        }
                    }
                }
            }
        }
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })