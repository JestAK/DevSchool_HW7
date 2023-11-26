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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_client_js_1 = require("./db_client.js");
const app = (0, express_1.default)();
const port = 5000;
app.get('/customers/:customerId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = Number(req.params.customerId);
        const customer = yield (0, db_client_js_1.getCustomers)(customerId);
        if (customer) {
            res.status(200).json(customer);
        }
        else {
            res.status(400).json({
                status: "Not exist"
            });
        }
    }
    catch (error) {
        res.json({
            status: "Bad Request",
            tsError: error
        });
    }
}));
app.get('/customers/:customerId/orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = Number(req.params.customerId);
        const customer = yield (0, db_client_js_1.getCustomers)(customerId);
        const orders = yield (0, db_client_js_1.getOrders)(customerId);
        if (customer) {
            if (orders.orders.length) {
                res.json(orders);
            }
            else {
                res.status(400).json({
                    status: "Not exist orders"
                });
            }
        }
        else {
            res.status(400).json({
                status: "Not exist customer"
            });
        }
    }
    catch (error) {
        res.json({
            status: "Bad Request",
            tsError: error
        });
    }
}));
app.patch('/employees/:employeeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employeeId = Number(req.params.employeeId);
        res.json(yield (0, db_client_js_1.patchEmployees)(employeeId));
    }
    catch (error) {
        res.json({
            status: "Bad Request",
            tsError: error
        });
    }
}));
app.delete('/orders/:orderId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = Number(req.params.orderId);
        res.json(yield (0, db_client_js_1.deleteOrder)(orderId));
    }
    catch (error) {
        res.json({
            status: "Bad Request",
            tsError: error
        });
    }
}));
app.post('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield (0, db_client_js_1.postProduct)());
    }
    catch (error) {
        res.json({
            status: "Bad Request",
            tsError: error
        });
    }
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
