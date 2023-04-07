import { router as AuthRouter } from "../routes/auth.js";
import { router as PetRouter } from "../routes/pet.js";
import { router as ShelterRouter } from "../routes/shelter.js";

export const bootstrap = (app) =>{
    app.use('/api/pets', PetRouter);
    app.use('/api/auth', AuthRouter);
    app.use('/api/shelters', ShelterRouter);


    
};