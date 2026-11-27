import { Router } from "express";

const router = Router();

// Dipakai untuk mengecek server hidup (juga oleh Railway).
router.get("/", (_req, res) => {
  res.json({ status: "ok", time: Date.now() });
});

export default router;
