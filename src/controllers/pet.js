import { Pet } from '../models/Pet.js';
import { User } from '../models/user.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { SC } from '../utils/statusCode.js';
import cloud from '../lib/cloudinary.js';
import { Logging } from '../utils/Logging.js';
import { Shelter } from '../models/shelter.js';

//Add Pet to Pet Management
export const addPet = asyncHandler(async(req, res, next)=>{
    const {
        name,
        breed,
        age,
        size,
        gender,
        color, 
        coatLength
    } = req.body;

    const new_pet = await Pet.create({
        name: name,
        breed : breed,
        age : age,
        size : size,
        gender : gender,
        color : color, 
        coatLength : coatLength
    });

    return res.status(SC.Created).json({status: true, message: 'New pet added to DB', data: new_pet});
})

//add pet pictures
export const addPictures = asyncHandler(async(req, res, next)=>{
    const { petId } = req.params;
    const pet = await Pet.findById(petId);
    if(!pet){
        return res.status(SC.NotFound).json({status: false, message: 'Pet Not found'});
    }

    const newPictures = [];
    if(req.files){
        if(req.files.length !== 0){
            for(let i = 0; i< req.files.length; i++){
                let result = await cloud.uploader.upload(
                    req.files[i].path,
                    {
                        public_id: `${Date.now()}`,
                        resource_type: 'auto',
                        folder: "Pet_Images"
                    },
                )

                newPictures.push({
                    name: req.files[i].originalname,
                    url: result.url,
                    description: req.body.description
                }) 
            }
        }

        const petPictures = await Pet.findOneAndUpdate({_id: petId}, {
            $push: {
                pictures: newPictures
            }}, {new: true}
        );

        if(!petPictures){
            Logging.info('Could not add images to DB');
        }

        return res.status(SC.OK).json({status: true, message: 'Images added successfully', data: petPictures});
    }

    return res.status(SC.OK).json({status: true, message: 'Picture was not uploaded'})

})

//remove pet pictures
export const removePictures = asyncHandler(async(req, res, next)=>{
    const { petId, imageId } = req.params;

    const pet_exists = await Pet.findById(petId);
    if(!pet_exists){
        return res.status(SC.BadRequest).json({status: false, message:'Invalid Pet ID'});
    }

    pet_exists.pictures = pet_exists.pictures.filter((p)=>{p._id.toString() !== imageId});

    const image_removed = await pet_exists.save();

    return res.status(SC.OK).json({status: true, message: "image remved", data: image_removed})

})

//Update Pet Details
export const updatePet = asyncHandler(async(req, res, next)=>{
    const { petId } = req.params;
    const {
        name,
        age,
        color, 
        energyLevel,
        friendliness,
        easeOfTraining,
        exerciseRequirement,
        affectionNeeds
    } = req.body;

    const pet_updated = await Pet.findOneAndUpdate({_id: petId}, {
        $set: {
            name,
            age,
            color, 
            energyLevel,
            friendliness,
            easeOfTraining,
            exerciseRequirement,
            affectionNeeds
        }}, { new: true}
    )

    return res.status(SC.OK).json({status:true,message:"Data updated", data: pet_updated});

})

//Remove Pet from Pet Manager
export const removePet = asyncHandler(async(req, res, next)=>{
    const { petId } = req.params;

    const pet_removed = await Pet.findOneAndRemove({_id: petId});

    return res.status(SC.OK).json({status: true,message: 'Pet removed', data: pet_removed});
})

//View Pet Details
export const petDetails = asyncHandler(async(req, res, next)=>{
    const { petId } = req.params;

    const pet_found = await Pet.findById(petId);
    if(!pet_found){
        return res.status(SC.NotFound).json({status: true, message: "Invalid ID"});
    }
    return res.status(SC.OK).json({status: true, message: "Pet Details", data: pet_found});


})

//Add Pet to User Likes
export const  addToLike = asyncHandler(async(req, res, next)=>{
    const { petId } = req.params;

    const pet_found = await Pet.findById(petId);
    if(!pet_found){
        return res.status(SC.NotFound).json({status: true, message: "Invalid ID"});
    }

    const petObjectId = new mongoose.Types.ObjectId(petId);
    const user = await User.findOne({_id: req.userId});
    const indexPet = user.likedPet.findIndex((p)=>{
        p.id.toString() === pet_found._id.toString();
    });

    if(indexPet >= 0){
        return res.status(SC.BadRequest).json({status: false, message: "Already Liked"})
    }

    user.likedPet.push(new mongoose.Types.ObjectId(pet_found._id));
    const user_saved = await user.save();
    
    return res.status(SC.OK).json({
        status: true,
        message: "Added Pet to Likes",
        data: user
    })

    

})

//Remove Pet from User Likes
export const  removeFromLike = asyncHandler(async(req, res, next)=>{
    let userId = req.userId;
    const { petId } = req.params;

    const pet_found = await Pet.findById(petId);
    if(!pet_found){
        return res.status(SC.NotFound).json({status: true, message: "Invalid ID"});
    }
    const user = await User.findById(userId);
    user.likedPet = user.likedPet.filter((p)=>{
        p.id !== petId
    });
    const removed_pet = await user.save();

    return res.status(SC.OK).json({
        status: true,
        message: "Added Pet to Likes",
        data: removed_pet
    })



})

//Adopt Pet
export const adoptPet = asyncHandler(async(req, res, next)=>{
    let userId = req.userId;
    const { petId } = req.params;

    const pet_found = await Pet.findById(petId);
    if(!pet_found){
        return res.status(SC.NotFound).json({status: true, message: "Invalid ID"});
    }

    const user_data = await User.findById(userId);
    user_data.adoptedPet.push([new mongoose.Types.ObjectId(pet_found._id)]);
    const saved_user = await user_data.save();

    return res.status(SC.Created).json({status: true, message: "Added Adopted pet to User", data: saved_user});


})

//search pets
export const searchPet = asyncHandler(async(req, res, next)=>{
    const queryParams = req.query;

    Logging.info(queryParams);
   
})

//Add pet to shelter
export const addPetToShelter = asyncHandler(async(req, res, next)=>{
  const {
    petId,
    shelterId
  } = req.params;

  const pet_data = await Pet.findById({ _id: petId});
  if(!pet_data){
      return res.status(SC.NotFound).json({status: true, message: "Invalid Pet ID"});
  };

  const shelter_data = await Shelter.findById({ _id: shelterId});
  if(!shelter_data){
      return res.status(SC.NotFound).json({status: true, message: "Invalid Shelter ID"});
  };

  pet_data.shelter = new mongoose.Types.ObjectId(shelter_data._id);
  await pet_data.save();
  shelter_data.pets.push([new mongoose.Types.ObjectId(pet_data._id)]);
  await shelter_data.save();
  return res.status(SC.OK).json({status: true, message: "Pet added Shelter"});

})