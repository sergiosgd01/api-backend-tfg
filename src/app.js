const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('../mongo')

const userRoutes = require('./routes/user');
const organizationRoutes = require('./routes/organization');
const eventRoutes = require('./routes/event');
const locationRoutes = require('./routes/location');
const routeRoutes = require('./routes/route');
const serviceRoutes = require('./routes/service');
const serviceTypesRoutes = require('./routes/serviceTypes');
const rawLocation = require('./routes/rawLocation');
const eventControl = require('./routes/eventControl');

const app = express();

app.use(cors());  
app.use(express.json());  

app.use('/api/user', userRoutes);

app.use('/api/organizations', organizationRoutes);

app.use('/api/events', eventRoutes);

app.use('/api/locations', locationRoutes);

app.use('/api/route', routeRoutes);

app.use('/api/services', serviceRoutes);

app.use('/api/serviceTypes', serviceTypesRoutes);

app.use('/api/rawLocations', rawLocation);

app.use('/api/eventControl', eventControl);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
