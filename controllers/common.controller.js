module.exports.uploadFiles = (req, res) => {
    if (helper.isEmpty(req.files)) {
        return res.status(400).json({ status: false, message: msgHelper.msg("MSG012") });
    }

    const files = req.files.files;

    if (helper.isEmpty(files)) {
        return res.status(400).json({ status: false, message: msgHelper.msg("MSG012") });
    }

    let newFiles = [];
    if (files.length == undefined) {
        newFiles.push(files);
    } else {
        newFiles = files;
    }

    let results = [];

    async.forEachOf(newFiles, function (file, key, callback) {
        helper.uploadSingleFile(file, (err, result) => {
            if (err) {
                callback(err);
            } else {
                results.push(result);
                callback();
            }
        });
    }, function (err) {
        if (err) {
            return res.status(400).json({ status: false, message: msgHelper.msg("MSG012") });
        } else {
            return res.status(200).json({ status: true, message: msgHelper.msg("MSG013"), data: results });
        }
    });


}