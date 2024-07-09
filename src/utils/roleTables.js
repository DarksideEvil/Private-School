const RoleTable = {
  admin: [
    { resource: "user", permissions: ["read", "write", "update", "delete"] },
    { resource: "group", permissions: ["read", "write", "update", "delete"] },
    { resource: "pupil", permissions: ["read", "write", "update", "delete"] },
    {
      resource: "checkout",
      permissions: ["read", "write", "update", "delete"],
    },
    { resource: "parent", permissions: ["read"] },
  ],
  boss: [
    { resource: "user", permissions: ["read"] },
    { resource: "group", permissions: ["read"] },
    { resource: "pupil", permissions: ["read"] },
    { resource: "checkout", permissions: ["read"] },
    { resource: "parent", permissions: ["read"] },
  ],
  device: [{ resource: "checkout", permissions: ["read", "write"] }],
  parent: [{ resource: "parent", permissions: ["read"] }],
};

module.exports = RoleTable;
