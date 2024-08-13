const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/config');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();
const helmet = require('helmet');
//const csurf = require('csurf');

app.use(helmet());
//app.use(csurf());

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3307;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});

// Sincronizar la base de datos
sequelize.sync({ force: false })
    .then(() => {
        console.log('Tablas sincronizadas');
    })
    .catch(err => {
        console.error('Error al sincronizar las tablas:', err);
    });
