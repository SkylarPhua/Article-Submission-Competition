const getdata = document.getElementById("getArticleData");
const getCat = document.getElementById("category");
let userid = localStorage.getItem('user_id');
let token = localStorage.getItem('token');
let role = localStorage.getItem('role_name');
let groupType = localStorage.getItem('group_type');
const axios = window.axios;

const baseUrl = 'http://localhost:8000';

window.onload = () => {
    if (role != "student") {
        new Noty({
            type: 'error',
            text: "Unauthorised, You are not a Student",
            timeout: '6000',
        }).on('onClose', () => {
            window.location = "login.html"
        }).show();
    }
    console.log("This is the group type: " + groupType);

    getCategory();

    event.preventDefault();
    if (groupType === "final") {
        console.log("Im in FINAL");
        getTheTournamentDue(groupType)
        showCountDown(groupType);
    } else if (groupType === "semi_final_one" || groupType === "semi_final_two") {
        console.log("Im in SEMI FINAL");
        getTheTournamentDue(groupType)
        showCountDown(groupType);
    } else if (groupType === "group_one" || groupType === "group_two" || groupType === "group_three" || groupType === "group_four") {
        console.log("Im in GROUP");
        getTheTournamentDue(groupType)
        showCountDown(groupType);
    } else {
        console.log("IM in the ELSE");
        showCountDown(groupType);
        getTheDue(groupType)
    }
}

function showTournamentContent() {
    axios({
        headers: {
            'user': userid,
            'authorization': 'Bearer ' + token
        },
        method: 'GET',
        url: '/competition/tournamentArticle/' + userid + '/' + groupType,
        dataType: "json",
    })
        .then(function (response) {
            const articles = response.data;
            if (articles != null) {
                getdata.innerHTML = '';
                articles.forEach((article) => {
                    var postHtml = `
                    <div align="center" class="container pt-7">
                    <div class="card" style="width: 2rems">
                        <div class="class-body" id="getArticleData">
                            <h1 class="card-title"><b>Title:</b> ${article.title}</h1>
                            <hr>
                            <h2 class="card-subtitle"><b>Word Count:</b> ${article.count} word(s)</h3>
                                <br>
                                <h2 class="card-subtitle"><b>Marks:</b> ${article.marks}</h2>
                                <br>
                                <h2 class="card-subtitle"><b>Submission Date:</b> ${article.submitted_at}</h2>
                                <br>
                                <h2 class="card-subtitle"><b>Graded Date:</b> ${article.graded_at}</h2>
                                <hr>
                                <h2 class="card-subtitle"><b>Article:</b></h2>
                                <article class="card-text" style="font-size:25px">${article.articlecontent}</article>
                                <hr>
                                <a onclick="editBtnTournamentEdition('${article.userid}')" class="btn btn-info">Edit</a>
                                <a onclick="articleDeleteTournament('${article.userid}')" class="btn btn-danger" id="dis">Delete</a>
                        </div>
                    </div>
                </div>
        `;
                    localStorage.setItem('tournamentID', article.tournamentid);
                    getdata.innerHTML += postHtml;
                })
            } else {
                console.log("There is an issue");
            }
        })
        .catch(function (error) {
            if (error.response.status == 404) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data),
                    timeout: '6000',
                    killer: true
                }).show();
                printText();
                btn();
            } else if (error.response.status == 500) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data) + ' Please try again later',
                    timeout: '6000',
                    killer: true
                }).show();
            }
        });
}

function getCategory() {
    axios({
        headers: {
            'user': userid,
            'authorization': 'Bearer ' + token
        },
        method: 'GET',
        url: '/competition/tournamentCategory/' + groupType,
        dataType: "json"
    })
        .then(function (response) {
            const categorys = response.data;
            if (categorys !== null) {
                categorys.forEach((category) => {
                    var postCatHtml = `
                    <h1><b><u>Category: ${category.name}</u></b></h1>
                    `;
                    getCat.innerHTML += postCatHtml
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
            if (error.response.status == 404) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data),
                    timeout: '6000',
                    killer: ture
                }).show();
                printText();
                btn();
            } else if (error.response.status == 500) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data) + ' Please try again later',
                    timeout: '6000',
                    killer: true
                }).show();
            }
            n.close();
        });
}

function showQualifyingContent() {
    axios({
        headers: {
            'user': userid,
            'authorization': 'Bearer ' + token
        },
        method: 'GET',
        url: '/competition/article/' + userid,
        dataType: "json",
    })
        .then(function (response) {
            const articles = response.data;
            console.log(articles);
            if (articles != null) {
                getdata.innerHTML = '';
                articles.forEach((article) => {
                    console.log("ssssss" + articles[0].title);
                    var postHtml = `
                <div class="container pt-5">
                    <table class="table">
                        <thead class="thead-dark" id="field" hidden
                        </thead>
                        <tbody>
                            <tr>
                                <th style="font-size: 25px;font-weight:bold">Title</th>
                                <th style="font-size: 25px;font-weight:bold">Article</th>
                                <th style="font-size: 25px;font-weight:bold">Submission Date</th>
                                <th style="font-size: 25px;font-weight:bold">Grade</th>
                                <th style="font-size: 25px;font-weight:bold">Edit</th>
                                <th style="font-size: 25px;font-weight:bold">Delete</th>
                            </tr>
                            <tr>
                                <td style="font-size: 25px;">${article.title}</td>
                                <td style="font-size: 25px;">${article.content}</td>
                                <td style="font-size: 15px;">${article.submitted_at}</td>
                            <td style="font-size: 25px;">${article.grade}</td>
                                <td ><button onclick="editBtn('${article.userid}')" class = "btn btn-info" >Edit</button></td>
                                <td><button onclick="articleDel('${article.userid}')" class = "btn btn-danger" id="dis" >Delete</button></td>
                            </tr>
                        </tbody>

                    </table>
                </div>
          `;
                    getdata.innerHTML += postHtml;
                })
            } else {
                new Noty({
                    type: 'error',
                    text: 'Issues when retrieving.. Please try again later',
                    timeout: '6000',
                    killer: true
                }).show();
            }

        })
        .catch(function (error) {
            if (error.response.status == 404) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data),
                    timeout: '6000',
                    killer: true
                }).show();
                printText();
                btn();
            } else if (error.response.status == 500) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data) + ' Please try again later',
                    timeout: '6000',
                    killer: true
                }).show();
            }
            n.close();
        });

}

function btn() {
    event.preventDefault();
    getdata.innerHTML = '';
    var postHtml;
    if (groupType === "qualifying_round") {
        console.log("Hello Im 1");
        postHtml = `
        <div align="center">
            <a onclick= 'href="postArticle.html"' class = "btn btn-danger">Submit Your Article</a>
        </div>   
        `;
    } else {
        console.log("Hello Im 2");
        postHtml = `
        <div align="center">
        <a onclick= 'href="postArticleTournament.html"' class = "btn btn-danger">Submit Your Article</a>
        </div>   
        `;
    }
    getdata.innerHTML += postHtml;
}

function showCountDown(dueDateType) {
    axios({
        method: 'GET',
        url: '/competition/dueDate/' + dueDateType,
        dataType: "json",
    })
        .then(function (response) {
            const dateResult = response.data;
            console.log(dateResult);
            var dueDate = dateResult[0].duedate
            console.log(dueDate);
            countDown(dueDate)
        })
        .catch(function (error) {
            if (error.response.status == 404) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data),
                    timeout: '6000',
                    killer: true
                }).show();
            } else if (error.response.status == 500) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data) + ' Please try again later',
                    timeout: '6000',
                    killer: true
                }).show();
            }
            n.close();
        });
}

function getTheDue(dueDateType) {
    axios({
        method: 'GET',
        url: '/competition/dueDate/' + dueDateType,
        dataType: "json",
    })
        .then(function (response) {
            const dateResult = response.data;
            console.log(dateResult);
            var dueDate = dateResult[0].duedate
            console.log(dueDate);
            var dueDate = new Date(dueDate)
            var today = new Date()

            if (dueDate < today) {
                showQualifyingContent2()
            } else if (today < dueDate) {
                showQualifyingContent()
            } else {
                alert("bug found")
            }
        })
        .catch(function (error) {
            if (error.response.status == 404) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data),
                    timeout: '6000',
                    killer: true
                }).show();
            } else if (error.response.status == 500) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data) + ' Please try again later',
                    timeout: '6000',
                    killer: true
                }).show();
            }
            n.close();
        });
}

function getTheTournamentDue(dueDateType) {
    axios({
        method: 'GET',
        url: '/competition/dueDate/' + dueDateType,
        dataType: "json",
    })
        .then(function (response) {
            const dateResult = response.data;
            console.log(dateResult);
            var dueDate = dateResult[0].duedate
            console.log(dueDate);
            var dueDate = new Date(dueDate)
            var today = new Date()

            if (dueDate < today) {
                showTournamentContent2()
            } else if (today < dueDate) {
                showTournamentContent()
            } else {
                alert("bug found")
            }
        })
        .catch(function (error) {
            if (error.response.status == 404) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data),
                    timeout: '6000',
                    killer: true
                }).show();
            } else if (error.response.status == 500) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data) + ' Please try again later',
                    timeout: '6000',
                    killer: true
                }).show();
            }
            n.close();
        });
}

function showTournamentContent2() {
    axios({
        headers: {
            'user': userid,
            'authorization': 'Bearer ' + token
        },
        method: 'GET',
        url: '/competition/tournamentArticle/' + userid + '/' + groupType,
        dataType: "json",
    })
        .then(function (response) {
            const articles = response.data;
            if (articles != null) {
                getdata.innerHTML = '';
                articles.forEach((article) => {
                    var postHtml = `
                    <div align="center" class="container pt-7">
                    <div class="card" style="width: 2rems">
                        <div class="class-body" id="getArticleData">
                            <h1 class="card-title"><b>Title:</b> ${article.title}</h1>
                            <hr>
                            <h2 class="card-subtitle"><b>Word Count:</b> ${article.count} word(s)</h3>
                                <br>
                                <h2 class="card-subtitle"><b>Marks:</b> ${article.marks}</h2>
                                <br>
                                <h2 class="card-subtitle"><b>Submission Date:</b> ${article.submitted_at}</h2>
                                <br>
                                <h2 class="card-subtitle"><b>Graded Date:</b> ${article.graded_at}</h2>
                                <hr>
                                <h2 class="card-subtitle"><b>Article:</b></h2>
                                <article class="card-text" style="font-size:25px">${article.articlecontent}</article>
                                <hr>
                        </div>
                    </div>
                </div>
        `;
                    localStorage.setItem('tournamentID', article.tournamentid);
                    getdata.innerHTML += postHtml;
                })
            } else {
                new Noty({
                    type: 'error',
                    text: 'There is an issue while retrieving data',
                    timeout: '6000',
                    killer: true
                }).show();
            }
        })
        .catch(function (error) {
            if (error.response.status == 404) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data),
                    timeout: '6000',
                    killer: true
                }).show();
            } else if (error.response.status == 500) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data) + ' Please try again later',
                    timeout: '6000',
                    killer: true
                }).show();
            }
            n.close();
        });
}

function showQualifyingContent2() {
    axios({
        headers: {
            'user': userid,
            'authorization': 'Bearer ' + token
        },
        method: 'GET',
        url: '/competition/article/' + userid,
        dataType: "json",
    })
        .then(function (response) {
            const articles = response.data;
            console.log(articles);
            if (articles != null) {
                getdata.innerHTML = '';
                articles.forEach((article) => {
                    console.log("ssssss" + articles[0].title);
                    var postHtml = `
                <div class="container pt-5">
                    <table class="table">
                        <thead class="thead-dark" id="field" hidden
                        </thead>
                        <tbody>
                            <tr>
                                <th style="font-size: 25px;font-weight:bold">Title</th>
                                <th style="font-size: 25px;font-weight:bold">Article</th>
                                <th style="font-size: 25px;font-weight:bold">Submission Date</th>
                                <th style="font-size: 25px;font-weight:bold">Grade</th>
                            </tr>
                            <tr>
                                <td style="font-size: 25px;">${article.title}</td>
                                <td style="font-size: 25px;">${article.content}</td>
                                <td style="font-size: 15px;">${article.submitted_at}</td>
                            <td style="font-size: 25px;">${article.grade}</td>
                            </tr>
                        </tbody>

                    </table>
                </div>
          `;
                    getdata.innerHTML += postHtml;
                })
            } else {
                new Noty({
                    type: 'error',
                    text: 'Issues while retrieving data... Please try again later',
                    timeout: '6000',
                    killer: true
                }).show();
            }

        })
        .catch(function (error) {
            if (error.response.status == 404) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data),
                    timeout: '6000',
                    killer: true
                }).show();
            } else if (error.response.status == 500) {
                new Noty({
                    type: 'error',
                    text: JSON.stringify(error.response.data) + ' Please try again later',
                    timeout: '6000',
                    killer: true
                }).show();
            }
            n.close();
        });

}



function printText() {
    var txt = `Welcome to our Competition!!! Submit your article and win the Prizes`;
    document.getElementById('printText').innerText = txt;
}

function countDown(dueDate) {
    var countDate = new Date(dueDate).getTime();
    setInterval(function () {
        var now = new Date().getTime();
        var gap = countDate - now;

        if (gap < 0) {
            document.getElementById('day').innerText = "00";
            document.getElementById('hour').innerText = "00";
            document.getElementById('minute').innerText = "00";
            document.getElementById('second').innerText = "00";
            document.getElementById("expired").innerHTML = "Expired";
        } else {
            var d = Math.floor(gap / (1000 * 60 * 60 * 24));
            var h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));;
            var m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
            var s = Math.floor((gap % (1000 * 60)) / 1000);

            document.getElementById('day').innerText = d;
            document.getElementById('hour').innerText = h;
            document.getElementById('minute').innerText = m;
            document.getElementById('second').innerText = s;

        }
    }, 1000)
}

function editBtn() {
    event.preventDefault();
    window.location = "edit.html";
}

function editBtnTournamentEdition() {
    window.location = "postArticleTournament.html";
}

function articleDeleteTournament(id) {
    let tournamentID = localStorage.getItem('tournamentID');
    var n = new Noty({
        text: "Are you sure you want to delete your article?",
        buttons: [
            Noty.button('Yes', 'btn btn-danger', function () {
                const requestBody = {
                    tournamentid: tournamentID
                }
                axios({
                    headers: {
                        'user': userid,
                        'authorization': 'Bearer ' + token
                    },
                    method: 'DELETE',
                    url: '/competition/tournamentArticle/' + userid,
                    data: requestBody,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                })
                    .then(function (response) {
                        new Noty({
                            type: 'success',
                            text: 'You have deleted your article',
                            timeout: '6000',
                        }).on('onClose', () => {
                            location.reload();
                        }).show();
                    })
                    .catch(function (error) {
                        new Noty({
                            type: 'error',
                            text: error,
                            timeout: '6000',
                            killer: true
                        }).show();
                        n.close();
                    })
            }),
            Noty.button('NO', 'btn', function () {
                n.close();
            })
        ],
        killer: true,
    });
    n.show();
}

function articleDel(id) {
    event.preventDefault();
    var txt = confirm("Are you sure want to delete your article?");
    if (txt == true) {
        console.log("im sure want to delete");
        axios({
            headers: {
                'user': userid,
                'authorization': 'Bearer ' + token
            },
            method: 'DELETE',
            url: '/competition/articles/' + userid,
            dataType: "json",
        })
            .then(function (response) {
                new Noty({
                    type: 'success',
                    text: 'You have deleted your article',
                    timeout: '6000',
                }).on('onClose', () => {
                    location.reload();
                }).show();
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
            });
    } else {
        new Noty({
            type: 'error',
            text: 'Canceled',
            timeout: '6000',
        }).on('onClose', () => {
            location.reload();
        }).show();
    }
}

//End of checking for $loginFormContainer jQuery object