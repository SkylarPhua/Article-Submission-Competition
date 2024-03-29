const getdata = document.getElementById("getData");

// This is to display students in group one
const groupOne = document.getElementById("groupOne");
const gOneHeader = document.getElementById("groupOneHeader");

// This is to display students in group two
const groupTwo = document.getElementById("groupTwo");
const gTwoHeader = document.getElementById("groupTwoHeader");

// This is to display students in group three
const groupThree = document.getElementById("groupThree");
const gThreeHeader = document.getElementById("groupThreeHeader");


// This is to display students in group four
const groupFour = document.getElementById("groupFour");
const gFourHeader = document.getElementById("groupFourHeader");

// This is to display students in semi one
const semiOne = document.getElementById("semiOne");
const sOneHeader = document.getElementById("semiOneHeader");

// This is to display students in semi two
const semiTwo = document.getElementById("semiTwo");
const sTwoHeader = document.getElementById("semiTwoHeader");

// This is to display students in finals
const finals = document.getElementById("final");
const fHeader = document.getElementById("finalHeader");

//-----------------------------------------------------------
let token = localStorage.getItem('token');
let role = localStorage.getItem('role_name');
let userid = localStorage.getItem('user_id');
const baseUrl = 'http://localhost:8000';
const axios = window.axios;

window.addEventListener('DOMContentLoaded', function () {
    const overlayLoading = document.getElementById('loading');

    if (role != "admin") {
        new Noty({
            type: 'error',
            text: 'Unauthorised User, You are not an Admin',
            timeout: '6000',
        }).on('onClose', () => {
            window.location = "login.html"
        })
            .show();
    }

    // Cheng Ding your filter feature should go here
    getAllUserByStage(gOneHeader, groupOne, "group_one");
    getAllUserByStage(gTwoHeader, groupTwo, "group_two");
    getAllUserByStage(gThreeHeader, groupThree, "group_three");
    getAllUserByStage(gFourHeader, groupFour, "group_four");
    getAllUserByStage(sOneHeader, semiOne, "semi_final_one");
    getAllUserByStage(sTwoHeader, semiTwo, "semi_final_two");
    getAllUserByStage(fHeader, finals, "final");
    getAllTournamentArticles();

    function getAllUserByStage(header, type, tournamentType) {
        overlayLoading.style.display = "";
        axios({
            headers: {
                'user': userid,
                'authorization': 'Bearer ' + token
            },
            method: 'GET',
            url: '/competition/tournamentByType/' + tournamentType,
            dataType: "json",
        })
            .then(function (response) {
                const groups = response.data;
                type.innerHTML = '';
                header.innerHTML = '';
                const numberOfStudents = response.data.length
                header.innerHTML += `
                <h2><b>${response.data[0].group_type_display}</b></h2>
                <h2>Number of Students: ${numberOfStudents}/2</h2>
                `
                if (groups !== null) {
                    groups.forEach((group) => {
                        var groupHtml = `
                    <tr>
                        <td>${group.username}</td>
                        <td>${group.email}</td>
                        <td>${group.edu_lvl}</td>
                        <td>${group.marks}</td>
                        <td><a onclick="delTournamentEntry('${group.userid}', '${group.username}', '${group.tournamentid}', '${group.group_type_display}')" class = "btn btn-danger">Delete</a></td>
                        <td><a onclick="addToStage('${group.userid}', '${group.group_type}', '${group.email}')" class="btn btn-success">Advance</a></td>
                    </tr>
                    `;
                        type.innerHTML += groupHtml;
                        overlayLoading.style.display = "none"
                    })
                } else {
                    new Noty({
                        type: 'error',
                        text: 'Issues while retrieving.. Please try again later',
                        timeout: '6000',
                        killer: true
                    }).show();
                }
            })
            .catch(function (error) {
                console.log("This is the error" + error);
                if (error.response.status == 403) {
                    new Noty({
                        type: 'error',
                        text: JSON.stringify(error.response.data),
                        timeout: '6000',
                    }).on('onClose', () => {
                        window.location = "login.html"
                    }).show();

                } else if (error.response.status == 404) {
                    new Noty({
                        type: 'error',
                        text: JSON.stringify(error.response.data),
                        timeout: '6000',
                        killer: true
                    }).show();

                } else {
                    new Noty({
                        type: 'error',
                        text: JSON.stringify(error.response.data) + 'Please try again later',
                        timeout: '6000',
                        killer: true
                    }).show();
                }
                n.close();
            })
    }

    function getAllTournamentArticles() {
        axios({
            headers: {
                'user': userid,
                'authorization': 'Bearer ' + token
            },
            method: 'GET',
            url: '/competition/tournamentArticles/',
            dataType: "json",
        })
            .then(function (response) {
                const articles = response.data;
                if (articles != null) {
                    getdata.innerHTML = '';
                    articles.forEach((article) => {
                        var postHtml = `
                <tr>
                    <td>${article.username}</td>
                    <td>${article.email}</td>
                    <td>${article.edu_lvl}</td>
                    <td>${article.group_type_display}</td>
                    <td>${article.title}</td>
                    <td>${article.catname}</td>
                    <td>${article.submitted_at}</td>
                    <td>${article.marks}</td>
                    <td>${article.graded_at}</td>
                    <td><a onclick="articleSelect('${article.userid}', '${article.tournamentid}')" class = "btn btn-info">View</a></td>
                    <td><a onclick="studentDelete('${article.userid}')" class = "btn btn-danger" id="dis">Disqualify</a></td>
                </tr>
              `;
                        getdata.innerHTML += postHtml;
                    })
                } else {
                    new Noty({
                        type: 'error',
                        text: 'Issues while retrieving.. Please try again later',
                        timeout: '6000',
                        killer: true
                    }).show();
                }
            })
            .catch(function (error) {
                console.log("This is the error" + error);
                if (error.response.status == 403) {
                    new Noty({
                        type: 'error',
                        text: JSON.stringify(error.response.data),
                        timeout: '6000',
                    }).on('onClose', () => {
                        window.location = "login.html"
                    }).show();

                } else if (error.response.status == 404) {
                    new Noty({
                        type: 'error',
                        text: JSON.stringify(error.response.data),
                        timeout: '6000',
                        killer: true
                    }).show();

                } else {
                    new Noty({
                        type: 'error',
                        text: JSON.stringify(error.response.data) + 'Please try again later',
                        timeout: '6000',
                        killer: true
                    }).show();
                }
                n.close();
            })
    }
})

function addToStage(studentid, currentGroupType, userEmail) {
    if (currentGroupType === "final") {
        var n = new Noty({
            type: 'error',
            text: 'Student is already in the final',
            timeout: '6000',
            killer: true
        })
        n.show();
    } else if (currentGroupType === "semi_final_one" || currentGroupType === "semi_final_two") {
        const finals = "Finals";
        var n = new Noty({
            text: 'Advance Student to Final?',
            buttons: [
                Noty.button('Yes', 'btn btn-success', function () {
                    sendingDetailsToAddStudent(studentid, 7, finals, userEmail);
                }),
                Noty.button('No', 'btn btn-danger', function () {
                    n.close();
                })
            ],
            killer: true
        })
        n.show();
    } else {
        const SFGroup1 = "Semi-finals Group 1";
        const SFGroup2 = "Semi-finals Group 2"
        var n = new Noty({
            text: "Which Semi-final Group?",
            buttons: [
                Noty.button('SF Group 1', 'btn btn-success', function () {
                    sendingDetailsToAddStudent(studentid, 5, SFGroup1, userEmail);
                }),
                Noty.button('SF Group 2', 'btn btn-success', function () {
                    sendingDetailsToAddStudent(studentid, 6, SFGroup2, userEmail);
                }),
                Noty.button('Cancel', 'btn btn-error', function () {
                    n.close();
                })
            ],
            killer: true
        })
        n.show();
    }
}

function sendingDetailsToAddStudent(studentid, newGroupType, stage, userEmail) {
    const requestBody = {
        userid: studentid,
        tournamentType: newGroupType
    }
    axios({
        headers: {
            'user': userid,
            'authorization': 'Bearer ' + token
        },
        method: 'POST',
        url: '/competition/tournament/',
        data: requestBody,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    })
        .then(function (response) {
            sendMail(stage, userEmail);
            location.reload();
        })
        .catch(function (error) {
            if (error.response.status == 403) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data),
                    timeout: '6000',
                }).on('onClose', () => {
                    window.location = "login.html"
                }).show();

            } else if (error.response.status == 404) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data),
                    timeout: '6000',
                    killer: true
                }).show();

            } else {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data) + 'Please try again later',
                    timeout: '6000',
                    killer: true
                }).show();
            }
            n.close();
        })
}

function sendMail(stage, userEmail) {
    const subject = "You have advanced higher into the tournament!"
    const text = "Your article was so exceptional, that we have advanced you into " + stage + " \nAll the best!!!"
    const requestBody = {
        email: userEmail,
        subject: subject,
        text: text
    };
    axios({
        headers: {
            'user': userid,
            'authorization': 'Bearer ' + token
        },
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

function delTournamentEntry(studentid, studentName, tournamentid, stage) {
    var n = new Noty({
        text: "Are you sure you want to delete " + studentName + " from " + stage,
        buttons: [
            Noty.button('Yes', 'btn btn-danger', function () {
                const requestBody = {
                    userid: studentid,
                    tournamentid: tournamentid
                }
                axios({
                    headers: {
                        'user': userid,
                        'authorization': 'Bearer ' + token
                    },
                    method: 'DELETE',
                    url: '/competition/tournament/',
                    data: requestBody,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                })
                    .then(function (response) {
                        new Noty({
                            type: 'success',
                            text: "You have deleted Student: " + studentName + " From " + stage,
                            timeout: '6000',
                        })
                            .show();
                        n.close();
                        location.reload();
                    })
                    .catch(function (error) {
                        if (error.status == 403) {
                            new Noty({
                                type: 'error',
                                text: error.response.data,
                                timeout: '6000',

                            }).on('onClose', () => {
                                window.location = "login.html"
                            })
                                .show();
                        } else {
                            new Noty({
                                type: 'error',
                                text: "Error, Unable to Delete Student : " + studentName + " " + error,
                                timeout: '6000',
                            })
                                .show();
                            console.log("This is the error" + error);
                            n.close();
                        }
                    })
            }, { id: 'button1', 'data-status': 'ok' }),
            Noty.button('NO', 'btn', function () {
                console.log('button 2 clicked');
                n.close();
            })
        ],
        killer: true,
    });
    n.show();
}

function articleSelect(userid, tournamentid) {
    localStorage.setItem("studentid", userid);
    localStorage.setItem("tournamentid", tournamentid);
    window.location = "A_tournamentView.html";
}

function studentDelete(userid) {
    var n = new Noty({
        text: "Do you want to disqualify Student ID: " + userid,
        buttons: [
            Noty.button('YES', 'btn btn-success', function () {
                axios({
                    headers: {
                        'user': userid,
                        'authorization': 'Bearer ' + token
                    },
                    method: 'DELETE',
                    url: '/competition/students/' + userid + "/",
                    dataType: "json",
                })
                    .then(function (response) {
                        new Noty({
                            type: 'success',
                            text: "You Have Disqualified Student : " + id,
                            timeout: '6000',
                        })
                            .show();
                        n.close();

                        getAllUserByStage(gOneHeader, groupOne, "group_one");
                        getAllUserByStage(gTwoHeader, groupTwo, "group_two");
                        getAllUserByStage(gThreeHeader, groupThree, "group_three");
                        getAllUserByStage(gFourHeader, groupFour, "group_four");
                        getAllUserByStage(sOneHeader, semiOne, "semi_final_one");
                        getAllUserByStage(sTwoHeader, semiTwo, "semi_final_two");
                        getAllUserByStage(fHeader, finals, "final");
                        getAllTournamentArticles()
                    })
                    .catch(function (error) {
                        if (error.status == 403) {
                            new Noty({
                                type: 'error',
                                text: error,
                                timeout: '6000',
                            })
                                .show();
                        } else {
                            console.log("This is the error" + error);
                            new Noty({
                                type: 'error',
                                text: "Error, Unable to Delete Student : " + id + " " + error,
                                timeout: '6000',
                            })
                                .show();
                        }
                    })
            }, { id: 'button1', 'data-status': 'ok' }),
            Noty.button('NO', 'btn btn-error', function () {
                console.log('button 2 clicked');
                n.close();
            })
        ],
        killer: true,
    });
    n.show();
}

