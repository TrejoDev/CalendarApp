const { response } = require('express');
const Evento = require('../models/Events');

const getEventos = async ( req, res = response ) => {

    const eventos = await Evento.find()
                                .populate('user', 'name' );   // populate() para rellenar los datos del user //Especificar la ref a rellenar

   return res.status(201).json({
    ok: true,
    eventos,
    })
}

const crearEvento = async ( req, res = response ) => {

    //verificar que tengo el evento
    //console.log(req.body);

    const evento = new Evento( req.body );

    try {

        evento.user = req.uid;  //Asigno a evento.user el uid q viene en el token, el cual varia cuando se actualiza el token.
        
        const eventoGuardado = await evento.save();

        res.status(201).json({
            ok: true,
            evento: eventoGuardado  //Utiliza x defecto el serializador "toJSON" de los modelos.
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Hable con el admin'
        });
    }   
}

const updateEvento = async ( req, res = response ) => {

    const eventoID = req.params.id
    const uid = req.uid;

    try {
        const evento = await Evento.findById( eventoID );

        if( !evento ){            //Si el id no tiene el formato de Moongoose ni siquiera va a hacer la peticion a la DB, va directo al error. 
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            });
        };
                                                //Al loguear user se crea un token q lleva el uid de user, luego se crea el evento q lleva su id pero tambien un user: {_id: ...}
        if( evento.user.toString() !== uid ) {  //Si el id del usuario del evento es diferente al uid del usuario logueado, significa q es una persona diferente q quiere editar el evento de otra persona.
            return res.status(401).json({
                ok: false,
                msg: 'No tiene el privilegio de editar este evento'
            })
        };

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoID, nuevoEvento, { new: true } );

        return res.json({
            ok: true,
            evento: eventoActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Hable con el admin'
        });
    }
}

const eliminarEvento = async ( req, res = response ) => {

    const eventoID = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById( eventoID );

        if( !evento ){            
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            });
        };

        if( evento.user.toString() !== uid ) {  
            return res.status(401).json({
                ok: false,
                msg: 'No tiene el privilegio para eliminar este evento'
            })
        };

        await Evento.findByIdAndRemove( eventoID );

        return res.json({ ok: true });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Hable con el admin'
        });
    }
}

module.exports = {
    getEventos,
    crearEvento, 
    updateEvento,
    eliminarEvento,
}





