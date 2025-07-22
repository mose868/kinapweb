const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

// ================== PUBLIC EVENT ROUTES ==================

// Get all upcoming events (public)
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      eventType, 
      isFree,
      city,
      featured,
      startDate,
      endDate,
      search,
      limit = 20, 
      skip = 0 
    } = req.query;

    let options = { 
      limit: parseInt(limit), 
      skip: parseInt(skip),
      featured: featured === 'true'
    };
    
    if (category && category !== 'all') options.category = category;
    if (eventType && eventType !== 'all') options.eventType = eventType;
    if (isFree !== undefined) options.isFree = isFree === 'true';
    if (city && city !== 'all') options.city = city;

    let events;
    
    if (search) {
      // Text search
      let query = {
        status: { $in: ['Published', 'Registration Open'] },
        isPublished: true,
        'schedule.startDate': { $gte: new Date() },
        $text: { $search: search }
      };
      
      if (options.category) query.category = options.category;
      if (options.eventType) query.eventType = options.eventType;
      if (options.isFree !== undefined) query['pricing.isFree'] = options.isFree;
      if (options.city) query['location.city'] = options.city;
      if (options.featured) query.isFeatured = true;
      
      events = await Event.find(query, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' }, 'schedule.startDate': 1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .select('-attendees -reviews -internalNotes -moderationNotes -__v');
    } else if (startDate && endDate) {
      // Date range search
      events = await Event.getEventsByDateRange(
        new Date(startDate), 
        new Date(endDate), 
        options
      );
    } else {
      // Regular upcoming events
      events = await Event.getUpcomingEvents(options);
    }

    // Calculate total count for pagination
    let totalQuery = {
      status: { $in: ['Published', 'Registration Open'] },
      isPublished: true,
      'schedule.startDate': { $gte: new Date() }
    };
    
    if (options.category) totalQuery.category = options.category;
    if (options.eventType) totalQuery.eventType = options.eventType;
    if (options.isFree !== undefined) totalQuery['pricing.isFree'] = options.isFree;
    if (options.city) totalQuery['location.city'] = options.city;
    if (options.featured) totalQuery.isFeatured = true;
    if (search) totalQuery.$text = { $search: search };

    const total = await Event.countDocuments(totalQuery);

    res.json({
      events,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: skip > 0
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get featured events (public)
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const events = await Event.getFeaturedEvents(parseInt(limit));
    
    res.json({
      events,
      count: events.length
    });
  } catch (error) {
    console.error('Get featured events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get events for calendar view (public)
router.get('/calendar', async (req, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
    
    const events = await Event.getEventsByDateRange(startDate, endDate);
    
    // Format events for calendar
    const calendarEvents = events.map(event => ({
      id: event._id,
      title: event.title,
      start: event.schedule.startDate,
      end: event.schedule.endDate,
      url: event.eventUrl,
      color: getEventColor(event.category),
      extendedProps: {
        category: event.category,
        eventType: event.eventType,
        capacity: event.registration.capacity,
        registered: event.registration.registered,
        isFree: event.pricing.isFree,
        location: event.location.venue || 'Virtual'
      }
    }));
    
    res.json({ events: calendarEvents });
  } catch (error) {
    console.error('Get calendar events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single event by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const event = await Event.findOne({ 
      slug, 
      status: { $in: ['Published', 'Registration Open'] },
      isPublished: true
    }).select('-attendees -internalNotes -moderationNotes -__v');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Increment view count
    await event.incrementViews();

    // Add virtual properties to response
    const eventResponse = {
      ...event.toObject(),
      timeUntilEvent: event.timeUntilEvent,
      availabilityStatus: event.availabilityStatus,
      capacityPercentage: event.capacityPercentage,
      displayPrice: event.displayPrice,
      speakerCount: event.speakerCount
    };

    res.json(eventResponse);
  } catch (error) {
    console.error('Get event by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register for event (RSVP)
router.post('/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      email, 
      phone,
      organization,
      title,
      specialRequests,
      dietaryRestrictions,
      ticketType
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const event = await Event.findById(id);
    
    if (!event || !event.isPublished) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if registration is open
    if (!event.registration.isRegistrationOpen) {
      return res.status(400).json({ message: 'Registration is closed for this event' });
    }

    // Check registration deadline
    if (event.registration.registrationDeadline && 
        new Date() > event.registration.registrationDeadline) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    // Check if already registered
    const existingAttendee = event.attendees.find(att => att.email === email);
    if (existingAttendee) {
      return res.status(400).json({ 
        message: 'You are already registered for this event',
        registrationStatus: existingAttendee.status
      });
    }

    const attendeeData = {
      name,
      email,
      phone,
      organization,
      title,
      specialRequests,
      dietaryRestrictions,
      ticketType: ticketType || 'General'
    };

    try {
      await event.registerAttendee(attendeeData);
      
      const status = event.registration.registered >= event.registration.capacity ? 
        'Waitlisted' : 'Registered';

      res.status(201).json({ 
        message: status === 'Waitlisted' ? 
          'You have been added to the waitlist' : 
          'Registration successful!',
        registrationStatus: status,
        event: {
          title: event.title,
          date: event.schedule.startDate,
          location: event.location.venue || 'Virtual'
        }
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel registration
router.delete('/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    try {
      await event.cancelRegistration(email);
      
      res.json({ 
        message: 'Registration cancelled successfully',
        event: {
          title: event.title,
          date: event.schedule.startDate
        }
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review to event (public)
router.post('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      attendeeName, 
      attendeeEmail,
      rating, 
      comment,
      wouldRecommend,
      suggestions
    } = req.body;

    if (!attendeeName || !rating || !rating.overall) {
      return res.status(400).json({ message: 'Attendee name and overall rating are required' });
    }

    // Validate rating values
    const ratingFields = ['overall', 'content', 'speakers', 'organization', 'value'];
    for (const field of ratingFields) {
      if (rating[field] && (rating[field] < 1 || rating[field] > 5)) {
        return res.status(400).json({ message: `${field} rating must be between 1 and 5` });
      }
    }

    const event = await Event.findById(id);
    
    if (!event || !event.isPublished) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event has ended
    if (new Date() <= event.schedule.endDate) {
      return res.status(400).json({ message: 'You can only review events after they have ended' });
    }

    const reviewData = {
      attendeeName,
      attendeeEmail,
      rating: {
        overall: parseInt(rating.overall),
        content: parseInt(rating.content) || parseInt(rating.overall),
        speakers: parseInt(rating.speakers) || parseInt(rating.overall),
        organization: parseInt(rating.organization) || parseInt(rating.overall),
        value: parseInt(rating.value) || parseInt(rating.overall)
      },
      comment: comment || '',
      wouldRecommend: wouldRecommend || false,
      suggestions: suggestions || '',
      date: new Date(),
      isPublic: true,
      isVerified: false
    };

    await event.addReview(reviewData);

    res.json({ 
      message: 'Review added successfully',
      ratings: event.ratings
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event categories and metadata (public)
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Event.distinct('category', { 
      status: { $in: ['Published', 'Registration Open'] },
      isPublished: true
    });

    const eventTypes = await Event.distinct('eventType', { 
      status: { $in: ['Published', 'Registration Open'] },
      isPublished: true
    });

    const cities = await Event.distinct('location.city', { 
      status: { $in: ['Published', 'Registration Open'] },
      isPublished: true
    });

    const categoriesWithCounts = await Event.aggregate([
      { 
        $match: { 
          status: { $in: ['Published', 'Registration Open'] },
          isPublished: true,
          'schedule.startDate': { $gte: new Date() }
        } 
      },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({ 
      categories,
      eventTypes,
      cities,
      categoriesWithCounts: categoriesWithCounts.map(cat => ({
        category: cat._id,
        count: cat.count
      }))
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get upcoming events by category (public)
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;
    
    const events = await Event.getUpcomingEvents({ 
      category: category, 
      limit: parseInt(limit) 
    });
    
    res.json({ 
      category,
      events,
      count: events.length
    });
  } catch (error) {
    console.error('Get events by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================== ADMIN ROUTES ==================

// Get all events for admin (includes unpublished)
router.get('/admin/all', async (req, res) => {
  try {
    const { 
      category, 
      eventType, 
      status,
      startDate,
      endDate,
      limit = 100, 
      skip = 0 
    } = req.query;

    let query = {};

    if (category && category !== 'all') query.category = category;
    if (eventType && eventType !== 'all') query.eventType = eventType;
    if (status && status !== 'all') query.status = status;
    
    if (startDate && endDate) {
      query['schedule.startDate'] = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-attendees');

    const total = await Event.countDocuments(query);

    res.json({
      events,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single event for admin (includes all data)
router.get('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get admin event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new event (admin)
router.post('/admin', async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      lastUpdatedBy: req.body.lastUpdatedBy || 'admin@ajirakinap.com'
    };

    // Validation
    if (!eventData.title || !eventData.description || !eventData.organizer.name || !eventData.organizer.email) {
      return res.status(400).json({ 
        message: 'Title, description, organizer name, and email are required' 
      });
    }

    if (!eventData.schedule.startDate || !eventData.schedule.endDate) {
      return res.status(400).json({ 
        message: 'Start date and end date are required' 
      });
    }

    const event = await Event.create(eventData);

    res.status(201).json({ 
      message: 'Event created successfully', 
      event 
    });
  } catch (error) {
    console.error('Create event error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Event with this title already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update existing event (admin)
router.put('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      lastUpdatedBy: req.body.lastUpdatedBy || 'admin@ajirakinap.com',
      updatedAt: new Date()
    };

    const event = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ 
      message: 'Event updated successfully', 
      event 
    });
  } catch (error) {
    console.error('Update event error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Event with this title already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event (admin)
router.delete('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event status (admin)
router.patch('/admin/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Draft', 'Published', 'Registration Open', 'Registration Closed', 'In Progress', 'Completed', 'Cancelled', 'Postponed'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Valid status required' });
    }

    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.updateStatus(status);

    res.json({ 
      message: `Event status updated to ${status}`, 
      event 
    });
  } catch (error) {
    console.error('Update event status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle published status (admin)
router.patch('/admin/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.isPublished = !event.isPublished;
    event.lastUpdatedBy = req.body.lastUpdatedBy || 'admin@ajirakinap.com';
    event.updatedAt = new Date();
    
    // Auto-update status
    if (event.isPublished && event.status === 'Draft') {
      event.status = 'Published';
    }
    
    await event.save();

    res.json({ 
      message: `Event ${event.isPublished ? 'published' : 'unpublished'} successfully`, 
      event 
    });
  } catch (error) {
    console.error('Toggle publish event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle featured status (admin)
router.patch('/admin/:id/feature', async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.isFeatured = !event.isFeatured;
    event.lastUpdatedBy = req.body.lastUpdatedBy || 'admin@ajirakinap.com';
    event.updatedAt = new Date();
    await event.save();

    res.json({ 
      message: `Event ${event.isFeatured ? 'featured' : 'unfeatured'} successfully`, 
      event 
    });
  } catch (error) {
    console.error('Toggle feature event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event attendees (admin)
router.get('/admin/:id/attendees', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    
    const event = await Event.findById(id).select('attendees title');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    let attendees = event.attendees;
    
    if (status && status !== 'all') {
      attendees = attendees.filter(att => att.status === status);
    }

    res.json({
      eventTitle: event.title,
      attendees,
      totalCount: event.attendees.length,
      filteredCount: attendees.length
    });
  } catch (error) {
    console.error('Get event attendees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export attendees (admin)
router.get('/admin/:id/attendees/export', async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'json' } = req.query;
    
    const event = await Event.findById(id).select('attendees title schedule');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (format === 'csv') {
      // CSV export
      const csvHeader = 'Name,Email,Phone,Organization,Title,Registration Date,Status,Payment Status\n';
      const csvRows = event.attendees.map(att => 
        `"${att.name}","${att.email}","${att.phone || ''}","${att.organization || ''}","${att.title || ''}","${att.registrationDate}","${att.status}","${att.paymentStatus}"`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${event.title}-attendees.csv"`);
      res.send(csvHeader + csvRows);
    } else {
      // JSON export
      res.json({
        event: {
          title: event.title,
          date: event.schedule.startDate,
          totalAttendees: event.attendees.length
        },
        attendees: event.attendees
      });
    }
  } catch (error) {
    console.error('Export attendees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event statistics (admin)
router.get('/admin/stats/overview', async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({ isPublished: true });
    const upcomingEvents = await Event.countDocuments({ 
      isPublished: true,
      'schedule.startDate': { $gte: new Date() }
    });
    const featuredEvents = await Event.countDocuments({ isFeatured: true });

    // Event categories stats
    const categoryStats = await Event.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Event types stats
    const typeStats = await Event.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Registration stats
    const registrationStats = await Event.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: null,
          totalRegistrations: { $sum: '$registration.registered' },
          totalCapacity: { $sum: '$registration.capacity' },
          totalViews: { $sum: '$analytics.views' }
        }
      }
    ]);

    // Popular events
    const popularEvents = await Event.find({ 
      isPublished: true,
      'analytics.views': { $gt: 0 }
    })
      .sort({ 'analytics.views': -1, 'registration.registered': -1 })
      .limit(5)
      .select('title analytics.views registration.registered category schedule.startDate');

    // Upcoming featured events
    const upcomingFeatured = await Event.find({
      isPublished: true,
      isFeatured: true,
      'schedule.startDate': { $gte: new Date() }
    })
      .sort({ 'schedule.startDate': 1 })
      .limit(5)
      .select('title schedule.startDate registration.registered registration.capacity');

    // Monthly event count
    const monthlyStats = await Event.aggregate([
      {
        $match: {
          isPublished: true,
          'schedule.startDate': { 
            $gte: new Date(new Date().getFullYear(), 0, 1) // This year
          }
        }
      },
      {
        $group: {
          _id: { 
            month: { $month: '$schedule.startDate' },
            year: { $year: '$schedule.startDate' }
          },
          count: { $sum: 1 },
          totalRegistrations: { $sum: '$registration.registered' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      eventStats: {
        totalEvents,
        publishedEvents,
        upcomingEvents,
        featuredEvents,
        categoryStats,
        typeStats,
        totalRegistrations: registrationStats[0]?.totalRegistrations || 0,
        totalCapacity: registrationStats[0]?.totalCapacity || 0,
        totalViews: registrationStats[0]?.totalViews || 0,
        popularEvents,
        upcomingFeatured,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to get event color based on category
function getEventColor(category) {
  const colors = {
    'Workshop': '#3B82F6',
    'Webinar': '#10B981', 
    'Networking': '#F59E0B',
    'Conference': '#8B5CF6',
    'Hackathon': '#EF4444',
    'Career Fair': '#06B6D4',
    'Training': '#84CC16',
    'Panel Discussion': '#F97316',
    'Startup Pitch': '#EC4899',
    'Tech Talk': '#6366F1',
    'Community Meetup': '#14B8A6',
    'Product Launch': '#DC2626',
    'Awards Ceremony': '#FBBF24',
    'Social Event': '#A855F7',
    'Other': '#6B7280'
  };
  
  return colors[category] || colors['Other'];
}

module.exports = router; 