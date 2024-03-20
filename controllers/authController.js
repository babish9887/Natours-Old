const util = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const secret = 'babishisagoodboy';
const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const mongoSanitize = require('mongo-sanitize');

const signToken = id => {
  return jwt.sign({ id: id }, secret, {
    expiresIn: '3d'
  });
};


const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions= {
    expires: new Date(Date.now()+(90 *24*60*60*1000)),
    // secure: false,
    httpOnly: true,
  };
  if(process.env.NODE_ENV === 'production') cookieOptions.secure =true;
  res.cookie('jwt', token, cookieOptions)
  user.password = undefined
  res.status(statusCode).json({
    status: "Success",
    token,
    data: {
      user: user
    }
  })
}


exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role
    });

      createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email : unsanitized, password } = req.body;
    const email = mongoSanitize(unsanitized);
    if (!email || !password) {
      return res.status(404).json({
        status: 'not Found',
        message: 'Email or password field is empty'
      });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(404).json({ message: 'Incorrect email or password' });
    }
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

const verifyAsync = util.promisify(jwt.verify);
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ message: 'You are not logged in!' });
    }

    //   Verify token
    const decoded = await verifyAsync(token, secret);
    console.log(decoded);

    const freshUser = await User.findById(decoded.id);
    if (!freshUser)
      return res
        .status(401)
        .json({ status: 'Fail', message: 'User not Found' });

    if (freshUser.changedPasswordAfter(decoded.iat))
      return res
        .status(401)
        .json({ status: 'Fail', message: 'User recently changed Password' });

    // res.json({
    //   token,
    //   status: 'nothing'
    // });
    req.user = freshUser;
    next();
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({ status: 'Fail', message: 'You dont have permission' });
    }

    next();
  };
};

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(404).json({
      status: 'Fail',
      message: 'User not found with that email address'
    });

  const resetToken = user.createPasswordResetToken();
  console.log('reset token: ', resetToken);

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot you password? submit a patch requirest with you new password to ${resetURL}.`;

  try {
    console.log('inside sending mail');
    console.log(message);
    await sendEmail({
      email: user.email,
      subject: 'Your password reset Token',
      message
    });
    console.log('after sending mail');

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
      resetToken
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    res.status(400).json({
      status: 'Fail',
      message: err.message
    });
  }
};

exports.resetPassword = (req, res, next) => {
  res.send('nothing');
};

exports.resetPassword = async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gte: Date.now() }
  });

  // if token is not expired, set the new password
  if (!user) {
    res.status(400).json({
      status: 'Fail',
      message: 'User not found or Token is expired'
    });
  }
  try {
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;

    await user.save();

    createSendToken(user, 200, res);
   
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message
    });
  }
  // update changedPassword

  //Log the user in
};

exports.updatePassword = async (req, res) => {
  // Get user from collection
  try{
  const user = await User.findById(req.user.id).select('+password');
  console.log(user);
  console.log(req.body.passwordCurrent, user.password);
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    res.status(400).json({
      status: 'Fail',
      message: 'Your current password in wrong!!'
    });
  } 

  user.password =req.body.password;
  user.passwordConfirm=req.body.passwordConfirm;
  await user.save();
  // check if posted current password is correct
  createSendToken(user, 200, res);

  // If so, update password

  // Log user id, sent JWT
} catch (e){
  res.status(400).json({
    status: 'Fail',
    message: err.message
  });
}
};
