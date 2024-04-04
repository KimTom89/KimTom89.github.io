if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('http://127.0.0.1/KimTom89.github.io/service_worker.js').then(() => {
        console.log('ServiceWorker Registered');
    });
}

const url = "http://127.0.0.1:8000";
const api_version = "v1";
const api_url = url + "/api/" + api_version;

window.onload = function () {
    checkLogin();

    $btn_login.addEventListener("click", memberLogin);
    $btn_logout.addEventListener("click", memberLogout);
    $btn_sign_up.addEventListener("click", movePolicyPage);
}