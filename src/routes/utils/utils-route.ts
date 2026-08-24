
import express from "express";
import { countryCodesController } from "../../controllers/utils-controller/contry-codes-controller";

export default function utilsRoute() {
    const router = express.Router();

    router.get("/country-codes", countryCodesController);

    router.get("/", (req, res) => {
        res.send("Welcome to the utils routes");
    });
    return router;
}