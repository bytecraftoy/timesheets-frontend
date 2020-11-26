const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 3000);

console.log(`Listening on port ${process.env.PORT || 3000}`)
console.log(`Backend URL: ${process.env.REACT_APP_BACKEND_URL}`)
