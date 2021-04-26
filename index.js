require('dotenv').config(); // read environment variables from .env file
const express = require('express');
const cors = require('cors'); // middleware to enable CORS (Cross-Origin Resource Sharing)
const app = express();
const port = process.env.PORT || 8080; // if not defined, use port 8080
const host = process.env.HOST || '0.0.0.0'; // if not defined, localhost
app.use(cors()); //enable ALL CORS requests (client requests from other domain)
app.use(express.json()); //enable parsing JSON body data
// root route -- /api/
app.get('/', function (req, res) {
    res.status(200).json({ message: 'home -- TSIW api' });
});
// routing middleware for resource TUTORIALS


app.use('/propostas', require('./routes/propostas.routes.js'))
// app.use('/candidaturas', require('./routes/candidaturas.routes.js'))
// app.use('/foruns', require('./routes/foruns.routes.js'))
// app.use('/notificacoes', require('./routes/notificacoes.routes.js'))
// app.use('/candidaturas', require('./routes/candidaturas.routes.js'))
// app.use('/entrevistas', require('./routes/entrevistas.routes.js'))
// app.use('/users', require('./routes/users.routes.js'))

// handle invalid routes
app.get('*', function (req, res) {
    res.status(404).json({ message: 'Path not found' });
})
app.listen(port, host, () => console.log(`App listening at http://${host}:${port}/`));