import { Router } from "express";
import { uploadImage } from "../lib/multer.js";
import {  
    addShelter, 
    addPictures,
    getAllPetsInShelter, 
    removePetFromShelter, 
    removeShelter,
    getAllShelters,
    getShelter,
} from "../controllers/shelter.js";

const router = Router();

router.get('/', getAllShelters);
router.get('/:shelterId', getShelter);
router.get('/:shelterId/pets', getAllPetsInShelter);
router.post('/add', addShelter);
router.post('/:shelterId/images', uploadImage.array('pictures'), addPictures);
router.delete('/:shelterId', removeShelter);
router.delete('/:shelterId/pets/:petId', removePetFromShelter);


export { router };