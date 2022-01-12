const { response } = require("express");

// This is your test secret API key.
const stripe = require("stripe")('sk_test_51JjACUBNBMvlMZgl5cp6YRDwCft9FDz0LRSmSMI1VH3T3iVROPEucjmcab8zCxIKMN05cm1GOeqfkEtorXkxqn4R00PucrBI4X');


const calculateOrderAmount = (items) => {

    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return parseFloat((Math.round((items.reduce((n, { unidades, producto }) => n + unidades * producto.precio * 100, 0) * 1000) / 10) / 100).toFixed(2));

};

const mostrarUsuario = async (req, res = response) => {

    const { id } = req.params;

    try {

        customer = await stripe.customers.retrieve(id);

        res.send({
            customer
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: error.message
        });
    }

}

const mostrarPago = async (req, res = response) => {

    const { payment_intent } = req.params;

    try {

        const paymentIntent = await stripe.paymentIntents.retrieve(
            payment_intent
        );

        res.send({
            paymentIntent
        });

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }

}

const crearPago = async (req, res = response) => {

    const { id } = req.params;
    const { correo, direccion, items } = req.body;

    // Alternatively, set up a webhook to listen for the payment_intent.succeeded event
    // and attach the PaymentMethod to a new Customer
    let customer;

    try { // Si el cliente ya esta registrado se cargan sus datos

        customer = await stripe.customers.retrieve(id);

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
        } else { // El cliente existe y se actualiza con los datos del envio
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

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: error.message
        });
    }

};

module.exports = {
    mostrarUsuario,
    mostrarPago,
    crearPago,
}