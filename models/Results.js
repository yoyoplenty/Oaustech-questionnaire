const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

const resultSchema = new mongoose.Schema(
    {
        course: {
            type: String,
            required: true,
        },
        matricNo: {
            type: Number,
            required: true
        },
        program: {
            type: String,
            required: true,
        },
        option: {
            type: Object,
            required: true
        }
    },
    { timestamps: { createdAt: "createdAt" } }

);

module.exports = mongoose.model("Result", resultSchema);
