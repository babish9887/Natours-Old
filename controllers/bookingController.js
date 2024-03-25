const stripe = require('stripe')(process.env.SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const CryptoJS = require('crypto-js')

function createSignature(message) {
    const secretKey = '8gBm/:&EnhH.1/q';
    const hash = CryptoJS.HmacSHA256(message, secretKey);
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    return hashInBase64;
}


exports.getCheckoutSession = async (req, res, next) => {
    try {
        const tour = await Tour.findById(req.params.tourId);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
            cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
            customer_email: req.user.email,
            client_reference_id: req.params.tourId,
            mode: 'payment', // Specify mode as 'payment' for one-time payments
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `${tour.name} Tour`,
                            description: tour.summary,
                        },
                        unit_amount: tour.price * 100, // Convert price to cents
                    },
                    quantity: 1
                }
            ],
            billing_address_collection: 'required', // Collect customer address
        });
        res.status(200).json({
            status: 'success',
            session
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getCheckoutSessionTest=async (req, res, next) => {
    try{
        console.log('inside checkout session')
        const tour = await Tour.findById(req.params.tourId);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }
        const total = tour.price *100;
        let paymentData={
            "amount": total,
            "failure_url": `http://localhost:3000/tour/${tour.slug}`,
            "product_delivery_charge": "0",
            "product_service_charge": "0",
            "product_code": "EPAYTEST",
            "signature": "",
            "signed_field_names": "total_amount,transaction_uuid,product_code",
            "success_url":`${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
            "tax_amount": "0",
            "total_amount": total,
            "transaction_uuid": Date.now()
        }
        let message="total_amount="+paymentData.total_amount+",transaction_uuid="+paymentData.transaction_uuid+",product_code="+paymentData.product_code;
        let signature =createSignature(message);
        paymentData.signature=signature;

        let form=document.createElement('form');
        let url="https://rc-epay.esewa.com.np/api/epay/main/v2/form";
        for(var key in paymentData){
            var field=document.createElement('input');
            field.setAttribute('type', 'hidden');
            field.setAttribute('name',key);
            field.setAttribute('value', paymentData[key]);
            form.appendChild(field);
        }
        form.setAttribute('method', 'post');
        form.setAttribute('action', url);
        document.body.appendChild(form);
        form.submit();


    } catch(err){
        res.status(500).json({ error: err.message });
        
    }
}



exports.createBookingCheckout = async (req, res, next) => {
try{
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);


} catch(err){
    res.status(500).json({ error: err.message });

}
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);










