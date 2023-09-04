
let Common = {}

Common.getAllRecords = (model, where, columns) => {
    return new Promise((resolve, reject) => {
        db[model].find(where, columns, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}

Common.getRecordById = (model, where, columns) => {
    return new Promise((resolve, reject) => {
        const record = db[model].findOne(where, columns);
        resolve(record);
    })
}

Common.updateRecord = (model, id, data) => {
    return new Promise((resolve, reject) => {

    })
}

Common.getRecord = (model, where) => {
    return new Promise((resolve, reject) => {
        let isRecordExists = db[model].findOne(where);
        resolve(isRecordExists);
    })
}

module.exports = Common;