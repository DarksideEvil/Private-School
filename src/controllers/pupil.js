const PupilModel = require("../models/pupil");
const { join } = require("path");
const { unlink } = require("fs").promises;
const { existsSync } = require("fs");
const { saveFile } = require("../utils/upload");
const uploadPath = join(__dirname, "../uploads");

async function register(req, res) {
  try {
    const existPupil = await PupilModel.findOne({ phone: req.body?.phone });
    if (existPupil) {
      return res.status(409).json({ msg: `Try another credentials/phone !` });
    }
    await saveFile(req, res);
    const newPupil = await PupilModel.create(req.body);
    return res.status(201).json({
      msg: `${newPupil?.firstname} successfully registered !`,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function getByGroup(req, res) {
  try {
    const specifiedGroupPupils = await PupilModel.find({
      group: req.params.id,
    }).populate("group", "name");

    return res.status(200).json(specifiedGroupPupils);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function getAll(req, res) {
  try {
    const allPupils = await PupilModel.find().populate("group", "name");

    return res.status(200).json(allPupils);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function getOne(req, res) {
  try {
    const singlePupil = await PupilModel.findById(req.params.id).populate(
      "group",
      "name"
    );
    if (!singlePupil || req.params.id.length !== 24) {
      return res.status(404).json({ msg: `Pupil not found !` });
    }

    return res.status(200).json(singlePupil);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function editOne(req, res) {
  try {
    const existingPupil = await PupilModel.findById(req.params.id);

    if (!existingPupil) {
      return res.status(404).json({ msg: `Pupil not found !` });
    }

    if (req.file) {
      await saveFile(req, res);
      const newImageURL = req.body.img;

      if (existingPupil.img) {
        const existingImagePath = join(
          uploadPath,
          getImageFilenameFromUrl(existingPupil.img)
        );
        if (existsSync(existingImagePath)) {
          await unlink(existingImagePath);
        }
      }

      existingPupil.img = newImageURL;
    }

    for (let key in req.body) {
      if (
        key !== "img" &&
        key in existingPupil &&
        req.body[key] !== existingPupil[key]
      ) {
        existingPupil[key] = req.body[key];
      }
    }

    const updatedPupil = await existingPupil.save();

    return res.status(200).json(updatedPupil);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function deleteOne(req, res) {
  try {
    const deletedPupil = await PupilModel.findByIdAndDelete(req.params.id);

    if (!deletedPupil || req.params.id.length !== 24) {
      return res.status(404).json({ msg: `Pupil not found !` });
    }

    if (deletedPupil.img) {
      const imagePath = join(
        uploadPath,
        getImageFilenameFromUrl(deletedPupil.img)
      );
      if (existsSync(imagePath)) {
        await unlink(imagePath);
      }
    }

    return res.status(200).json(deletedPupil);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

function getImageFilenameFromUrl(imgUrl) {
  const urlParts = imgUrl.split("/");
  return urlParts[urlParts.length - 1];
}

module.exports = {
  register,
  getByGroup,
  getAll,
  getOne,
  editOne,
  deleteOne,
};
