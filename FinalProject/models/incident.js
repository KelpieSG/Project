let mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  Location: {
    type: String,
    required: true,
  },
  Incident_Date: {
    type: Date,
    required: true,
  },
  Report_Date: {
    type: Date,
    default: Date.now,
  },
  Incident_Type: {
    type: String,
    required: true,
  },
  Injury_Count: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Incident', incidentSchema);
