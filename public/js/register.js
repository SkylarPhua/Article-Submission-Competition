let $registerFormContainer = $('#registerFormContainer');

var allowSubmit = false;
document.getElementById("g-recaptcha").addEventListener("mousedown", check_if_capcha_is_filled);

function capcha_filled() {
    allowSubmit = true;
    check_if_capcha_is_filled();
}
function capcha_expired() {
    allowSubmit = false;
}
function check_if_capcha_is_filled() {
    $("#four").hide();

    console.log(allowSubmit);
    if (allowSubmit) return true;
    $("#four").show();

}

if ($registerFormContainer.length != 0) {
    $('#submitButton').on('click', function (event) {
        check_if_capcha_is_filled();
        let name = $('#fullNameInput').val();
        let email = $('#emailInput').val();
        let password = $('#passwordInput').val();

        if (name.trim() == "" || email.trim() == "" || password.trim() == "") {
            validateFE();
        } else if (allowSubmit != true) {
            console.log("ssssssss" + allowSubmit);
            event.preventDefault();
            new Noty({
                timeout: '6000',
                type: 'error',
                layout: 'topCenter',
                theme: 'sunset',
                text: 'captcha not completed',
                killer: true,
            }).show();
        } else {
            console.log("not empty");
            event.preventDefault();
            const baseUrl = 'http://localhost:8000';
            let usertype = $('#userType').val();
            let edu = $('#edulvl').val();
            const requestBody = {
                name: name,
                email: email,
                usertype: usertype,
                password: password,
                edu: edu
            };
            axios({
                method: 'post',
                url: '/competition/student',
                data: requestBody,
                dataType: "json",
            })
                .then(function (response) {
                    //Handle success
                    console.dir(response);
                    new Noty({
                        type: 'success',
                        timeout: '6000',
                        layout: 'topCenter',
                        theme: 'bootstrap-v4',
                        text: 'You have registered. Please <a href="login.html" class=" class="btn btn-default btn-sm" >Login</a>',
                        killer: true
                    }).show();
                    sendMail(email);
                })
                .catch(function (response) {
                    if (error.response.status == 422) {
                        new Noty({
                            type: 'error',
                            text: JSON.stringify(error.response.data + '. Duplicate entry error'),
                            timeout: '6000',
                        }).on('onClose', () => {
                            window.location = "login.html"
                        }).show();

                    } else if (error.response.status == 500) {
                        new Noty({
                            timeout: '6000',
                            type: 'error',
                            layout: 'topCenter',
                            theme: 'sunset',
                            text: JSON.stringify(error.response.data) + ' Unable to register.',
                            killer: true,
                        }).show();
                    }
                    n.close();
                });
        }
    });
}

function sendMail(email) {
    const subject = "You have registered for the [W]riting [C]ompetition"
    const text = "Hello!!!, Welcome to the competition!!! \nYou would have to writing articles for the qualifying round \nThen if you do well then we will advance you higher into the stage!! \nBest of luck!!"
    const requestBody = {
        email: email,
        subject: subject,
        text: text
    };
    axios({
        method: 'POST',
        url: '/competition/tournamentSendMail/',
        data: requestBody,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    })
        .then(function (response) {
            console.log("Everything is fine, it sent");
        })
        .catch(function (error) {
            console.log("The sending of email failed");
        })
};

function validateFE() {
    'use strict'
    var forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        })
}

window.addEventListener('keyup', chkinput)

function chkinput() {
    var email = document.getElementById("emailInput").value.trim();
    var password = document.getElementById("passwordInput").value.trim();
    var name = document.getElementById("fullNameInput").value.trim();

    if (name === "" || email === "" || password === "") {
        $("#one").show();
        $("#two").show();
        $("#three").show();
        document.getElementById('submitButton').disabled = true;
        if (name != "") {
            $("#one").hide();
        } else if (email != "") {
            $("#two").hide();
        } else if (password != "") {
            $("#three").hide();
        }
    } else if (name != "" && email != "" && password != "") {
        $("#one").hide();
        $("#two").hide();
        $("#three").hide();
        document.getElementById('submitButton').disabled = false;
    }
}