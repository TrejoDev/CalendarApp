const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async( req, res = response ) => {  //Recomendacion para obtener el tipado gracias al intellisense

    const { email, password } = req.body;

    try {
        
        let usuario = await Usuario.findOne({ email });
        
        if( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Un usario ya existe con ese correo',
            })
        }

        usuario = new Usuario( req.body );

        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();     //Metodo sincrono
        usuario.password = bcryptjs.hashSync( password, salt )
    
        await usuario.save();

        //Generar el JWT
        const token = await generarJWT( usuario.id, usuario.name );
    
        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin  '
        })
    }
};

const loginUsuario = async( req, res = response  ) => {     

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });
        
        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email',
            })
        }
       //Confirmar los password
        const validPassword = bcryptjs.compareSync( password, usuario.password );  //comprueba el user password, return true or false. 
        
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        };

        //Generar el JWT
        const token = await generarJWT( usuario.id, usuario.name );

        return res.json({
            ok: true,
            uid: usuario.id, 
            name: usuario.name, 
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin  '
        })
    }

};

const revalidarToken = async( req, res = response ) => {

    const { uid, name } = req

    //Generar un nuevo JWT y regresarlo en esta peticion.
    const token = await generarJWT( uid, name );
    
    return res.json({
        ok: true,
        uid, name,
        token
    })
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
};