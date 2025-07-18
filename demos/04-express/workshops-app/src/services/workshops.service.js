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

const getWorkshopById = async (id, embedSessions = false) => {
    try {
        const query = Workshop.findById( id );

        // console.log( embedSessions );

        if (embedSessions) {
            query.populate( 'sessions' );
        }

        const workshop = await query.exec();

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

const updateWorkshop = async (id, workshop) => {
    // NOTES
    // ---
    // 1. By default, MongoDB $set operator is applied to the fields. FOr an array field, we explicitly use an operator like $push to addd to an existing array (else it will be completely replaced).
    /**
     *  {
            $set: {
                "name": "Express JS v5",
                "category": "backend"
            }
        }
     */
    // 2. By default Mongoose will not perform schema validations on update. We need to explicitly configure Mongoose to do so.
    try {
        // we do not need to pass returnOriginal / new if it has been configured similalrly at a global level
        const updatedWorkshop = await Workshop.findByIdAndUpdate(
            id,
            workshop /*, {
            // returnOriginal: false
            new: true
        } */
        );
        return updatedWorkshop;
    } catch (error) {
        if (error.name === "CastError") {
            const dbError = new Error(`Data type error : ${error.message}`);
            dbError.type = "CastError";
            throw dbError;
        } else if (error.name === "ValidationError") {
            const dbError = new Error(`Validation error : ${error.message}`);
            dbError.type = "ValidationError";
            throw dbError;
        } else {
            throw error;
        }
    }
};

const deleteWorkshop = async (id) => {
    const deletedWorkshop = await Workshop.findByIdAndDelete(id);

    if (deletedWorkshop === null) {
        const error = new Error("No such workshop");
        error.type = "NotFound";
        throw error;
    }

    return deletedWorkshop;
};

const addSpeakers = async (id, speakers) => {
    // by default, $set is applied to the fields
    // Therefore we ned to construct the update clause ourselves
    const updateClause = {
        $addToSet: {
            speakers: {
                $each: speakers,
            },
        },
    };

    try {
        const updatedWorkshop = await Workshop.findByIdAndUpdate(
            id,
            updateClause
        );
        return updatedWorkshop;
    } catch (error) {
        if (error.name === "CastError") {
            const dbError = new Error(`Data type error : ${error.message}`);
            dbError.type = "CastError";
            throw dbError;
        } else if (error.name === "ValidationError") {
            const dbError = new Error(`Validation error : ${error.message}`);
            dbError.type = "ValidationError";
            throw dbError;
        } else {
            throw error;
        }
    }
};

module.exports = {
    getAllWorkshops,
    addWorkshop,
    getWorkshopById,
    updateWorkshop,
    deleteWorkshop,
    addSpeakers
};