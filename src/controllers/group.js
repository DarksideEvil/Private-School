const GroupModel = require("../models/group");
const { infoLogger, errorLogger } = require("../utils/errorHandler");

async function add(req, res) {
  try {
    infoLogger(req);
    if (!req.body.name || req.body.name.trim() === "") {
      const msg = `Name is required and cannot be empty !`;
      errorLogger(req, msg, 400);
      return res.status(400).json({ msg });
    }
    const newGroup = await GroupModel.create(req.body);

    return res.status(201).json(newGroup);
  } catch (err) {
    if (err.code === 11000) {
      const msg = `Try another name !`;
      errorLogger(req, msg, 400);
      return res.status(400).send({
        msg,
      });
    }
    errorLogger(req, err);
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function getAll(req, res) {
  try {
    infoLogger(req);
    const allGroups = await GroupModel.find();
    return res.status(200).json(allGroups);
  } catch (err) {
    errorLogger(req, err);
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function getOne(req, res) {
  try {
    infoLogger(req);
    const singleGroup = await GroupModel.findById(req.params.id);
    if (!singleGroup || req.params.id.length !== 24) {
      return res.status(404).json({ msg: `Group not found !` });
    }

    return res.status(200).json(singleGroup);
  } catch (err) {
    errorLogger(req, err);
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function editOne(req, res) {
  try {
    infoLogger(req);
    const modifiedGroupgroup = await GroupModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!modifiedGroupgroup || req.params.id.length !== 24) {
      return res.status(404).json({ msg: `Group not found !` });
    }

    return res.status(200).json(modifiedGroupgroup);
  } catch (err) {
    errorLogger(req, err);
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function deleteOne(req, res) {
  try {
    infoLogger(req);
    const deletedGroupgroup = await GroupModel.findByIdAndDelete(req.params.id);

    if (!deletedGroupgroup || req.params.id.length !== 24) {
      return res.status(404).json({ msg: `Group not found !` });
    }

    return res.status(200).json(deletedGroupgroup);
  } catch (err) {
    errorLogger(req, err);
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

module.exports = {
  add,
  getAll,
  getOne,
  editOne,
  deleteOne,
};
