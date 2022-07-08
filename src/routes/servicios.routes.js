import { Router } from "express";
import { methods as serviciosController} from "../controllers/servicios.controller";

const router = Router();

router.get("/", serviciosController.getServicios);

router.post("/", serviciosController.addServicio);

router.get("/:id", serviciosController.getServicio);

router.delete("/:id", serviciosController.deleteServicio);

router.put("/:id", serviciosController.updateServicio);

export default router;