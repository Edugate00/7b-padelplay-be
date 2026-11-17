import express from "express";
import getRestoMenuController from "../../controllers/menu-controller/menuController";

const router = express.Router();

export default function menuRouter() {
    router.get("/menu", getRestoMenuController);
    return router;
}
