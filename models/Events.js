const { Schema, model } = require('mongoose');

const EventoSchema = Schema({

    title: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    start: {
        type: Date, 
        required: true
    },
    end: {
        type: Date, 
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,  //Dice a Mongoose q va a hacer una referencia.
        ref: 'Usuario',                //Especificamos la ref 
        required: true
    }
    
});

EventoSchema.method( 'toJSON', function () {       //Sobrescribimos el comportamiento del serializador "toJSON"  //Utilizamos la keyword function para hacer referencia al dist
    const { __v, _id, ...object } = this.toObject();   //Referencia al objeto que se esta serializando, da accseso a cada una de las properties de el objeto.
    object.id = _id;                 // object: { tiene todas las propiedades excepto __v y _id } y agrego la propiedad object: { id: _id, ... }               
    return object;
} ) 

module.exports = model('Evento', EventoSchema);