const PupilModel = require("../models/pupil");
const CheckoutModel = require("../models/checkout");
const { infoLogger, errorLogger } = require("../utils/errorHandler");
const { sign, verify } = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const moment = require("moment");

// function generateVerificationCode() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

async function parentAccess(req, res) {
  try {
    const existPupil = await PupilModel.findOne({
      "parent.phone": req.body?.phone,
    });
    if (!existPupil) {
      const msg = `Failed, perhaps parent's mobile number not specified or invalid input number !`;
      //   errorLogger(req, msg, 400);
      return res.status(400).json({ msg });
    }

    if (process.env.PARENT_VERIFICATION !== req.body.verificationCode) {
      const msg = `Invalid verification code !`;
      return res.status(400).json({ msg });
    }

    // const response = {
    //   mobile_phone: existPupil?.parent?.phone,
    //   message: `Your verification code: ${generateVerificationCode()}`,
    //   from: 4546,
    // };

    const token = sign(
      {
        pupil: existPupil?._id,
        phone: existPupil?.parent?.phone,
        role: "parent",
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_PARENT_EXPIRE }
    );

    return res.status(200).json({
      msg: `Success, thank you for being an active participant in your child's education !`,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message ? err.message : err,
    });
  }
}

async function pupilReports(req, res) {
  // const { startDate, endDate } = req.query;
  try {
    const startDate = moment(req.query.startDate).startOf("date").toDate();
    const endDate = moment(req.query.endDate).endOf("date").toDate();
    const daysInMonth = moment(endDate).diff(startDate, "days");
    const fullMonthDays = Array.from({ length: daysInMonth + 1 }, (_, i) =>
      moment(startDate).add(i, "days").format("YYYY-MM-DD")
    );
    // console.log(startDate, "- st", endDate, "- end", moment(startDate).format("YYYY-MM-DD hh:mm"), '- st for', moment(endDate).format("YYYY-MM-DD hh:mm"), '- end for',);
    let pupilReports = [];

    if (startDate && endDate) {
      pupilReports = await PupilModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.query.pupil),
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
                $addFields: {
                  totalMinutes: {
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
                      unit: "minute",
                    },
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
                    hours: {
                      $toInt: {
                        $floor: { $divide: ["$totalMinutes", 60] },
                      },
                    },
                    minutes: {
                      $toInt: { $mod: ["$totalMinutes", 60] },
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
                                $ifNull: ["$$attendanceRecord.checkIn", false],
                              },
                              {
                                $ifNull: ["$$attendanceRecord.checkOut", false],
                              },
                            ],
                          },
                          then: 1,
                          else: {
                            $cond: {
                              if: {
                                $and: [
                                  {
                                    $ne: ["$$attendanceRecord.checkIn", null],
                                  },
                                  {
                                    $eq: ["$$attendanceRecord.checkOut", null],
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
                              $ifNull: ["$$attendanceDetail2.checkIn", true],
                            },
                            {
                              $ifNull: ["$$attendanceDetail2.checkOut", true],
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
      ]);
    }

    return res.status(200).json(pupilReports);
  } catch (err) {
    return res.status(500).json({
      msg: err.message ? err.message : err,
    });
  }
}

module.exports = {
  parentAccess,
  pupilReports,
};
