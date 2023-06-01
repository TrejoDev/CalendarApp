const moment = require("moment"); //Library q ayuda a validar fechas.

const isDate = ( value, /* { req, location, path } */ ) => {
    /* console.log(value);
    console.log( req, location, path ); */

    if( !value ){
        return false;
    }

    const fecha = moment( value );
    if( fecha.isValid() ){
        return true;
    } else {
        return false;
    }
}

module.exports = { isDate };