import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Staff Routes");
});

router.post("/", (req, res) => {
    res.send("Staff Routes");
});

router.post("/", (req, res) => {
    res.send("Staff Routes");
});

export default router;
