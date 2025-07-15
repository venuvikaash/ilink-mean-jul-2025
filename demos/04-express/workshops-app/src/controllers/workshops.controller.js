const services = require( '../services/workshops.service' );

// http://localhost:3000/api/workshops?page=1&sort=name&category=frontend
const getWorkshops = async ( req, res ) => {
    let { page, sort : sortField, category } = req.query;

    const { workshops, count } = await services.getAllWorkshops(page, sortField, category);

    res.json({
        status: 'success',
        // count: count,
        count,
        data: workshops
    });
};

const postWorkshop = async ( req, res /*, next */ ) => {
    const newWorkshop = req.body;

    // Check if body is sent and not empty
    if (!newWorkshop || Object.keys(newWorkshop).length === 0) {
        const err = new Error('The request body is empty. Workshop object expected.');
        err.status = 400;
        // next( err ); // old Express way
        throw err;
    }

    try {
        const updatedWorkshop = await services.addWorkshop( newWorkshop );
        res.status(201).json({
            status: 'success',
            data: updatedWorkshop
        });
    } catch( error ) {
        error.status = 400;
        throw error;
    }
};

// http://localhost:3000/api/workshops/:id
const getWorkshopById = async ( req, res ) => {
    const id = req.params.id;

    try {
        const workshop = await services.getWorkshopById( id );

        res.json({
            status: 'success',
            data: workshop
        });
    } catch( error ) {
        error.status = 404;
        throw error;
    }
};

// @todo - Proper handling of error response status codes (400 vs 404)
const patchWorkshop = async ( req, res ) => {
    const id = req.params.id;

    const workshop = req.body;

    // if workshop = req.body -> {}
    if( Object.keys( workshop ).length === 0 ) {
        const err = new Error('The request body is empty. A partial Workshop object expected.');
        err.status = 400;
        throw err;
    }

    try {
        const updatedWorkshop = await services.updateWorkshop( id, workshop );
        res.json({
            status: 'success',
            data: updatedWorkshop
        });
    } catch( error ) {
        const err = new Error( error.message );
        err.status = 404;
        throw err;
    }
};

const deleteWorkshop = async ( req, res ) => {
    const id = req.params.id;

    try {
        await services.deleteWorkshop( id );
        // 204 -> use this status code for successful operation but you do not want to send any data in response (as in res.status(204).end())
        res.json({
            status: 'success'
        });
    } catch( error ) {
        error.status = 404;
        throw error;
    }
};

module.exports = {
    getWorkshops,
    postWorkshop,
    getWorkshopById,
    patchWorkshop,
    deleteWorkshop
}