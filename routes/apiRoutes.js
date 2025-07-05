import express from 'express';
import { propiedades } from '../controllers/apiController.js';
const router = express.Router();

router.get('/propiedadesApi',propiedades)

export default router