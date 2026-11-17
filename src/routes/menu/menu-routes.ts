import express from "express";
import getRestoMenuController from "../../controllers/menu-controller/menuController";

const router = express.Router();

export default function menuRouter() {
    router.get("/test", (req, res) => {
        res.send("berhasil coba api test")
    })
    router.get("/menu", getRestoMenuController);
    return router;
}
