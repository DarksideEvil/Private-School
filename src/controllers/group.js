const GroupModel = require("../models/group");

async function add(req, res) {
  try {
    if (!req.body.name || req.body.name.trim() === "") {
      return res
        .status(400)
        .json({ msg: `Name is required and cannot be empty !` });
    }
    const newGroup = await GroupModel.create(req.body);

    return res.status(201).json(newGroup);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send({
        msg: "Try another name !",
      });
    }
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function getAll(req, res) {
  try {
    const allGroups = await GroupModel.find();

    return res.status(200).json(allGroups);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function getOne(req, res) {
  try {
    const singleGroup = await GroupModel.findById(req.params.id);
    if (!singleGroup || req.params.id.length !== 24) {
      return res.status(404).json({ msg: `Group not found !` });
    }

    return res.status(200).json(singleGroup);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function editOne(req, res) {
  try {
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
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function deleteOne(req, res) {
  try {
    const deletedGroupgroup = await GroupModel.findByIdAndDelete(req.params.id);

    if (!deletedGroupgroup || req.params.id.length !== 24) {
      return res.status(404).json({ msg: `Group not found !` });
    }

    return res.status(200).json(deletedGroupgroup);
  } catch (err) {
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
