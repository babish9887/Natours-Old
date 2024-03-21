const Tour=require('../models/tourModel');


exports.getOverview = async (req, res) => {
  try{
    const tours=await Tour.find();
    res.status(200).render('overview', {
      title: 'All tours',
      tours
    });
  } catch(e){
    res.json({
      status: 'Fail'
    })    
  }
};

  exports.getTour=async(req, res) => {
    try{
      const tour=await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
      });


      res.status(200).render('tour', {
        title: 'The Forest Hiker tours',
        tour
        });
      } catch(e){
        res.json({
          status: 'Fail'
        })    
      }
  }


