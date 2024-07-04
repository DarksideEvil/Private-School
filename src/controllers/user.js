const UserModel = require("../models/user");
const { sign } = require("jsonwebtoken");
const env = process.env;
const { infoLogger, errorLogger } = require("../utils/errorHandler");

async function register(req, res) {
  const { username, phone, password, role } = req.body;
  try {
    infoLogger(req);
    const existUser = await UserModel.findOne({ phone });
    if (existUser) {
      const msg = `Try another phone !`;
      errorLogger(req, msg, 409);
      return res.status(409).json({ msg });
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
    errorLogger(req, err);
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function login(req, res) {
  const { phone, password } = req.body;
  try {
    infoLogger(req);
    if (!phone || !password) {
      const msg = `Fill all forms !`;
      errorLogger(req, msg, 400);
      return res.status(400).json({ msg });
    }
    const existUser = await UserModel.findOne({ phone });

    if (
      !existUser ||
      existUser.phone !== phone ||
      existUser.password !== password
    ) {
      const msg = `The user is not registered !`;
      errorLogger(req, msg, 401);
      return res.status(401).json({ msg });
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

    return res.status(200).json({
      msg: `Welcome back ${existUser.username}`,
      token,
    });
  } catch (err) {
    errorLogger(req, err);
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function getAll(req, res) {
  try {
    infoLogger(req);
    const allUsers = await UserModel.find();

    return res.status(200).json(allUsers);
  } catch (err) {
    errorLogger(req, err);
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function getOne(req, res) {
  try {
    infoLogger(req);
    const singleUser = await UserModel.findById(req.params.id);
    if (!singleUser || req.params.id.length !== 24) {
      const msg = `User not found !`;
      errorLogger(req, msg, 404);
      return res.status(404).json({ msg });
    }

    return res.status(200).json(singleUser);
  } catch (err) {
    errorLogger(req, err);
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function editOne(req, res) {
  try {
    infoLogger(req);
    const modifiedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (modifiedUser === null || req.params.id.length !== 24) {
      const msg = `User not found !`;
      errorLogger(req, msg, 404);
      return res.status(404).json({ msg });
    }

    return res.status(200).json(modifiedUser);
  } catch (err) {
    errorLogger(req, err);
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function deleteOne(req, res) {
  try {
    infoLogger(req);
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

    if (deletedUser === null || req.params.id.length !== 24) {
      const msg = `User not found !`;
      errorLogger(req, msg, 404);
      return res.status(404).json({ msg });
    }

    return res.status(200).json(deletedUser);
  } catch (err) {
    errorLogger(req, err);
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
