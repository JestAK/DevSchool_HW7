import { PrismaClient } from '@prisma/client'
import { ProductCategory } from '@prisma/client';

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


export async function patchEmployees(employeeId: number, reqBody: any) {
    const employee = await prisma.employees.update({
        where: {
            id: employeeId
        },
        data: {
            first_name: reqBody.firstName,
            last_name: reqBody.lastName,
            middle_name: reqBody.middleName,
            position: reqBody.position
        }
    });

    return employee;
}


export async function deleteOrder(orderId: number) {
    const productsOnOrder = await prisma.productsOnOrders.deleteMany({
        where: {
            ordersId: orderId
        }
    });

    const order = await prisma.orders.delete({
        where: {
            id: orderId
        }
    });

    return order;
}

type ProductType = {
    name: string,
    category: ProductCategory,
    amount: number,
    price: number
}
export async function postProduct(reqBody: ProductType) {
    const product = await prisma.products.create({
        data: {
            name: reqBody.name,
            category: reqBody.category,
            amount: reqBody.amount,
            price: reqBody.price
        }
    });
}
