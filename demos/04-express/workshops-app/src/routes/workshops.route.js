const express = require( 'express' );
const workshops = require( '../data/workshops.json' ); // JSON -> JS array
const Joi = require('joi');

// set up the Joi schema for validation
const timeSchema = Joi.object({
    hours: Joi.number().integer().min(0).max(23).required(),
    minutes: Joi.number().integer().min(0).max(59).required()
});

const workshopSchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string()
        .valid("frontend", "backend", "database", "devops", "language", "mobile")
        .required(),
    description: Joi.string().max(1024).required(),
    startDate: Joi.string().isoDate().required(),
    endDate: Joi.string().isoDate().required(),
    startTime: timeSchema.required(),
    endTime: timeSchema.required(),
    speakers: Joi.array().items(Joi.string()).min(1).required(),
    location: Joi.object({
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required()
    }).required(),
    modes: Joi.object({
        inPerson: Joi.boolean().required(),
        online: Joi.boolean().required()
    }).required(),
    imageUrl: Joi.string().uri().required()
});

let nextId = 13;

const router = express.Router();

router.route( '/' )
    .get(( req, res ) => {
        // res.json( js_array / js_object )
        res.json({
            status: 'success',
            data: workshops
        });
    })
    .post(( req, res ) => {
        const newWorkshop = req.body;

        // Check if body is sent and not empty
        if (!newWorkshop || Object.keys(newWorkshop).length === 0) {
            res.status(400).json({
                status: 'error',
                message: 'The request body is empty. Workshop object expected.'
            });
            return;
        }

        // Validate using Joi
        const { error, value } = workshopSchema.validate(newWorkshop, {
            abortEarly: false,
            convert: false
        });

        if (error) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                details: error.details.map(err => err.message)
            });
        }

        newWorkshop.id = nextId;
        ++nextId;
        workshops.push( newWorkshop );

        // 'Content-Type': 'text/html' (send() sets this HTTP header, end() does not)
        res.status(201).json({
            status: 'success',
            data: newWorkshop
        });
    });

module.exports = router;