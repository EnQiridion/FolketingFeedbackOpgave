const Person = require('../models/person');

exports.createPerson = async (req, res, next) => {
    try {
        const person = new Person(req.body);
        await person.save();
        res.status(201).json(person);
    } catch (error) {
        next(error);
    }
};

exports.getAllPersons = async (req, res, next) => {
    try {
    const person = await Person.find();
    res.json(person); 
    } catch (error) {
        next (error);
    }
};

exports.getPersonById = async (req, res, next) => {
    try {
        const person = await Person.findById(req.params.id);
        if (!person) return res.status(404).json({error: 'Ingen Folketingsmedlemmer fundet!'});
        res.json(person);
    } catch (error) {
        next (error);
    }
};

exports.updatePerson = async (req, res, next) => {
    try {
        const person = await Person.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!person) return res.status(404).json({error: 'Ingen Folketingsmedlemmer fundet!'});
        res.json(person);
    } catch (error) {
        next (error);
    }
};

exports.deletePerson = async (req, res, next) => {
    try {
        const person = await Person.findByIdAndDelete(req.params.id);
        if(!person) return res.status(404).json({error: 'Ingen Folketingsmedlemmer fundet!'});
        res.json({message: 'Medlemmet har forladt Folketinget!'});
    } catch (error) {
        next (error);
    }
};