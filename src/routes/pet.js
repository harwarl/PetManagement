import { Router } from "express";
import { uploadImage } from "../lib/multer.js";
import is_auth from '../middleware/is_auth.js';
import {
    addPet,
    addPictures,
    addToLike,
    removePictures,
    updatePet, 
    removePet, 
    removeFromLike, 
    petDetails, 
    adoptPet,
    searchPet,
    addPetToShelter
} from '../controllers/pet.js';

const router = Router();

router.get('/search', searchPet)
router.get('/:petId', petDetails);
router.put('/:petId', updatePet);
router.post('/add', addPet);
router.post('/:petId/images', uploadImage.array('pictures'), addPictures);
router.post('/:petId/like', is_auth, addToLike);
router.post('/:petId/adopt', adoptPet);
router.post('/:petId/shelters/:shelterId', addPetToShelter); 
router.delete('/:petId', removePet);
router.delete('/:petId/remove', is_auth, removeFromLike);
router.delete('/:petId/images/:imageId', removePictures);

export { router };