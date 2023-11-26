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
exports.postProduct = exports.deleteOrder = exports.patchEmployees = exports.getOrders = exports.getCustomers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function getCustomers(customerId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.$connect();
        const customer = yield prisma.customers.findUnique({
            where: {
                id: customerId
            }
        });
        yield prisma.$disconnect();
        return customer;
    });
}
exports.getCustomers = getCustomers;
//Function to return formated order data
function getOrders(customerId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.$connect();
        //Get raw data from order
        const orders = yield prisma.orders.findMany({
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
        let processedOrders = [];
        let totalCostOfAllOrders = 0;
        //Format raw data and write to temporary variables
        orders.forEach((order) => {
            let costOfOrder = 0;
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
            totalCost: Number(totalCostOfAllOrders.toFixed(2))
        };
        yield prisma.$disconnect();
        return orderAnswer;
    });
}
exports.getOrders = getOrders;
function patchEmployees(employeeId, reqBody) {
    return __awaiter(this, void 0, void 0, function* () {
        const employee = yield prisma.employees.update({
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
    });
}
exports.patchEmployees = patchEmployees;
function deleteOrder(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        const productsOnOrder = yield prisma.productsOnOrders.deleteMany({
            where: {
                ordersId: orderId
            }
        });
        const order = yield prisma.orders.delete({
            where: {
                id: orderId
            }
        });
        return order;
    });
}
exports.deleteOrder = deleteOrder;
function postProduct(reqBody) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield prisma.products.create({
            data: {
                name: reqBody.name,
                category: reqBody.category,
                amount: reqBody.amount,
                price: reqBody.price
            }
        });
    });
}
exports.postProduct = postProduct;
