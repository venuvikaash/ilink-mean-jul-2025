const mongoose = require("mongoose");
const Workshop = mongoose.model("Workshop");

const getAllWorkshops = async (page, sortField, category = '') => {
    const filters = {};

    if (category) {
        // { category: 'frontend' }
        filters.category = category;
    }

    // if we do not await, the query does not execute immediately (it will only execute when the function pauses/completes without pausing) - this allows us to customize the query (Add sorting, pagination etc.)
    const query = Workshop.find(filters);

    // We can either blacklist or whitelist fields. Here we blacklist (i.e. omit certain fields)
    query.select({
        description: false
    });

    if (sortField) {
        query.sort({
            [sortField]: 1,
        });
    }

    // pagination (assuming 10 per page)
    query.skip(10 * (page - 1)).limit(10);

    const [ workshops, count ] = await Promise.all(
        [
            query.exec(),
            Workshop.countDocuments(filters)
        ]
    );

    return {
        workshops,
        count
    };
};

const addWorkshop = async (workshop) => {
    try {
        const insertedWorkshop = await Workshop.create(workshop);
        return insertedWorkshop;
    } catch (error) {
        if (error.name === "MongoServerError" && error.code === 11000 ) {
            const dbError = new Error(`Validation error : ${error.message}`);
            dbError.type = "ValidationError";
            throw dbError;
        }

        if (error.name === "ValidationError") {
            const dbError = new Error(`Validation error : ${error.message}`);
            dbError.type = "ValidationError";
            throw dbError;
        }

        if (error.name === "CastError") {
            const dbError = new Error(`Data type error : ${error.message}`);
            dbError.type = "CastError";
            throw dbError;
        }
    }
};

const getWorkshopById = async (id) => {
    try {
        const workshop = await Workshop.findById(id);

        if (workshop === null) {
            const error = new Error("No such workshop");
            error.type = "NotFound";
            throw error;
        }

        return workshop;
    } catch (error) {
        if (error.name === "CastError") {
            const dbError = new Error(`Data type error : ${error.message}`);
            dbError.type = "CastError";
            throw dbError;
        }

        if (error.type === "NotFound") {
            throw error;
        }
    }
};

module.exports = {
    getAllWorkshops,
    addWorkshop,
    getWorkshopById
};