const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Tüm proje kökünü statik olarak sun
app.use(express.static(path.join(__dirname)));

// Ana sayfa yönlendirmesi
app.get('/', (req, res) => {
  res.redirect('/c/index.html');
});

app.listen(PORT, () => {
  console.log(`ElciKMP-DataPad ${PORT} portunda çalışıyor`);
});