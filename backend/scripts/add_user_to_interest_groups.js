const mongoose = require('mongoose');
const Student = require('../models/Student');
const Group = require('../models/Group');
require('dotenv').config();

async function addUserToInterestGroups(email) {
  await mongoose.connect(process.env.MONGODB_URI);
  const student = await Student.findOne({ email });
  if (!student) {
    console.error('Student not found');
    process.exit(1);
  }
  if (!Array.isArray(student.interests)) {
    console.log('No interests found for user.');
    process.exit(0);
  }
  for (const interest of student.interests) {
    let group = await Group.findOne({ name: interest });
    if (!group) {
      group = await Group.create({ name: interest, members: [student._id], admins: [student._id], description: `${interest} group`, createdBy: student._id });
      console.log(`Created group: ${interest}`);
    } else {
      let updated = false;
      if (!group.members.includes(student._id)) {
        group.members.push(student._id);
        updated = true;
      }
      if (!group.admins.includes(student._id)) {
        group.admins.push(student._id);
        updated = true;
      }
      if (updated) {
        await group.save();
        console.log(`Updated group: ${interest}`);
      }
    }
  }
  console.log('Done.');
  process.exit(0);
}

// Usage: node scripts/add_user_to_interest_groups.js user@example.com
const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/add_user_to_interest_groups.js user@example.com');
  process.exit(1);
}
addUserToInterestGroups(email); 