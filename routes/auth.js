/* 
    Rutas de usuarios // auth
    host + /api/auth
 */
const { Router } = require('express'); //No vuelve a cargar la libreria, usa la misma q ya tiene en memoria.
const { check } = require('express-validator');  //Middleware q se encarga de validar un campo en particular.

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();


const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth') 

router.post(
     '/new',                    //El  nombre a los endpoints es totalmente opcional
     [ //middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos,
     ],
      crearUsuario ); 

router.post( 
    '/',
    [
        check('email', 'El email es obligatorio' ).isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario );

router.get( '/renew', validarJWT, revalidarToken );

module.exports = router;  //Exportacion en node