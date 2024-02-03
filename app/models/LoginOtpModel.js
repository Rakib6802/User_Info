const Model = loadCore('model');
module.exports = class LoginOtpModel extends Model {
    constructor() {
        super();
        this.table = 'login_otp';
        this.primaryKey = 'id';
        this.select = ["id", "phone","otp","created_at", 'updated_at'];
    }

    async newOTP(phone) {
		try {
			let Random = require('randomstring');

			let otp = Random.generate({
				length: 6,
				charset: 'numeric'
			});

			// Encrypt OTP
			let encrypt = loadLibrary('encrypt');
			let encrypted_otp = encrypt.encrypt(otp);
			//encrypt.decrypt(encrypted_otp); // for testing

			// Save OTP encrypted
			let res = await this.db(this.table).insert({ phone, otp:encrypted_otp});

			/*let sms = loadLibrary('sms');
			await sms.send(mobile, 'Your OTP is : ' + otp);*/

			return Promise.resolve(otp)
		} catch (err) {
			return Promise.reject(err)
		}
	}

	async getOTP(conditions) {
		try {
			conditions = { ...conditions};
			let exist = await this.db(this.table)
				.whereRaw(`${this.table}.created_at >= (NOW() - INTERVAL 5 MINUTE )`)
				.where(conditions)
				.orderBy('created_at', 'DESC').first();
			return Promise.resolve((exist) ? exist.otp : undefined)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}