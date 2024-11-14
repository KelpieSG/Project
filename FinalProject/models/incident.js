let mongoose = require('mongoose')

let incidentModel = mongoose.Schema({
    Username: String,
    Location: String,
    Incident_Date: Date,
    Report_Date: Date,
    Incident_Type: String,
    Injury_Count: String},
{
    collection: "Reports"
}

)
module.exports = mongoose.model('Incident', incidentModel);



  