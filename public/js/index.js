import '@babel/polyfill';
import {login } from './login';
import { displayMap } from './mapbox';
import {updateData} from './updateSettings';
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');



if(userDataForm){
    userDataForm.addEventListener('submit', e=>{
        e.preventDefault();
        const name=document.getElementById('name').value
        const email=document.getElementById('email').value
        updateData({name,email}, 'data')

    })
}


if(userPasswordForm){
    userPasswordForm.addEventListener('submit', async e=>{
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent= 'Updating...';
        const passwordCurrent=document.getElementById('password-current').value
        const password=document.getElementById('password').value
        const passwordConfirm=document.getElementById('password-confirm').value

        await updateData({passwordCurrent, password, passwordConfirm}, 'password')

        document.querySelector('.btn--save-password').textContent= 'Save password';

        document.getElementById('password-current').value= '';
        document.getElementById('password').value= '';
        document.getElementById('password-confirm').value= '';

    })
}






// const mapBox = document.getElementById('map');



// if(mapBox){
//     const locations= JSON.parse(mapBox.dataset.locations);
//     displayMap(locations);
// }




// document.querySelector('.form').addEventListener('submit',e => {
//     console.log("Login")
//     e.preventDefault();
//     const email=document.getElementById('email').value;
//     const password=document.getElementById('password').value;
//     login({email,password});
// })
