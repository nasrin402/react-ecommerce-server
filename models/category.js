const mongoose =require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name:{
            type: String,
            trim: true,
            required: "name is required",
            minlength: [3, "too short"],
            maxlength: [32, "too long"]
        },
        slug:{
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Category", categorySchema);