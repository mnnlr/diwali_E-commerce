import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: String,
    parentCategoryId:{
        type: mongoose.Schema.ObjectId,
        ref: "Category",
    },
    }, {
    timestamps: true,
});

const Category = mongoose.model("Category", CategorySchema);

export default Category;