document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('togglePassword');
    const password = document.getElementById('password');

    if(toggle && password){
        toggle.addEventListener('click', () => {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            toggle.classList.toggle('fa-eye-slash');
        });
    }
});
