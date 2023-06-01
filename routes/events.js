/* 
Rutas de eventos // events
host + /api/events
 */
const { Router } = require('express');
const { check } = require('express-validator');

const { getEventos, crearEvento, updateEvento, eliminarEvento } = require('../controllers/events');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate');

const router = Router();

//Todas tienen que pasar por la validacion del JWT
router.use( validarJWT );  //Todas las peticiones debajo de esta, deben validar JWT.
                           //Debajo privadas y x encima publicas
//Obtener eventos
router.get(
    '/',
    [ //middlewares
        
    ],  
     getEventos);

//Crear un nuevo evento
router.post(
    '/',    
    [
        check( 'title', 'El titulo es obligatorio' ).not().isEmpty(),
        check( 'start', 'La fecha de inicio es obligatoria' ).custom( isDate ),
        check( 'end', 'La fecha de finalizacion es obligatoria' ).custom( isDate ),
        validarCampos
    ],  
    crearEvento)

//Actualizar evento
router.put(
    '/:id',
    [
        check( 'title', 'El titulo es obligatorio' ).not().isEmpty(),
        check( 'start', 'La fecha de inicio es obligatoria' ).custom( isDate ),
        check( 'end', 'La fecha de finalizacion es obligatoria' ).custom( isDate ),
        validarCampos
    ],   
    updateEvento)

//Eliminar eventos
router.delete(
    '/:id',
    [

    ],   
    eliminarEvento)


module.exports = router;