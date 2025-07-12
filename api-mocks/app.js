const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const mockRoutes = require('./routes/mockRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(bodyParser.json());

const file = path.join(__dirname, 'data', 'mocks.json');
if (!fs.existsSync(file)) fs.writeFileSync(file, '[]', 'utf8');

app.use('/', mockRoutes);
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Mock API funcionando en http://localhost:${PORT}`);
});
