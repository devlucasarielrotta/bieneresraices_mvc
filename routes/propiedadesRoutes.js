import { Router } from "express";
import { admin, crear } from "../controllers/propiedadController.js";

const router = Router();

// Routing
router.get('/mis-propiedades', admin)
router.get('/crear', crear)

export default router