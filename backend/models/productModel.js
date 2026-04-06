import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean },
    brand: { type: String, default: '' },
    color: { type: String, default: '' },
    material: { type: String, default: '' },
    stock: { 
        type: mongoose.Schema.Types.Mixed, 
        default: 0,
        description: "Can be a number (total stock) or object with size-specific quantities (e.g., {S: 5, M: 3})"
    },
    date: { type: Number, required: true }
})

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel