import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getCustomers(customerId: number) {
    await prisma.$connect();
    const customer = await prisma.customers.findUnique({
        where: {
            id: customerId
        }
    });
    await prisma.$disconnect();
    return customer;
}

//Function to return formated order data
export async function getOrders(customerId: number) {
    await prisma.$connect();

    //Get raw data from order
    const orders = await prisma.orders.findMany({
        where: {
            customersId: customerId
        },
        include: {
            ProductsOnOrders: {
                include: {
                    product: true
                }
            }
        }
    });

    //Intermediate variables
    let processedOrders: object[] = [];
    let totalCostOfAllOrders: number = 0

    //Format raw data and write to temporary variables
    orders.forEach((order) =>{
        let costOfOrder  = 0;
        order.ProductsOnOrders.forEach((product) => {
            costOfOrder += product.product.price * product.orderedAmount;
        });
        costOfOrder += order.deliveryCost;
        costOfOrder = Number(costOfOrder.toFixed(2));
        totalCostOfAllOrders += costOfOrder;

        //Push formated orders
        processedOrders.push({
            id: order.id,
            customerId: order.customersId,
            employeeId: order.employeesId,
            address: order.orderAddress,
            deliveryCost: order.deliveryCost,
            orderDate: order.orderDate,
            totalCost: costOfOrder
        });
    });


    //Format whole response
    const orderAnswer = {
        orders: processedOrders,
        totalCost: Number(totalCostOfAllOrders.toFixed(2
        ))
    };

    await prisma.$disconnect();
    return orderAnswer;
}


export async function patchEmployees(employeeId: number) {
    const employee
}


export async function deleteOrder(orderId: number) {

}


export async function postProduct() {

}