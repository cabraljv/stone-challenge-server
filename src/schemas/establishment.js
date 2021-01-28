const { Schema, model } = require('mongoose')

const EstablishmentSchema = new Schema({
  name: String,
  adress: String,
  lat: Number,
  lng: Number,
  potential_tpv: Number,
  segment: String,
  last_visit: Date,
  next_visit: Date,
  negociation_status: String,
  visits_count: Number,
  commercial_proposal: String,
  transactions: Number,
  satisfaction_indicator: Number,
  proposte: String,
}, {
  timestamps: true,
});

module.exports = model('Establishment', EstablishmentSchema);