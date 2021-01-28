const express = require('express')
const axios = require('axios')
const routes = new express.Router() 
const yup = require('yup')
const EstablishmentSchema = require('./schemas/establishment')

routes.get('/',(req,res)=>{
  return res.send('ok')
})

routes.post('/establishment',async (req,res)=>{
  const schema = yup.object().shape({
    name: yup.string().required(),
    lat: yup.number().required(),
    lng: yup.number().required(),
    potential_tpv: yup.number().required(),
    segment: yup.string().required()
  })
  if(!(await schema.isValid(req.body)))
    return res.status(400).json({response: 'Invalid fields'})
  
  const {lat, lng} = req.body;
  const response = await axios.get(
  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyD38JSwDr0VQteTwqnl5UuIqYP8gAfu0AE`
  );
  const adress = `${response.data.results[0].formatted_address}`
  try {
    
    await EstablishmentSchema.create(
      {...req.body, 
        adress, 
        negociation_status:'FRIA', 
        visits_count: 0,
        transactions: 0
      })
    return res.status(201).json({response: 'Establishment successfull created'})
  } catch (error) {
    return res.status(500).json(error)
  }

})

routes.get('/establishment', async (req,res)=>{
  const establishments = await EstablishmentSchema.find();

  return res.json(establishments)
}) 

routes.post('/establishment/:establishment_id/proposte', async (req,res)=>{
  const schema = yup.object().shape({
    proposte: yup.string().required(),
  })
  if(!(await schema.isValid(req.body)))
    return res.status(400).json({response: 'Invalid fields'})
  
  const establishment = await EstablishmentSchema.findById(req.params.establishment_id);
  establishment.negociation_status='QUENTE';
  establishment.proposte = req.body.proposte;
  await establishment.save();

  return res.json(establishment)
})

routes.post('/establishment/:establishment_id/visit', async (req,res)=>{
  
  const schema = yup.object().shape({
    date: yup.date().required(),
  })
  if(!(await schema.isValid(req.body)))
    return res.status(400).json({response: 'Invalid fields'})
  
  const establishment = await EstablishmentSchema.findById(req.params.establishment_id)

  establishment.next_visit = req.body.date;

  await establishment.save()

  return res.json(establishment)
})

routes.get('/establishment/:establishment_id', async (req,res)=>{
  const establishments = await EstablishmentSchema.findById(req.params.establishment_id)

  return res.json(establishments)
})


module.exports = routes;
