const express = require('express');
const app_old = express();
const port = 5000;
const {getCustomers, patchEmployees, deleteOrder, postProduct} = require('../db_client.ts');

app_old.get('/customers/:customerId/orders', async (req, res) => {
    try {
        const customerId = Number(req.params.customerId);
        res.send(`${await getCustomers(customerId)}`);
    }
    catch (e){
        res.send(e.message);
    }
})

app_old.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})