const express = require('express');
const Joi = require('joi');
const app = express();

// Middleware for parsing JSON request bodies
app.use(express.json());

// Sample customers data
const customers = [
    { title: 'George', id: 1 },
    { title: 'Josh', id: 2 },
    { title: 'Tyler', id: 3 },
    { title: 'Alice', id: 4 },
    { title: 'Candice', id: 5 }
];

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to Vinays REST API');
});

// Route for getting all customers
app.get('/api/customers', (req, res) => {
    res.send(customers);
});

// Route for getting a specific customer by ID
app.get('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;"> Oops.. Cant find what you are looking for!</h2>');
    res.send(customer);
});

// Route for adding a new customer
app.post('/api/customers', (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const customer = {
        id: customers.length + 1,
        title: req.body.title
    };
    customers.push(customer);
    res.send(customer);
});

app.put('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;"> Oops.. Cant find what you are looking for!</h2>');

    const { error } = validateCustomer(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    customer.title = req.body.title;
    res.send(customer);
});

app.delete('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;"> Oops.. Cant find what you are looking for!</h2>');

    const index = customers.indexOf(customer);
    customers.splice(index, 1);

    res.send(customer);
});

// Function to validate customer data
function validateCustomer(customer) {
    const schema = Joi.object({
        title: Joi.string().min(3).required()
    });
    return schema.validate(customer);
}

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
