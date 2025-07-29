const mongoose = require('mongoose');
const Student = require('../models/Student');
const Group = require('../models/Group');
const Message = require('../models/Message');
require('dotenv').config();

async function addUserToAllGroups(email) {
  await mongoose.connect(process.env.MONGODB_URI);
  const student = await Student.findOne({ email });
  if (!student) {
    console.error('Student not found');
    process.exit(1);
  }
  const groups = await Group.find();
  for (const group of groups) {
    let updated = false;
    let joined = false;
    if (!group.members.includes(student._id)) {
      group.members.push(student._id);
      updated = true;
      joined = true;
    }
    if (!group.admins.includes(student._id)) {
      group.admins.push(student._id);
      updated = true;
    }
    if (updated) {
      await group.save();
      console.log(`Updated group: ${group.name}`);
    }
    if (joined) {
      const msg = await Message.create({
        group: group._id,
        content: `${student.fullname || student.email} joined the group`,
        type: 'system',
      });
      group.messages.push(msg._id);
      await group.save();
      console.log(`Added join message to group: ${group.name}`);
    }
  }
  console.log('Done.');
  process.exit(0);
}

// Usage: node scripts/add_user_to_all_groups.js user@example.com
const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/add_user_to_all_groups.js user@example.com');
  process.exit(1);
}
addUserToAllGroups(email); 