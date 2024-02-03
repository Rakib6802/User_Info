const { notEqual } = require('assert');
const Controller = require('./controller');
const { title } = require('process');
module.exports = class user extends Controller {

    constructor() {
        super();
    }

    //-----User Registration--------
    async userRegistration(Req, Res) {

        console.log("User Registration");
        let RequestData = loadValidator(Req, Res);

        if (!RequestData.validate()) return false;

        let receiveData = {
            primary_phone: RequestData.post('primary_phone', true).type('string').val(),
            name: RequestData.post('name', true).type('string').val(),
            area: RequestData.post('area', true).type('string').val(),
            address: RequestData.post('address', true).type('string').val()
        }

        let UserModel = loadModel('UsersModel');

        try {
            let user = await UserModel.save(receiveData);
            console.log("User Registration Sucessfully");
            return ApiResponse(Res, 'SUCCESS')
        }
        catch (error) {
            if (error.code == 'ER_DUP_ENTRY') return ApiErrorResponse(Res, 'DUPLICATE_ENTRY', 'Mobile/Email already registered');
            else {
                console.log("User Registration: " + error);
                ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
            }
        }


    }

    //-----User Login--------
    async userLogin(Req, Res) {

        console.log("User Login");
        let RequestData = loadValidator(Req, Res);

        if (!RequestData.validate()) return false;

        let receiveData = {
            primary_phone: RequestData.post('primary_phone', true).val()
        }

        let LoginOtpModel = loadModel('LoginOtpModel')

        try {
            let UserModel = loadModel('UsersModel');
            let user = await UserModel.find(receiveData);
            if (user) {
                await LoginOtpModel.newOTP(receiveData.primary_phone);

                //1 availabe and isActive True & 2: availabe but customer blocked
                if (user.is_active == 1) ApiResponse(Res, { hasUser: 1, data: user });
                else ApiResponse(Res, { hasUser: 2, message: "Your account has been blocked." })
            }
            else {
                ApiResponse(Res, { hasUser: 0, message: "No User Found" });
            }
        } catch (error) {
            if (error.errorCode) return ApiErrorResponse(Res, error.errorCode, error.message);
            else {
                console.log("userLogin: " + error);
                return ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
            }
        }


    }

    //-----User OTP Verify--------
    async checkOTP(Req, Res) {
        try {
            let RequestData = loadValidator(Req, Res);

            if (!RequestData.validate()) return false;

            let phone = RequestData.post('phone', true).val();
            let otp = RequestData.post('otp', true).val();

            let encrypt = loadLibrary('encrypt');
            let encrypt_otp = encrypt.encrypt(otp);

            let LoginOtp = loadModel('LoginOtpModel');
            let Existing_otp = await LoginOtp.getOTP({ phone, otp: encrypt_otp });
            let is_valid = Existing_otp != undefined;

            return ApiResponse(Res, { is_valid })
        }
        catch (err) {
            console.log(err);
            return ApiErrorResponse(Res, err.error_code || 'SOMETHING_WENT_WRONG');
        }

    }

    //-----User Information Update--------
    async userInformationUpdate(Req, Res) {

        console.log("User Information Update");
        let RequestData = loadValidator(Req, Res);

        if (!RequestData.validate()) return false;

        let primary_phone = RequestData.post('primary_phone', true).type('string').val();
        let receiveData = {
            alternative_phone: RequestData.post('alternative_phone', false).type('string').val(),
            name: RequestData.post('name', false).type('string').val(),
            area: RequestData.post('area', false).type('string').val(),
            address: RequestData.post('address', false).type('string').val()
        }

        let UserModel = loadModel('UsersModel');

        try {

            let bit = await UserModel.db(UserModel.table)
                .where({ primary_phone })
                .select(UserModel.select);

            if (bit[0]) {
                let user = await UserModel.db(UserModel.table)
                    .where({ primary_phone })
                    .update(receiveData)

                console.log("User Information Update Sucessfully");
                return ApiResponse(Res, 'Your information updated sucessfully')
            }
            else return ApiResponse(Res, { message: 'No information found for this number.' });

        }
        catch (error) {
            if (error.code == 'ER_DUP_ENTRY') return ApiErrorResponse(Res, 'DUPLICATE_ENTRY', 'Mobile/Email already registered');
            else {
                console.log("User Registration: " + error);
                ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
            }
        }

    }

    //----Get User Information----
    async getuserInformation(Req, Res) {

        try {
            let { page, user_type, primary_phone } = Req.body;
            let limit = Req.query.limit || 25;
            let page_no = (page) ? parseInt(page) : 1;
            let offset = (page_no - 1) * limit;
            offset = (offset < 0) ? 0 : offset;

            if (!user_type) user_type = null;
            if (!primary_phone) primary_phone = null;

            let UsersModel = loadModel('UsersModel');


            let rows = await UsersModel.db(UsersModel.table)
                .where({ primary_phone })
                .limit(limit)
                .offset(offset)
                .select(UsersModel.select)

            return ApiResponse(Res, { page_no, data: rows })
        } catch (err) {
            console.log(err);
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }

    //----Get All User Information----
    async getAllUserInformation(Req, Res) {

        try {
            let { page, user_type } = Req.body;
            let limit = Req.query.limit || 25;
            let page_no = (page) ? parseInt(page) : 1;
            let offset = (page_no - 1) * limit;
            offset = (offset < 0) ? 0 : offset;

            if (!user_type) user_type = null;

            let UsersModel = loadModel('UsersModel');

            let rows = await UsersModel.db(UsersModel.table)
                .limit(limit)
                .offset(offset)
                .select(UsersModel.select)

            return ApiResponse(Res, { page_no, data: rows })
        } catch (err) {
            console.log(err);
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }
};