let $section_login = document.getElementById("section_login");
let $section_profile = document.getElementById("section_profile");
let $btn_login = document.getElementById("btn_login")
let $btn_logout = document.getElementById("btn_logout")
let $btn_sign_up = document.getElementById("btn_sign_up")

let $profile_nick = document.getElementById("profile_nick");
let $profile_desc = document.getElementById("profile_desc");
let $profile_point = document.getElementById("profile_point");
let $profile_memo = document.getElementById("profile_memo");
let $profile_scrap = document.getElementById("profile_scrap");
let $img_profile = document.getElementById("img_profile");


function movePolicyPage() {
    location.href = "member/policy.html";
}

// 회원 로그인
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

// 회원 로그아웃
function memberLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiredTime');
    $section_login.style.display = "block";
    $section_profile.style.display = "none";
}

// 로그인 체크
function checkLogin() {
    let accessToken = localStorage.getItem('accessToken');
    if (accessToken != null) {
        getProfile();
    } else {
        memberLogout();
    }
}

// 회원 프로필 조회
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
        memberLogout();
        console.error(error);
    });
}

// 회원가입 약관 조회
function getPolicy() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(api_url + "/member/policy", requestOptions)
    .then((response) => response.text())
    .then((result) => {
        result = JSON.parse(result);
        if (result.stipulation != undefined && result.privacy != undefined) {
            console.log(result);
            document.getElementById("policy_content").innerText = result.stipulation;
        } else {
            alert(result.detail);
        }
    })
    .catch((error) => {
        alert("이용약관 조회 실패");
        console.error(error);
    });
}

// 회원가입 설정 조회
function getSignUpConfig() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(api_url + "/member/config", requestOptions)
    .then((response) => response.text())
    .then((result) => {
        result = JSON.parse(result);
        if (result != undefined) {
            console.log(result);
        } else {
            alert(result.detail);
        }
    })
    .catch((error) => {
        alert("회원가입 설정 조회 실패");
        console.error(error);
    });
}

// 회원가입
function memberSignUp() {
    let username = document.getElementById("mb_id").value;
    let password = document.getElementById("mb_password").value;
    let password_confirm = document.getElementById("mb_password_confirm").value;

    let name = document.getElementById("mb_name").value;
    let nick = document.getElementById("mb_nick").value;
    let email = document.getElementById("mb_email").value;

    if (username == "" || password == "" || password_confirm == "") {
        alert("아이디 또는 비밀번호를 입력하세요.");
        return false;
    }

    if (password != password_confirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return false;
    }

    const formdata = JSON.stringify({
        "mb_id": username,
        "mb_password": password,
        "mb_password_re": password_confirm,
        "mb_name": name,
        "mb_nick": nick,
        "mb_email": email
    });

    const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
        headers: {
            "Content-Type": "application/json",
        },
    };

    fetch(api_url + "/member", requestOptions)
    .then((response) => response.text())
    .then((result) => {
        console.log(result);
        result = JSON.parse(result);
        if (result.mb_id != undefined) {
            location.href = "sign_up_complete.html?mb_nick=" + nick;
        } else {
            error = result.detail[0]
            loc = JSON.stringify(error.loc)
            alert("[" + error.type + "] " + error.msg + " (" + loc + ")");
        }
    })
    .catch((error) => {
        alert("회원가입 실패");
        console.error(error);
    });
}

function memberImageUpload() {
    let accessToken = localStorage.getItem('accessToken');
    if (accessToken == null) {
        alert("로그인이 필요합니다.");
        return;
    }

    let file = document.getElementById("mb_image").files[0];
    if (file == undefined) {
        alert("이미지를 선택하세요.");
        return;
    }

    const formdata = new FormData();
    formdata.append("mb_image", file);

    const requestOptions = {
        method: "POST",
        body: formdata,
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        redirect: "follow"
    };

    fetch(api_url + "/member/image", requestOptions)
    .then((response) => response.text())
    .then((result) => {
        result = JSON.parse(result);
        if (result.mb_image_path != undefined) {
            console.log(result);
            $img_profile.src = result.mb_image_path;
        } else {
            alert(result.detail);
        }
    })
    .catch((error) => {
        alert("이미지 업로드 실패");
        console.error(error);
    });
}