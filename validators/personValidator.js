const Joi = require('joi');

const Schema = Joi.object({
    name: Joi.string().required(),
    party: Joi.string().valid(
        'Socialdemokratiet', 'Venstre', 'Moderaterne', 'SF',
        'Danmarksdemokraterne', 'Liberal Alliance', 'Enhedslisten', 
        'Det Konservative Folkeparti', 'Nye Borgerlige', 'Alternativet', 
        'Dansk Folkeparti', 'Radikale Venstre', ).required(),
    position: Joi.string().valid('Minister', 'Formand').required(),
    post: Joi.string()
});

exports.validatePerson = (req, res, next) => {
    const { error } = Schema.validate(req.body);
    if(error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}