import { Router } from "express";
import { uploadImage } from "../lib/multer.js";
import {is_auth} from '../middleware/is_auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
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
router.put('/:petId', is_auth, isAdmin,  updatePet);
router.post('/add', is_auth, isAdmin,  addPet);
router.post('/:petId/images', is_auth, isAdmin, uploadImage.array('pictures'), addPictures);
//requires login
router.post('/:petId/like', is_auth, addToLike);
router.post('/:petId/adopt', is_auth, adoptPet);
router.post('/:petId/shelters/:shelterId', is_auth, isAdmin, addPetToShelter); 
router.delete('/:petId', is_auth, isAdmin, removePet);
router.delete('/:petId/remove', is_auth, removeFromLike);
router.delete('/:petId/images/:imageId', is_auth, isAdmin, removePictures);

export { router };