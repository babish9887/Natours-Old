const Tour=require('../models/tourModel');
const User=require('../models/userModel');


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

      if(!tour){
        return  res.status(404).json({
          status: 'Fail',
          message: "There is no Tour with that name"
        })    
      }

      res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
        });
      } catch(e){
        res.json({
          status: 'Fail'
        })    
      }
  }

  exports.getLoginForm = async (req, res)=> {
    try{
      res.status(200).render('login', {
        title: 'Login into your account'
      })
      } catch(e){
        res.json({
          status: 'Fail',
          message: e.message
        })    
      }
  }

  exports.getAccount=async (req,res)=> {
    try{
      res.status(200).render('account', {
        title: 'Your account'
      })
      } catch(e){
        res.json({
          status: 'Fail',
          message: e.message
        })    
      }
  }


  exports.updateUserData =async (req, res)=> {
    try{
      const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
      },
      {
        new: true,
        runValidators:  true
      });

      res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
      })

    } catch(e){ 
       res.json({
      status: 'Fail',
      message: e.message
    })    

    }
  }
