const Event = require('../models/Event');
const { sanitizeMessage } = require('../utils/sanitizer');

// Get all events/news
exports.getAll = async (req, res) => {
  try {
    const events = await Event.find().sort('-date');
    res.status(200).json({ status: 'success', data: { events } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get single event/news
exports.getOne = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ status: 'error', message: 'Event not found' });
    res.status(200).json({ status: 'success', data: { event } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Admin: Create event/news
exports.create = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const imageUrl = req.file ? req.file.path : undefined;
    const event = await Event.create({
      title: sanitizeMessage(title),
      description: sanitizeMessage(description),
      date,
      location: sanitizeMessage(location),
      imageUrl,
      createdBy: req.user._id
    });
    res.status(201).json({ status: 'success', data: { event } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Admin: Update event/news
exports.update = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const imageUrl = req.file ? req.file.path : undefined;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: sanitizeMessage(title),
        description: sanitizeMessage(description),
        date,
        location: sanitizeMessage(location),
        ...(imageUrl && { imageUrl })
      },
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ status: 'error', message: 'Event not found' });
    res.status(200).json({ status: 'success', data: { event } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Admin: Delete event/news
exports.delete = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}; 