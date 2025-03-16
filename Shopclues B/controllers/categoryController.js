const Category = require('../models/categoryModel');

const addCategory = async(req,res)=>{
    try {
        const {name,description} = req.body;

        if(!name){
            return res.status(400).json({
                message:'category name is required'
            });
        }

        const exstingCategory = await Category.findOne({name});
        if(exstingCategory){
            return res.status(400).json({
                message:'category already exists'
            });
        }

        const category = new Category({name, description});
        await category.save();

        console.log("category added", category);

        res.status(201).json({
            message:'category added successfully',
            category: category
        });
        
    } catch (error) {
        res.status(500).json({
            message:'server error',
            error: error.message
        })
    }
}

const getAllCategories = async (req,res)=>{
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
        
    } catch (error) {
        res.status(500).json({
            message:'server error',
            error: error.message
        })
    }
}

const getCategoryById = async (req,res)=>{
    try {
        const {id} = req.params;
        const category = await Category.findById(id);

        if(!category){
            return res.status(404).json({message:'category not found'});
        }
        res.status(200).json(category);
        
    } catch (error) {
        res.status(500).json({
            message:'server error',
            error: error.message
        })
    }
}

const updateCategory = async (req,res)=>{
    try {
        const {id} = req.params;
        const {name,description} = req.body;

        const updateCategory = await Category.findByIdAndUpdate(
            id,
            {name, description},
            {new: true,runValidators: true}
        );

        if(!updateCategory){
            return res.status(404).json({
                message:'category not found'
            });
        }
        res.status(200).json({
            message:'category updated successfully',
            category: updateCategory
        });
        
    } catch (error) {
        res.status(500).json({
            message:'server error',
            error: error.message
        })
    }
}

const deleteCategory = async (req,res)=>{
    try {
        const {id} = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);

        if(!deletedCategory){
            return res.status(404).json({
                message:'category not found'
            });
        }
        res.status(200).json({
            message:'category deleted successfully',
        });
        
    } catch (error) {
        res.status(500).json({
            message:'server error',
            error: error.message
        })
    }
}

module.exports ={addCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
