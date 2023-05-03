const express = require('express');
const Note = require('../models/Notes');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const fetchuser = require('../middleware/fetchuser');

//ROUTE1: Get All the Notes GET "api/note/fetchalluser"
router.get('/fetchAllnotes', fetchuser, async (req,res)=> {
    try{
        const notes = await Note.find({user: req.user.id});
        res.json(notes)
    }catch(error){
        console.error(error.message);
        //In caseof any sudden error in database
        res.status(500).send("Some error occured");
    }
  
   
})

//ROUTE2: Add a new Note using POST "api/note/addnote"
router.post('/addnote', fetchuser,[
    body('title','Enter a Valid title').isLength({ min: 3}),
    body('description','Password must contain 5 characters').isLength({ min: 5}),
], async (req,res)=> {
    try{
        const {title, description, tag } = req.body;

        const errors = validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array() })
        }
        const note = new Note({
            title,description,tag,user:req.user.id
        })

    const savedNote = await note.save()

    res.json(savedNote)


    }catch(error){
        console.error(error.message);
        //In caseof any sudden error in database
        res.status(500).send("Some error occured");
    }
    })
//ROUTE3: update Note using PUT "api/note/updatenote"
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE4: delete Note using DELETE "api/note/deletenote"
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router