const mongoose = require("mongoose");
const Workshop = mongoose.model("Workshop");

const getAllWorkshops = async () => {
    const workshops = await Workshop.find();
    return workshops;
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

module.exports = {
    getAllWorkshops,
    addWorkshop,
};