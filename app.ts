import express, {Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { getCustomers, getOrders, patchEmployees, deleteOrder, postProduct } from './db_client.js';

const app = express();
const port = 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/customers/:customerId', async (req: Request, res: Response) => {
    try {
        const customerId: number = Number(req.params.customerId);
        const customer = await getCustomers(customerId);

        if (customer){
            res.status(200).json(customer);
        }
        else {
            res.status(400).json({
                status: "Not exist"
            });
        }

    } catch (error) {
        res.json({
            status: "Bad Request",
            tsError: error
        });
    }
});

app.get('/customers/:customerId/orders', async (req: Request, res: Response) => {
    try {
        const customerId: number = Number(req.params.customerId);
        const customer = await getCustomers(customerId);
        const orders = await getOrders(customerId);

        if (customer){
            if (orders.orders.length){
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
    } catch (error) {
        res.json({
            status: "Bad Request",
            tsError: error
        });
    }
});

app.patch('/employees/:employeeId', async (req: Request, res: Response) => {
    try {
        const employeeId: number = Number(req.params.employeeId);
        const employee = await patchEmployees(employeeId, req.body);
        res.status(200).send(employee);
    } catch (error) {
        res.json({
            status: "Bad Request",
            tsError: error
        });
    }
});

app.delete('/orders/:orderId', async (req: Request, res: Response) => {
    try {
        const orderId: number = Number(req.params.orderId);
        res.json(await deleteOrder(orderId));
    } catch (error) {
        res.json({
            status: "Bad Request",
            tsError: error
        });
    }
});

app.post('/products', async (req: Request, res: Response) => {
    try {
        res.json(await postProduct(req.body));
    } catch (error) {
        res.json({
            status: "Bad Request",
            tsError: error
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
