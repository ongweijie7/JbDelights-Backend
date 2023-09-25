class JsonResponse {
    constructor(statusCode, msg, data) {
        this.statusCode = statusCode;
        this.msg = msg;
        this.data = data;
    }

    static success(statusCode, data) {
        return new JsonResponse(statusCode, 'success', data);
    }

    static fail(statusCode, data) {
        return new JsonResponse(statusCode, 'fail', data);
    }

    send(res) {
        res.status(this.statusCode).json({
            code: this.statusCode,
            msg: this.msg,
            data: this.data,
        });
    }
}

module.exports = JsonResponse;