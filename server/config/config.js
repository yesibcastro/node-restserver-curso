//==============================================
//Configurando puerto de desarrollo o produccion
//==============================================

process.env.PORT = process.env.PORT || 3000;

//================================================
//Entorno
//================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//================================================
//Vencimiento del token
//=================================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//================================================
//SEED de autenticación
//=================================================

process.env.SEED = process.env.SEED || 'este-es-el-de-desarrollo';
//================================================
//Base de datos
//=================================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
};

process.env.URLDB = urlDB;

//================================
//  Google Client ID
//================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '665027198195-cfc2r5i8bp31d8ibpovj4flppjrhhu8c.apps.googleusercontent.com';