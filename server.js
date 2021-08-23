const express = require("express");
const app = express();

const PORT = process.env.PORT || 9200;

app.get("/", (req, res) => {
	res.json("Welcome to employee tracker app!");
});
app.listen(PORT, () => {
	console.log(`Now listening on url http://localhost:${PORT}`);
});
