const Character = require('../models/character')

//using try/catch for troubleshooting
const getCharacters = async (req, res, next) => {
  try {
    const characters = await Character.find();
    //200 is generic success
    res.status(200).json(characters);
  } catch (err) {
      //500 means server error, not user error
    res.status(500).json({message: err.message});
  }
};


const getCharacter = async (req, res, next) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) {
      // 404 means does not exist
      res.status(404).json({message: "Can't find this character."});
      return;
    }
    res.status(200).json(character);
  } catch (err) {
    //500 means server error, not user error
    res.status(500).json({message: err.message});
  }
};


const addCharacter = async (req, res, next) => {
  try {
    //Reject if there are any missing fields
    if (!req.body.characterName || !req.body.playerName || !req.body.race || !req.body.class || !req.body.level || !req.body.alignment || 
    !req.body.stats.str || !req.body.stats.dex || !req.body.stats.con || !req.body.stats.int || !req.body.stats.wis || !req.body.stats.cha) {
      //400 means user error - didn't use all values for instance
      res.status(400).send({ message: 'Content can not be empty!' });
    }

    const character = new Character(req.body);
    character.save().then((data) => {
      //201 means new thing created as opposed to general 200 "everything worked"
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).json({message: err.message || 'Error occured creating character.'});
    });
  } catch (err) {
    //500 means server error, not user error
    res.status(500).json({message: err.message});
  }
}


const delCharacter = async (req, res, next) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) {
      // 404 means does not exist
      res.status(404).json({message: "Can't find this character."});
      return;
    }
    const result = character.remove();
    res.status(200).json({message: "Successfully deleted character."});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
};


const editCharacter = async (req, res, next) => {
  try {
    const character = await Character.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!character) {
      //404 means does not exist
      return res.status(404).send("No Character found.");
    }
    //204 succeeds but doesn't navigate away
    //The relevant circumstance is I can't run json messages from it
    //But I'll leave it anyway or else it won't give me any response at all?!
    res.status(204).send(character);
  } catch(err) {
    res.status(500).send(err)
  }
}


module.exports = { getCharacters, getCharacter, addCharacter, delCharacter, editCharacter};