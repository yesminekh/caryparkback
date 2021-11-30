const express = require("express");
const app = express();

const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const config = require("./config.json");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//we want to be informed whether mongoose has connected to the db or not 
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(
        () => {
            console.log("Connecté a la base de données");
        },
        (err) => {
            console.log("Connexion a la base de données echouée", err);
        }
    );

const userRoute = require("./routes/user-route");
const parkingRoute = require("./routes/parking-route");
const placeRoute = require("./routes/place-route");
const reservationRoute = require("./routes/reservation-route");

app.use("/api/user", userRoute);
app.use("/api/parking", parkingRoute);
app.use("/api/place", placeRoute);
app.use("/api/reservation", reservationRoute);

if (process.env.NODE_ENV === "production") {
    console.log("app in production mode");
    app.use(express.static("client/build"));
    app.get("/*", function (req, res) {
        res.sendFile(
            path.join(__dir, "client", "build", "index.html"),
            function (err) {
                if (err) res.status(500).send(err);
            }
        );
    });
}

app.listen(port, () => console.log(`Server up and running on port ${port} !`));