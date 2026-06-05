const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API Catastro SINIC V1.0 está en línea.');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor Backend corriendo en http://localhost:${port}`);
});
