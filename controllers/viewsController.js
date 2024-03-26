const Tour=require('../models/tourModel');
const User=require('../models/userModel');
const Booking= require('../models/bookingModel')
const Review = require('../models/reviewModel')


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

  exports.getSignupForm = async (req, res)=> {
    try{
      res.status(200).render('signup', {
        title: 'Sign up your account'
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

  exports.getMyTours = async (req, res, next)=>{

    try{
    const bookings = await Booking.find({user: req.user.id})

    const toursIds=bookings.map(el =>el.tour);

    const tours = await Tour.find({_id: {$in: toursIds}})

    res.status(200).render('overview', {
      title: 'My Tours',
      tours
      
    })
    }
    catch(err){
      res.status(400).json({
        status: 'fail',
        message: err.message
      })
    }

  }

  exports.getMyReviews = async (req, res, next)=>{

    try{
    const reviews = await Review.find({user: req.user.id})

    const toursIds=reviews.map(el =>el.tour);

    const tours = await Tour.find({_id: {$in: toursIds}})

    res.status(200).render('overview', {
      title: 'My Reviewed Tours',
      tours
      
    })
    }
    catch(err){
      res.status(400).json({
        status: 'fail',
        message: err.message
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


  exports.getForgotPasswordForm=async(req, res)=> {
    try{
      res.status(200).render('forgotPassword', {
        title: 'Forgot Password'
      })
      } catch(e){
        res.json({
          status: 'Fail',
          message: e.message
        })    
      }
  }


  exports.getResetPasswordForm= async(req, res)=>{
    try{
      res.status(200).render('resetPassword', {
        title: "Reset Password",
        token:req.params.token
      })
    } catch(e){
      res.json({
        status: 'Fail',
        message: e.message
      })  
    }
  }
