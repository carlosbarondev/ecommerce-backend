const { response } = require("express");

// This is your test secret API key.
const stripe = require("stripe")('sk_test_51JjACUBNBMvlMZgl5cp6YRDwCft9FDz0LRSmSMI1VH3T3iVROPEucjmcab8zCxIKMN05cm1GOeqfkEtorXkxqn4R00PucrBI4X');


const calculateOrderAmount = (items) => {

    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return items.reduce((n, { unidades, producto }) => n + unidades * producto.precio, 0).toFixed(2) * 100;

};

/*const mostrarPago = async (req, res = response) => {

    // Lookup the payment methods available for the customer
    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
    });

    try {
        // Charge the customer and payment method immediately
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1099,
            currency: "eur",
            customer: customerId,
            payment_method: paymentMethods.data[0].id,
            off_session: true,
            confirm: true,
        });
    } catch (err) {
        // Error code will be authentication_required if authentication is needed
        console.log("Error code is: ", err.code);
        const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
        console.log("PI retrieved: ", paymentIntentRetrieved.id);
    }

};*/

const crearPago = async (req, res = response) => {

    const { id } = req.params;
    const { correo, direccion, items } = req.body;

    // Alternatively, set up a webhook to listen for the payment_intent.succeeded event
    // and attach the PaymentMethod to a new Customer
    let customer;
    try { // Si el cliente ya esta registrado se cargan sus datos
        customer = await stripe.customers.retrieve(id);
    } catch (err) {
        console.log("Error: ", err.message);
    }

    if (!customer) { // Si el cliente no esta registrado se crea
        customer = await stripe.customers.create({
            id: id,
            address: direccion.facturacion,
            email: correo,
            name: direccion.nombre,
            phone: direccion.telefono,
            shipping: {
                address: {
                    city: direccion.direccion.poblacion,
                    country: direccion.direccion.pais,
                    line1: direccion.direccion.calle,
                    line2: direccion.direccion.numero,
                    postal_code: direccion.direccion.codigo,
                    state: direccion.direccion.provincia
                },
                name: direccion.nombre,
                phone: direccion.telefono
            }
        });
    } else {
        customer = await stripe.customers.update(id, {
            address: {
                city: direccion.facturacion.poblacion,
                country: direccion.facturacion.pais,
                line1: direccion.facturacion.calle,
                line2: direccion.facturacion.numero,
                postal_code: direccion.facturacion.codigo,
                state: direccion.facturacion.provincia
            },
            email: correo,
            name: direccion.nombre,
            phone: direccion.telefono,
            shipping: {
                address: {
                    city: direccion.direccion.poblacion,
                    country: direccion.direccion.pais,
                    line1: direccion.direccion.calle,
                    line2: direccion.direccion.numero,
                    postal_code: direccion.direccion.codigo,
                    state: direccion.direccion.provincia
                },
                name: direccion.nombre,
                phone: direccion.telefono
            }
        });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        customer: customer.id,
        setup_future_usage: "off_session",
        amount: calculateOrderAmount(items),
        currency: "eur",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });

};

module.exports = {
    crearPago,
    // mostrarPago
}