const Player = require('../models/player')

const getPlayers = async (req, res, next) => {
  try {
    const players = await Player.find();
      //200 is generic success
      res.status(200).json(players);
    } catch (err) {
        //500 means server error, not user error
      res.status(500).json({message: err.message});
    }
};


const getPlayer = async (req, res, next) => { 
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      // 404 means does not exist
      res.status(404).json({message: "Can't find this player."});
      return;
    }
    res.status(200).json(player);
  } catch (err) {
    //500 means server error, not user error
    res.status(500).json({message: err.message});
  }
};


const addPlayer = async (req, res, next) => {
  try {
    //Reject if there are any missing fields
    if (!req.body.characterName || !req.body.playerName || !req.body.campaign) {
      //400 means user error - didn't use all values for instance
      res.status(400).send({ message: 'Content can not be empty!' });
    }

    const player = new Player(req.body);
    player.save().then((data) => {
      //201 means new thing created as opposed to general 200 "everything worked"
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).json({message: err.message || 'Error occured creating player.'});
    });
  } catch (err) {
    //500 means server error, not user error
    res.status(500).json({message: err.message});
  }
}


const delPlayer = async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      // 404 means does not exist
      res.status(404).json({message: "Can't find this player."});
      return;
    }
    const result = player.remove();
    res.status(200).json({message: "Successfully deleted player."});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
};


const editPlayer = async (req, res, next) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!player) {
      //404 means does not exist
      return res.status(404).send("No player found.");
    }
    //204 succeeds but doesn't navigate away
    //The relevant circumstance is I can't run json messages from it
    //But I'll leave it anyway or else it won't give me any response at all?!
    res.status(204).send(player);
  } catch(err) {
    res.status(500).send(err)
  }
}


module.exports = { getPlayers, getPlayer, addPlayer, delPlayer, editPlayer};