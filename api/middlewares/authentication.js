const jwt = require('jsonwebtoken');

let checkAuth = (req, res, next) => {

    let token = req.get('token'); // extrae del header de la request el token 

    // verifica si el token obtenido es válido (autenticidad) - se le debe colocar la clave de encriptación para desencriptarlo
    jwt.verify(token, "securePasswordHere", (err, decoded) => {
        
        // si no se verifica el token 
        if (err){
            return res.status(401).json({
              status: "error",
              error: err  
            });
        }

        req.userData = decoded.userData; // se le agrega a req el objeto "userData" contenido en el token

        next();

    });

}

module.exports = {checkAuth}