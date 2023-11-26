import express, {Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {getOrders, patchEmployees, deleteOrder, postProduct } from './db_client.js';

const app = express();
const port = 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/customers/:customerId/orders', async (req: Request, res: Response) => {
    try {
        const customerId: number = Number(req.params.customerId);
        if (isNaN(customerId)){
            throw new Error("Not a Number");
        }
        else {
            try{
                const orders = await getOrders(customerId);

                if (orders.orders.length){
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
    } catch (error) {
        res.status(404).json({
            status: "Bad Request",
            tsError: error
        });
    }
});

app.patch('/employees/:employeeId', async (req: Request, res: Response) => {
    try {
        const employeeId: number = Number(req.params.employeeId);
        if (isNaN(employeeId)){
            throw new Error("Not a Number");
        }
        else {
            try{
                const employee = await patchEmployees(employeeId, req.body);
                res.status(200).send(employee);
            }
            catch (e) {
                res.status(404).json(e);
            }
        }

    } catch (error) {
        res.status(404).json({
            status: "Bad Request",
            tsError: error
        });
    }
});

app.delete('/orders/:orderId', async (req: Request, res: Response) => {
    try {
        const orderId: number = Number(req.params.orderId);
        if (isNaN(orderId)){
            throw new Error("Not a Number");
        }
        else {
            try{
                res.status(200).json(await deleteOrder(orderId));
            }
            catch (e) {
                res.status(404).json(e);
            }

        }
    } catch (error) {
        res.status(404).json({
            status: "Bad Request",
            tsError: error
        });
    }
});

app.post('/products', async (req: Request, res: Response) => {
    try {
        res.status(200).json(await postProduct(req.body));
    } catch (error) {
        res.status(404).json({
            status: "Invalid product category"
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
