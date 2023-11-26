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
const body_parser_1 = __importDefault(require("body-parser"));
const db_client_js_1 = require("./db_client.js");
const app = (0, express_1.default)();
const port = 5000;
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
app.get('/customers/:customerId/orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = Number(req.params.customerId);
        if (isNaN(customerId)) {
            throw new Error("Not a Number");
        }
        else {
            try {
                const orders = yield (0, db_client_js_1.getOrders)(customerId);
                if (orders.orders.length) {
                    res.status(200).json(orders);
                }
                else {
                    res.status(404).json({
                        status: "Customer with such id has no orders"
                    });
                }
            }
            catch (e) {
                res.status(404).json(e);
            }
        }
    }
    catch (error) {
        res.status(404).json({
            status: "Bad Request",
            tsError: error
        });
    }
}));
app.patch('/employees/:employeeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employeeId = Number(req.params.employeeId);
        if (isNaN(employeeId)) {
            throw new Error("Not a Number");
        }
        else {
            try {
                const employee = yield (0, db_client_js_1.patchEmployees)(employeeId, req.body);
                res.status(200).send(employee);
            }
            catch (e) {
                res.status(404).json(e);
            }
        }
    }
    catch (error) {
        res.status(404).json({
            status: "Bad Request",
            tsError: error
        });
    }
}));
app.delete('/orders/:orderId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = Number(req.params.orderId);
        if (isNaN(orderId)) {
            throw new Error("Not a Number");
        }
        else {
            try {
                res.status(200).json(yield (0, db_client_js_1.deleteOrder)(orderId));
            }
            catch (e) {
                res.status(404).json(e);
            }
        }
    }
    catch (error) {
        res.status(404).json({
            status: "Bad Request",
            tsError: error
        });
    }
}));
app.post('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield (0, db_client_js_1.postProduct)(req.body));
    }
    catch (error) {
        res.status(404).json({
            status: "Invalid product category"
        });
    }
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
