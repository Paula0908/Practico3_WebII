module.exports = app => {
    require('./auth.routes')(app);
    require('./sorteo.routes')(app);
    require('./public.routes')(app);
};