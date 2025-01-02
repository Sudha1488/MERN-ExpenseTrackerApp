import { Expense } from "../models/expense.model.js";

export const addExpense = async (req, res) => {
    try {
        const { description, amount, category } = req.body;

        const userId = req.id; // current logged in user iD
    
        if (!description || !amount || !category) {
            return res.status(400).json({ message: "All fields are required.", success: false })
        };

        const expense = await Expense.create({
            description,
            amount,
            category,
            userId
        });
        return res.status(201).json({
            message: "New Expense Added.",
            expense,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });

    }
}
export const getAllExpense = async (req, res) => {
    try {
        const userId = req.id; //loggedin userid

        let category = req.query.category || "all";
        const done = req.query.done || "both";

        const query = {
            userId //filter by userId
        }
        if (category.toLowerCase() == "all") {
            //no need to filter by category
        } else {
            query.category = { $regex: category, $options: 'i' };
        }

        if (done.toLowerCase() === "done") {
            query.done = true;
        } else if (done.toLowerCase() === "undone") {
            query.done = false //filter for expense mark as pending (false)
        };

        const expense = await Expense.find(query);

        if (!expense || expense.length === 0) {
            return res.status(404).json({
                message: "No expense found.",
                success: false
            })
        };
        return res.status(200).json({
            expense,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
}

export const markAsDoneOrUndone = async (req,res)=>{
    try{
        const expenseId = req.params.id;
        const done = req.body;
        const expense = await Expense.findByIdAndUpdate(expenseId,done,{new:true});

        if(!expense){
            return res.status(401).json({message:"Expense not found.",success:false})
        };

        return res.status(200).json({
            message:`Expense mark as ${expense.done? 'done' : 'undone'}`,
            success:true
        })
    }catch(error){
        console.log(error); 
    }
}

export const removeExpense = async (req,res) =>{
    try {
        const expenseId = req.params.id;
        await Expense.findByIdAndDelete(expenseId);
        return res.status(200).json({message:"Expense removed.",success:true})
        
    } catch (error) {
        console.log(error);
    }
}

export const updateExpense = async(req,res)=>{
    try {
        const {description, amount, category} = req.body;

        const expenseId = req.params.id;
        const updateData = {description, amount, category};

        const expense = await Expense.findByIdAndUpdate(expenseId, updateData, {new:true});

        return res.status(200).json({
            message:"Expense Updated.",
            expense,
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}