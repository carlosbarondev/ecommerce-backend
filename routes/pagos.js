const { Router } = require('express');

const { pago } = require('../controllers/pagos');


const router = Router();

router.post("/create-payment-intent", pago);

module.exports = router;