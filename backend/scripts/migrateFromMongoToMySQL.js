const mongoose = require('mongoose');
const { sequelize, User, ChatMessage, Gig, Order, Group } = require('../models');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB Models (simplified for migration)
const MongoUser = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
const MongoChatMessage = mongoose.model('ChatMessage', new mongoose.Schema({}, { strict: false }));
const MongoGig = mongoose.model('Gig', new mongoose.Schema({}, { strict: false }));
const MongoOrder = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
const MongoGroup = mongoose.model('Group', new mongoose.Schema({}, { strict: false }));

const migrateData = async () => {
  try {
    console.log('🔄 Starting MongoDB to MySQL migration...');
    
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('💡 Set MONGODB_URI in your .env file to migrate existing data');
      return;
    }
    
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Connect to MySQL
    console.log('📡 Connecting to MySQL...');
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');
    
    // Sync MySQL database (create tables)
    console.log('🔧 Creating MySQL tables...');
    await sequelize.sync({ force: false }); // Set to true to recreate tables
    console.log('✅ MySQL tables ready');
    
    // Migrate Users
    console.log('\n👤 Migrating Users...');
    const mongoUsers = await MongoUser.find({}).lean();
    console.log(`📊 Found ${mongoUsers.length} users in MongoDB`);
    
    let userIdMapping = {};
    for (const mongoUser of mongoUsers) {
      try {
        const mysqlUser = await User.create({
          username: mongoUser.username,
          email: mongoUser.email,
          password: mongoUser.password,
          displayName: mongoUser.displayName,
          avatar: mongoUser.avatar,
          phoneNumber: mongoUser.phoneNumber,
          course: mongoUser.course,
          year: mongoUser.year,
          experienceLevel: mongoUser.experienceLevel,
          skills: mongoUser.skills || [],
          bio: mongoUser.bio,
          rating: mongoUser.rating || 0,
          location: mongoUser.location || {},
          languages: mongoUser.languages || [],
          portfolio: mongoUser.portfolio || [],
          role: mongoUser.role || 'student',
          isVerified: mongoUser.isVerified || false,
          googleId: mongoUser.googleId,
          googleEmail: mongoUser.googleEmail,
          authProvider: mongoUser.authProvider || 'local',
          biometricEnabled: mongoUser.biometricEnabled || false,
          biometricCredentials: mongoUser.biometricCredentials || [],
          biometricAuthHistory: mongoUser.biometricAuthHistory || [],
          loginHistory: mongoUser.loginHistory || [],
          resetPasswordToken: mongoUser.resetPasswordToken,
          resetPasswordExpires: mongoUser.resetPasswordExpires,
          verificationCode: mongoUser.verificationCode,
          verificationCodeExpires: mongoUser.verificationCodeExpires,
          lastActivity: mongoUser.lastActivity,
          sessionExpiresAt: mongoUser.sessionExpiresAt,
          createdAt: mongoUser.createdAt,
          updatedAt: mongoUser.updatedAt
        });
        
        // Map MongoDB ObjectId to MySQL ID
        userIdMapping[mongoUser._id.toString()] = mysqlUser.id;
      } catch (error) {
        console.warn(`⚠️ Failed to migrate user ${mongoUser.email}:`, error.message);
      }
    }
    console.log(`✅ Migrated ${Object.keys(userIdMapping).length} users`);
    
    // Migrate Groups
    console.log('\n👥 Migrating Groups...');
    const mongoGroups = await MongoGroup.find({}).lean();
    console.log(`📊 Found ${mongoGroups.length} groups in MongoDB`);
    
    let groupIdMapping = {};
    for (const mongoGroup of mongoGroups) {
      try {
        // Convert member ObjectIds to MySQL user IDs
        const members = mongoGroup.members 
          ? mongoGroup.members.map(id => userIdMapping[id.toString()]).filter(Boolean)
          : [];
        
        const admins = mongoGroup.admins 
          ? mongoGroup.admins.map(id => userIdMapping[id.toString()]).filter(Boolean)
          : [];
        
        const mysqlGroup = await Group.create({
          name: mongoGroup.name,
          avatar: mongoGroup.avatar,
          category: mongoGroup.category,
          description: mongoGroup.description,
          createdById: userIdMapping[mongoGroup.createdBy?.toString()],
          members: members,
          admins: admins,
          createdAt: mongoGroup.createdAt,
          updatedAt: mongoGroup.updatedAt
        });
        
        groupIdMapping[mongoGroup._id.toString()] = mysqlGroup.id;
      } catch (error) {
        console.warn(`⚠️ Failed to migrate group ${mongoGroup.name}:`, error.message);
      }
    }
    console.log(`✅ Migrated ${Object.keys(groupIdMapping).length} groups`);
    
    // Migrate Gigs
    console.log('\n💼 Migrating Gigs...');
    const mongoGigs = await MongoGig.find({}).lean();
    console.log(`📊 Found ${mongoGigs.length} gigs in MongoDB`);
    
    let gigIdMapping = {};
    for (const mongoGig of mongoGigs) {
      try {
        const mysqlGig = await Gig.create({
          sellerId: userIdMapping[mongoGig.seller?.toString()],
          title: mongoGig.title,
          description: mongoGig.description,
          category: mongoGig.category,
          subcategory: mongoGig.subcategory,
          tags: mongoGig.tags || [],
          pricing: mongoGig.pricing || {},
          packages: mongoGig.packages || [],
          images: mongoGig.images || [],
          attachments: mongoGig.attachments || [],
          requirements: mongoGig.requirements || [],
          stats: mongoGig.stats || { views: 0, orders: 0, rating: 0, reviews: 0 },
          status: mongoGig.status || 'draft',
          featured: mongoGig.featured || false,
          verified: mongoGig.verified || false,
          location: mongoGig.location || {},
          languages: mongoGig.languages || [],
          skills: mongoGig.skills || [],
          portfolio: mongoGig.portfolio || [],
          availability: mongoGig.availability || 'available',
          responseTime: mongoGig.responseTime || 24,
          completionRate: mongoGig.completionRate || 100,
          createdAt: mongoGig.createdAt,
          updatedAt: mongoGig.updatedAt
        });
        
        gigIdMapping[mongoGig._id.toString()] = mysqlGig.id;
      } catch (error) {
        console.warn(`⚠️ Failed to migrate gig ${mongoGig.title}:`, error.message);
      }
    }
    console.log(`✅ Migrated ${Object.keys(gigIdMapping).length} gigs`);
    
    // Migrate Orders
    console.log('\n📦 Migrating Orders...');
    const mongoOrders = await MongoOrder.find({}).lean();
    console.log(`📊 Found ${mongoOrders.length} orders in MongoDB`);
    
    for (const mongoOrder of mongoOrders) {
      try {
        await Order.create({
          buyerId: userIdMapping[mongoOrder.buyer?.toString()],
          sellerId: userIdMapping[mongoOrder.seller?.toString()],
          gigId: gigIdMapping[mongoOrder.gig?.toString()],
          package: mongoOrder.package || {},
          requirements: mongoOrder.requirements || [],
          status: mongoOrder.status || 'pending',
          payment: mongoOrder.payment || {},
          delivery: mongoOrder.delivery || {},
          revision: mongoOrder.revision || {},
          messages: mongoOrder.messages || [],
          rating: mongoOrder.rating || {},
          timeline: mongoOrder.timeline || [],
          cancellation: mongoOrder.cancellation || {},
          dispute: mongoOrder.dispute || {},
          createdAt: mongoOrder.createdAt,
          updatedAt: mongoOrder.updatedAt
        });
      } catch (error) {
        console.warn(`⚠️ Failed to migrate order:`, error.message);
      }
    }
    console.log(`✅ Migrated orders`);
    
    // Migrate Chat Messages
    console.log('\n💬 Migrating Chat Messages...');
    const mongoChatMessages = await MongoChatMessage.find({}).lean();
    console.log(`📊 Found ${mongoChatMessages.length} chat messages in MongoDB`);
    
    const batchSize = 1000;
    for (let i = 0; i < mongoChatMessages.length; i += batchSize) {
      const batch = mongoChatMessages.slice(i, i + batchSize);
      const chatMessages = batch.map(mongoMessage => ({
        messageId: mongoMessage.messageId || mongoMessage._id.toString(),
        groupId: mongoMessage.groupId,
        conversationId: mongoMessage.conversationId,
        messageType: mongoMessage.messageType,
        userId: mongoMessage.userId,
        userName: mongoMessage.userName,
        userAvatar: mongoMessage.userAvatar,
        role: mongoMessage.role,
        message: mongoMessage.message,
        content: mongoMessage.content,
        contentType: mongoMessage.contentType || 'text',
        status: mongoMessage.status || 'sent',
        mediaUrl: mongoMessage.mediaUrl,
        fileName: mongoMessage.fileName,
        fileSize: mongoMessage.fileSize,
        fileType: mongoMessage.fileType,
        duration: mongoMessage.duration,
        timestamp: mongoMessage.timestamp,
        replyTo: mongoMessage.replyTo,
        isEdited: mongoMessage.isEdited || false,
        editedAt: mongoMessage.editedAt,
        reactions: mongoMessage.reactions || [],
        isDeleted: mongoMessage.isDeleted || false,
        deletedBy: mongoMessage.deletedBy || [],
        deletedAt: mongoMessage.deletedAt,
        isAIMessage: mongoMessage.isAIMessage || false,
        userProfile: mongoMessage.userProfile || {},
        metadata: mongoMessage.metadata || {},
        createdAt: mongoMessage.createdAt,
        updatedAt: mongoMessage.updatedAt
      }));
      
      try {
        await ChatMessage.bulkCreate(chatMessages, { ignoreDuplicates: true });
        console.log(`📝 Migrated batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(mongoChatMessages.length/batchSize)}`);
      } catch (error) {
        console.warn(`⚠️ Failed to migrate chat message batch:`, error.message);
      }
    }
    console.log(`✅ Migrated chat messages`);
    
    // Close connections
    await mongoose.disconnect();
    await sequelize.close();
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('📊 Migration Summary:');
    console.log(`   👤 Users: ${Object.keys(userIdMapping).length}`);
    console.log(`   👥 Groups: ${Object.keys(groupIdMapping).length}`);
    console.log(`   💼 Gigs: ${Object.keys(gigIdMapping).length}`);
    console.log(`   📦 Orders: ${mongoOrders.length}`);
    console.log(`   💬 Chat Messages: ${mongoChatMessages.length}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
migrateData();
