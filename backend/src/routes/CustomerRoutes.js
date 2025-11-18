import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Customer Routes");
});

router.post("/", (req, res) => {
    res.send("Customer Routes");
});

export default router;