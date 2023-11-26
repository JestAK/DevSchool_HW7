"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
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
        const customer = yield prisma.customers.create({
            data: {
                first_name: "Bob",
                last_name: "Johnson",
                email: "test1@gmail.com",
                birth_date: new Date("2023-11-26"),
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
                                            name: "Lvivske Rizdvyane",
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
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
