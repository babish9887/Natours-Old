import axios from 'axios';
//  import Stripe from 'stripe'
const stripe = Stripe('pk_test_51OuCwTSHzwqQQleJJp0rdqsZzcZ0OchODSLtJbUORskFsMhISJYugMwZG977FNMqDrN0PeIlVS3UbGa8luXzJ5aB00AjQhoWMq')


export const bookTour = async tourId =>{
    try{
    const session = await axios(
        `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`);


    await stripe.redirectToCheckout({
        sessionId: session.data.session.id
    })
    } catch(err){
        console.log(err.message);
    }
    
}



// export const bookTour = async tourId =>{
//     try{
//         console.log('inside bookTour')
//         const session = await axios(
//             `http://localhost:3000/api/v1/bookings/checkout-session-test/${tourId}`
//         );
//         res.json({
//             session
//         })

        
//     } catch(err){
//         console.log(err.message)
//     }
// }