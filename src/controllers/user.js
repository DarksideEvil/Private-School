const UserModel = require("../models/user");
const { sign } = require("jsonwebtoken");
const env = process.env;
// const specs = require('../swagger')

async function register(req, res) {
  const { username, phone, password, role } = req.body;
  try {
    const existUser = await UserModel.findOne({ phone });
    if (existUser) {
      return res.status(409).json({ msg: `Try another phone !` });
    }

    const newUser = new UserModel({
      username,
      phone,
      password,
      role,
    });

    await newUser.save();

    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function login(req, res) {
  const { phone, password } = req.body;
  try {
    if (!phone || !password) {
      return res.status(400).json({ msg: `Fill all forms !` });
    }
    const existUser = await UserModel.findOne({ phone });

    if (
      !existUser ||
      existUser.phone !== phone ||
      existUser.password !== password
    ) {
      return res.status(401).json({ msg: `The user is not registered !` });
    }

    const token = sign(
      {
        _id: existUser._id,
        username: existUser.username,
        role: existUser.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_USER_EXPIRE }
    );

    // specs.components.securitySchemes.bearerAuth.bearerFormat = token;

    return res.status(200).json({
      msg: `Welcome back ${existUser.username}`,
      token,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function getAll(req, res) {
  try {
    const allUsers = await UserModel.find();

    return res.status(200).json(allUsers);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function getOne(req, res) {
  try {
    const singleUser = await UserModel.findById(req.params.id);
    if (!singleUser || req.params.id.length !== 24) {
      return res.status(404).json({ msg: `User not found !` });
    }

    return res.status(200).json(singleUser);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function editOne(req, res) {
  try {
    const modifiedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (modifiedUser === null || req.params.id.length !== 24) {
      return res.status(404).json({ msg: `User not found !` });
    }

    return res.status(200).json(modifiedUser);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function deleteOne(req, res) {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

    if (deletedUser === null || req.params.id.length !== 24) {
      return res.status(404).json({ msg: `User not found !` });
    }

    return res.status(200).json(deletedUser);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

module.exports = {
  register,
  login,
  getAll,
  getOne,
  editOne,
  deleteOne,
};
