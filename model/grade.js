//------------------------------------
// grade.js
//------------------------------------

//------------------------------------
// imports
//------------------------------------
const database = require('../database/database');

//------------------------------------
// functions/exports
//------------------------------------
module.exports = {

    // Endpoint 1 (This insert marks for article)
    insertMarks: function (userid, articleid, grade, callback) {
        async function addMarksToGrade(userid, articleid, grade, datetime, dbClient) {
            let result;
            try {
                result = await dbClient.query(`INSERT INTO grade (fk_userid, fk_articleid, grade, marked_at) VALUES ($1, $2, $3, $4)`,
                    [userid, articleid, grade, datetime]);
            } catch (error) {
                throw { code: "database_error: " + error };
            }

            if (result.rowCount == 0) {
                throw { code: "noUpdate" };
            }
        }

        async function editMarksToHistory(marks, userid, dbClient) {
            let result;
            try {
                result = await dbClient.query(`UPDATE history SET marks = $1 WHERE fk_userid = $2 AND tournament_type = 'qualifying_round'`,
                    [marks, userid]);
            } catch (error) {
                throw { code: "database_error: " + error };
            }

            if (result.rowCount == 0) {
                throw { code: "noUpdate" };
            }
            return result;
        }

        database.transaction(async (dbClient) => {
            var currentdate = new Date();
            var datetime = ("0" + currentdate.getDate()).slice(-2) + "-"
                + ("0" + (currentdate.getMonth() + 1)).slice(-2) + "-"
                + currentdate.getFullYear() + " "
                + ("0" + currentdate.getHours()).slice(-2) + ":"
                + ("0" + currentdate.getMinutes()).slice(-2) + ":"
                + ("0" + currentdate.getSeconds()).slice(-2);
            await addMarksToGrade(userid, articleid, grade, datetime, dbClient);
            let result = await editMarksToHistory(grade, userid, dbClient);
            return result;
        })
            .then(function (result) {
                return callback(null, result);
            })
            .catch(function (err) {
                return callback({ code: err.code }, null);
            })
    },

    // Endpoint 2 (This update the marks for article)
    updateMarks: function (grade, articleid, callback) {

        async function editMarksToGrade(grade, datetime, articleid, dbClient) {
            let result;
            try {
                result = await dbClient.query(`UPDATE grade SET grade = $1, marked_at = $2 where fk_articleid = $3`,
                    [grade, datetime, articleid]);
            } catch (error) {
                throw { code: "database_error: " + error };
            }

            if (result.rowCount == 0) {
                throw { code: "noUpdate" };
            }
        }

        async function editMarksToHistory(marks, userid, dbClient) {
            let result;
            try {
                result = await dbClient.query(`UPDATE history SET marks = $1 WHERE fk_userid = $2 AND tournament_type = 'qualifying_round'`,
                    [marks, userid]);
            } catch (error) {
                throw { code: "database_error: " + error };
            }

            if (result.rowCount == 0) {
                throw { code: "noUpdate" };
            }
            return result;
        }

        database.transaction(async (dbClient) => {
            var currentdate = new Date();
            var datetime = ("0" + currentdate.getDate()).slice(-2) + "-"
                + ("0" + (currentdate.getMonth() + 1)).slice(-2) + "-"
                + currentdate.getFullYear() + " "
                + ("0" + currentdate.getHours()).slice(-2) + ":"
                + ("0" + currentdate.getMinutes()).slice(-2) + ":"
                + ("0" + currentdate.getSeconds()).slice(-2);
            await editMarksToGrade(grade, datetime, articleid, dbClient);
            let result = await editMarksToHistory(grade, userid, dbClient);
            return result;
        })
            .then(function (result) {
                return callback(null, result);
            })
            .catch(function (err) {
                return callback({ code: err.code }, null);
            })
    },

}