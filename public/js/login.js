import axios from 'axios';
import { showAlert } from './alerts';

const loginForm = document.querySelector('.form--login');
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        console.log("Login")
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login({ email, password });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const logOutBtn = document.getElementById('logoutLink');
    console.log(logOutBtn);
    if (logOutBtn) {
        logOutBtn.addEventListener('click', logout);
    }
});

export const login = async ({ email, password }) => {
    console.log(email, password);
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email: email,
                password: password,
            }
        });
        console.log(res.data.status);
        if (res.data.status === 'Success') {
            showAlert('success', 'Logged in Successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (e) {
        showAlert('error', e.response.data.message);
    }
};

export const logout = async () => {
    try {
        console.log("hello");
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users/logout',
        });
        if (res.data.status === 'Success') {
            location.reload(true);
        }
    } catch (e) {
        showAlert('error', 'Error logging out! Try again!');
    }
};
