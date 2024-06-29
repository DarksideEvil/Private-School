const CheckoutModel = require("../models/checkOut");
const PupilModel = require("../models/pupil");
const { Types } = require("mongoose");
const moment = require("moment");

async function checkOut(req, res) {
  const { id } = req.params;
  const startOfToday = moment().startOf("day").toDate();
  const endOfToday = moment().endOf("day").toDate();
  try {
    const existCheckout = await CheckoutModel.findOne({
      pupil: id,
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    }).sort("-updatedAt");

    let newCondition = {};

    if (
      existCheckout &&
      existCheckout.checkIn !== null &&
      existCheckout.checkOut !== null
    ) {
      return res.status(400).json({ msg: `You've already marked for today !` });
    } else if (existCheckout && existCheckout.checkOut === null) {
      existCheckout.checkOut = moment().format("YYYY-MM-DD HH:mm");
      newCondition = await existCheckout.save();
    } else {
      const newEntry = new CheckoutModel({
        pupil: id,
        checkIn: moment().format("YYYY-MM-DD HH:mm"),
        checkOut: null,
      });
      newCondition = await newEntry.save();
    }

    const result = await newCondition.populate("pupil", "firstname lastname");

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function todayAttendance(req, res) {
  const startDate = req.query.startDate
    ? moment(req.query.startDate, moment.ISO_8601).toDate()
    : moment().startOf("day").toDate();
  const endDate = req.query.endDate
    ? moment(req.query.endDate, moment.ISO_8601).toDate()
    : moment().endOf("day").toDate();

  const page = parseInt(req.query?.page) || 1;
  const limit = parseInt(req.query?.limit) || 10;
  try {
    const aggregationPipeline = [
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $addFields: {
          id: "$_id",
        },
      },
      {
        $group: {
          _id: "$pupil",
          id: { $last: "$_id" },
          checkIn: { $last: "$checkIn" },
          checkOut: { $last: "$checkOut" },
          createdAt: { $last: "$createdAt" },
          updatedAt: { $last: "$updatedAt" },
        },
      },
      {
        $lookup: {
          from: "pupils",
          foreignField: "_id",
          localField: "_id",
          as: "pupilsDetail",
        },
      },
      {
        $unwind: "$pupilsDetail",
      },
      {
        $lookup: {
          from: "groups",
          foreignField: "_id",
          localField: "pupilsDetail.group",
          as: "groupsDetail",
        },
      },
      {
        $unwind: "$groupsDetail",
      },
      {
        $project: {
          _id: "$id",
          pupil: {
            firstname: "$pupilsDetail.firstname",
            lastname: "$pupilsDetail.lastname",
            group: "$groupsDetail.name",
          },
          checkIn: 1,
          checkOut: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    if (req.query?.group) {
      if (req.query?.group.length !== 24) {
        return res.status(400).json({ msg: `Invalid group identifier !` });
      }

      aggregationPipeline.splice(6, 0, {
        $match: {
          "groupsDetail._id": new Types.ObjectId(req.query?.group),
        },
      });
    }

    const aggregation = CheckoutModel.aggregate(aggregationPipeline);

    const options = {
      page,
      limit,
    };
    const todayAttendance = await CheckoutModel.aggregatePaginate(
      aggregation,
      options
    );

    return res.status(200).json(todayAttendance);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function groupCheckout(req, res) {
  const { group, month } = req.query;
  try {
    if (group && group?.length !== 24) {
      return res.status(400).json({ msg: `Invalid group identifier !` });
    }

    let aggregation = [];

    const startDate = moment(month, "YYYY-MM").startOf("month").toDate();
    const endDate = moment(startDate).endOf("month").toDate();
    const daysInMonth = moment(endDate).date();
    const fullMonthDays = Array.from({ length: daysInMonth }, (_, i) =>
      moment(startDate).add(i, "days").format("YYYY-MM-DD")
    );

    if (group && month) {
      aggregation = await PupilModel.aggregate([
        {
          $facet: {
            docs: [
              {
                $match: {
                  group: new Types.ObjectId(group),
                },
              },
              {
                $lookup: {
                  from: "checkouts",
                  let: { pupilId: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$pupil", "$$pupilId"] },
                            {
                              $gte: [
                                {
                                  $dateFromString: {
                                    dateString: "$checkIn",
                                    format: "%Y-%m-%d %H:%M",
                                  },
                                },
                                ,
                              ],
                            },
                            {
                              $lte: [
                                {
                                  $dateFromString: {
                                    dateString: "$checkOut",
                                    format: "%Y-%m-%d %H:%M",
                                  },
                                },
                                endDate,
                              ],
                            },
                          ],
                        },
                      },
                    },
                    {
                      $project: {
                        _id: 1,
                        checkIn: 1,
                        checkOut: 1,
                        day: {
                          $dateToString: {
                            date: {
                              $dateFromString: {
                                dateString: "$checkIn",
                                format: "%Y-%m-%d %H:%M",
                              },
                            },
                            format: "%Y-%m-%d",
                          },
                        },
                        studyHours: {
                          $dateDiff: {
                            startDate: {
                              $dateFromString: {
                                dateString: "$checkIn",
                                format: "%Y-%m-%d %H:%M",
                              },
                            },
                            endDate: {
                              $dateFromString: {
                                dateString: "$checkOut",
                                format: "%Y-%m-%d %H:%M",
                              },
                            },
                            unit: "hour",
                          },
                        },
                      },
                    },

                    {
                      $group: {
                        _id: "$day",
                        checkIn: { $first: "$checkIn" },
                        checkOut: { $first: "$checkOut" },
                        studyHours: { $first: "$studyHours" },
                      },
                    },
                  ],
                  as: "eachCheckout",
                },
              },
              {
                $project: {
                  _id: 1,
                  firstname: 1,
                  lastname: 1,
                  attendance: {
                    $map: {
                      input: fullMonthDays,
                      as: "day",
                      in: {
                        $let: {
                          vars: {
                            attendanceRecord: {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: "$eachCheckout",
                                    as: "record",
                                    cond: { $eq: ["$$day", "$$record._id"] },
                                  },
                                },
                                0,
                              ],
                            },
                          },
                          in: {
                            day: "$$day",
                            status: {
                              $cond: {
                                if: {
                                  $and: [
                                    {
                                      $ifNull: [
                                        "$$attendanceRecord.checkIn",
                                        false,
                                      ],
                                    },
                                    {
                                      $ifNull: [
                                        "$$attendanceRecord.checkOut",
                                        false,
                                      ],
                                    },
                                  ],
                                },
                                then: 1,
                                else: {
                                  $cond: {
                                    if: {
                                      $and: [
                                        {
                                          $ne: [
                                            "$$attendanceRecord.checkIn",
                                            null,
                                          ],
                                        },
                                        {
                                          $eq: [
                                            "$$attendanceRecord.checkOut",
                                            null,
                                          ],
                                        },
                                      ],
                                    },
                                    then: 2,
                                    else: 0,
                                  },
                                },
                              },
                            },
                            studyHours: {
                              $ifNull: ["$$attendanceRecord.studyHours", null],
                            },
                            checkIn: {
                              $ifNull: ["$$attendanceRecord.checkIn", null],
                            },
                            checkOut: {
                              $ifNull: ["$$attendanceRecord.checkOut", null],
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  firstname: 1,
                  lastname: 1,
                  attendance: 1,
                  isUnrecordedDeparture: {
                    $cond: {
                      if: {
                        $anyElementTrue: [
                          {
                            $map: {
                              input: "$attendance",
                              as: "attendanceDetail0",
                              in: {
                                $and: [
                                  {
                                    $ne: ["$$attendanceDetail0.checkIn", null],
                                  },
                                  {
                                    $eq: ["$$attendanceDetail0.checkOut", null],
                                  },
                                ],
                              },
                            },
                          },
                        ],
                      },
                      then: true,
                      else: false,
                    },
                  },
                  isAllAbsent: {
                    $cond: {
                      if: {
                        $allElementsTrue: [
                          {
                            $map: {
                              input: "$attendance",
                              as: "attendanceDetail1",
                              in: {
                                $eq: ["$$attendanceDetail1.status", 0],
                              },
                            },
                          },
                        ],
                      },
                      then: true,
                      else: false,
                    },
                  },
                  isAllPresent: {
                    $cond: {
                      if: {
                        $anyElementTrue: [
                          {
                            $map: {
                              input: "$attendance",
                              as: "attendanceDetail2",
                              in: {
                                $or: [
                                  {
                                    $ifNull: [
                                      "$$attendanceDetail2.checkIn",
                                      true,
                                    ],
                                  },
                                  {
                                    $ifNull: [
                                      "$$attendanceDetail2.checkOut",
                                      true,
                                    ],
                                  },
                                ],
                              },
                            },
                          },
                        ],
                      },
                      then: false,
                      else: true,
                    },
                  },
                },
              },
            ],

            groups: [
              {
                $group: {
                  _id: null,
                  groups: { $addToSet: "$group" },
                },
              },
              {
                $lookup: {
                  from: "groups",
                  localField: "groups",
                  foreignField: "_id",
                  as: "groups",
                },
              },
              {
                $unwind: "$groups",
              },
              {
                $replaceRoot: { newRoot: "$groups" },
              },
            ],
          },
        },
      ]);
    }

    return res.status(200).json(aggregation[0]);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function getAll(req, res) {
  try {
    const allCheckouts = await CheckoutModel.find().populate(
      "pupil",
      "firstname lastname"
    );

    return res.status(200).json(allCheckouts);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function getOne(req, res) {
  try {
    const singleCheckout = await CheckoutModel.findById(req.params.id).populate(
      "pupil",
      "firstname lastname"
    );
    if (!singleCheckout || req.params.id.length !== 24) {
      return res.status(404).json({ msg: `Checkout not found !` });
    }

    return res.status(200).json(singleCheckout);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function editOne(req, res) {
  try {
    const modifiedCheckout = await CheckoutModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!modifiedCheckout || req.params.id.length !== 24) {
      return res.status(404).json({ msg: `Checkout not found !` });
    }

    return res.status(200).json(modifiedCheckout);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

async function deleteOne(req, res) {
  try {
    const deletedCheckout = await CheckoutModel.findByIdAndDelete(
      req.params.id
    );

    if (deletedCheckout === null || req.params.id.length !== 24) {
      return res.status(404).json({ msg: `Checkout not found !` });
    }

    return res.status(200).json(deletedCheckout);
  } catch (err) {
    return res.status(500).json({ msg: err.message ? err.message : err });
  }
}

module.exports = {
  checkOut,
  todayAttendance,
  groupCheckout,
  getAll,
  getOne,
  editOne,
  deleteOne,
};
