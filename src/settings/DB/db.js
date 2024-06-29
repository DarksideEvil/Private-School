const { connect } = require("mongoose");

module.exports = async (req, res) => {
  try {
    await connect(process.env.DB_URL, { serverSelectionTimeoutMS: 30000});
    console.log(`DB's online...`);
  } catch (err) {
    console.log(err.message ? err.message : err);
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
};
