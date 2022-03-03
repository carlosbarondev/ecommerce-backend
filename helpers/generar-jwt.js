const jwt = require('jsonwebtoken');


const generarJWT = (uid, nombre, correo, rol, img, estado) => {

    return new Promise((resolve, reject) => {

        const payload = { uid, nombre, correo, rol, img, estado };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '1h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el token')
            } else {
                resolve(token);
            }
        })

    })
}


module.exports = {
    generarJWT
}