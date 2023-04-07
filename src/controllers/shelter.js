import { Shelter } from "../models/shelter.js";
import asyncHandler from 'express-async-handler';
import { SC } from '../utils/statusCode.js';
import { Logging } from '../utils/Logging.js';
import cloud from '../lib/cloudinary.js';
import zipcodes from 'zipcodes';

//Add shelter
export const addShelter = asyncHandler(async(req, res, next)=>{
    const {
        name,
        zipCode,
        phone
    } = req.body;

    const shelter_exists = await Shelter.findOne({name: name});
    if(shelter_exists){
        return res.status(SC.BadRequest).json({status: false, message: 'Shelter already registered'});
    }

    const zipcode = zipcodes.lookup(zipCode);
    if(!zipcode){
        return res.status(SC.BadRequest).json({status: false, message: "Invalid ZipCode"});
    }

    const {
        city,
        state,
        country
    } = zipcode;

    const shelter = await Shelter.create({
        name: name,
        zipCode: zipCode,
        phone: phone,
        city: city,
        state: state,
        country: country
    })

    return res.status(SC.Created).json({status: true, message: 'Shelter Added', data: shelter});

})

export const addPictures = asyncHandler(async(req, res, next)=>{
    const { shelterId } = req.params;
    const shelter = await Shelter.findById(shelterId);
    if(!shelter){
        return res.status(SC.NotFound).json({status: false, message: 'shelter Not found'});
    }

    const newPictures = [];
    if(req.files){
        if(req.files.length > 0){
            for(let i = 0; i < req.files.length; i++){
                const result = await cloud.uploader.upload(
                    req.files[i].path,
                    {
                        public_id: `${Date.now()}`,
                        resource_type: 'auto',
                        folder: "Shelter_Images"
                    },
                    newPictures.push({
                        name: req.files[i].originalName,
                        url: result.url,
                    })
                )
            }
        }

        const shelter_Pictures = await Shelter.findOneAndUpdate({_id: shelterId}, {
            $push: {
                pictures: newPictures
            }
        }, { new : true});

        return res.status(SC.Accepted).json({status: true, message: 'Images added successfully', data: shelter_Pictures});
    }

    return res.status(SC.Accepted).json({status: true, message: 'image was not uploaded'});

})
//remove shelter
export const removeShelter = asyncHandler(async(req, res, next)=>{
    const { shelterId } = req.params;

    const shelter_removed = await Shelter.findOneAndRemove({ _id: shelterId });

    return res.status(SC.Accepted).json({status: true,message: 'Shelter removed', data: shelter_removed});
})

//get allpetss in shelter
export const getAllPetsInShelter = asyncHandler(async(req, res, next)=>{
    const {
        shelterId
    } = req.params;

    const shelter_data = await Shelter.findById({ _id: shelterId}).populate('pets');
    if(!shelter_data){
        return res.status(SC.NotFound).json({status: true, message: "Invalid ID"});
    }

    return res.status(SC.OK).json({status: true, data: shelter_data.pets})


})

//remove shelter from shelter
export const removePetFromShelter = asyncHandler(async(req, res, next)=>{
    const { 
        shelterId, 
        petId 
    } = req.params;

    const shelter_data = await Shelter.findById({ _id: shelterId}).populate('pets');
    if(!shelter_data){
        return res.status(SC.NotFound).json({status: true, message: "Invalid ID"});
    };

    const pet_data = await Pet.findById({ _id: petId})
    if(!pet_data){
        return res.status(SC.NotFound).json({status: true, message: "Invalid Pet ID"});
    };

    shelter_data.pets = shelter_data.pets.filter((p)=>{
        p.id.toString() !== petId.toString()
    })

    pet_data.shelter = null;
    await pet_data.save();

    const shelter_data_pet_removed = await shelter_data.save();

    return res.status(SC.OK).json({status: true, message: "Pet removed from shelter", data: shelter_data_pet_removed});



    
})

export const getAllShelters = asyncHandler(async(req, res, next)=>{
    const shelters = await Shelter.find({});
    if(shelters.length <= 0){
        return res.status(SC.OK).json({status: true, message: 'No Shelters Available'});
    }

    return res.status(SC.OK).json({ status: true, data: shelters});

    
})

export const getShelter = asyncHandler(async(req, res, next)=>{
    const {
        shelterId
    } = req.params;

    const shelter_data = await Shelter.findById({ _id: shelterId});
    if(!shelter_data){
        return res.status(SC.NotFound).json({status: true, message: "Invalid ID"});
    };

    return res.status(SC.OK).json({status: true, data: shelter_data})
    
})