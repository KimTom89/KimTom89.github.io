let $section_login = document.getElementById("section_login");
let $section_profile = document.getElementById("section_profile");
let $btn_login = document.getElementById("btn_login")
let $btn_logout = document.getElementById("btn_logout")

let $profile_nick = document.getElementById("profile_nick");
let $profile_desc = document.getElementById("profile_desc");
let $profile_point = document.getElementById("profile_point");
let $profile_memo = document.getElementById("profile_memo");
let $profile_scrap = document.getElementById("profile_scrap");
let $img_profile = document.getElementById("img_profile");


// ajax로 회원 로그인처리
function memberLogin() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username == "" || password == "") {
        alert("아이디 또는 비밀번호를 입력하세요.");
        return;
    }

    const formdata = new FormData();
    formdata.append("grant_type", "password");
    formdata.append("username", username);
    formdata.append("password", password);

    const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
    };

    fetch(api_url + "/token", requestOptions)
    .then((response) => response.text())
    .then((result) => {
        result = JSON.parse(result);
        if (result.access_token != undefined) {
            console.log(result);

            localStorage.setItem('accessToken', result.access_token)
            localStorage.setItem('refreshToken', result.refresh_token)
            localStorage.setItem('expiredTime', result.access_token_expire_at)

            checkLogin();
            
        } else {
            alert(result.detail);
        }
    })
    .catch((error) => {
        alert("로그인 실패");
        console.error(error);
    });
}

function memberLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiredTime');
    $section_login.style.display = "block";
    $section_profile.style.display = "none";
}

function checkLogin() {
    let accessToken = localStorage.getItem('accessToken');
    if (accessToken != null) {
        getProfile();
    } else {
        memberLogout();
    }
}

function getProfile() {
    let accessToken = localStorage.getItem('accessToken');
    if (accessToken == null) {
        alert("로그인이 필요합니다.");
        return;
    }

    const requestOptions = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        redirect: "follow"
    };

    fetch(api_url + "/member", requestOptions)
    .then((response) => response.text())
    .then((result) => {
        result = JSON.parse(result);
        if (result.mb_id != undefined) {
            console.log(result);
            $profile_nick.innerText = result.mb_nick;
            $profile_desc.innerText = result.mb_profile;
            $profile_point.innerText = result.mb_point.toLocaleString();
            $profile_memo.innerText = result.mb_memo_cnt;
            $profile_scrap.innerText = result.mb_scrap_cnt;
            $img_profile.src = result.mb_image_path;
            
            $section_login.style.display = "none";
            $section_profile.style.display = "block";
        } else {
            alert(result.detail);
        }
    })
    .catch((error) => {
        alert("프로필 조회 실패");
        checkLogin();
        console.error(error);
    });
}
