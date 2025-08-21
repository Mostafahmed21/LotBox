import { EventEmitter } from 'events';
import { customAlphabet } from 'nanoid';
import { generatHash } from '../security/hash.security.js';
import { userModel } from '../../DB/models/user.model.js';
import { sendEmail } from '../emails/sendEmails.js';
import { verifyAccountTemplate } from '../emails/template/verifyAccount.template.js';
import * as dbService from '../../DB/dbService.js';

export const eventEmitter = new EventEmitter();

export const emailSubject = {
    confirmEmail: 'confirm-email',
    resetPassword: 'Reset-password',
};

export const sendCode = async ({
    data = {},
    subject = emailSubject.confirmEmail,
} = {}) => {
    const { id, email } = data;
    const otp = customAlphabet('0123456789', 5)();
    const hashOtp = generatHash({ plainText: otp });

    let updateData = {};
    switch (subject) {
        case emailSubject.confirmEmail:
            updateData = { confirmEmailOtp: hashOtp };
            break;
        case emailSubject.resetPassword:
            updateData = { resetPasswordOtp: hashOtp };
            break;
        default:
            break;
    }

    await dbService.updateOne({
        model: userModel,
        filter: { _id: id },
        data: updateData,
    });

    const html = verifyAccountTemplate({ code: otp });
    await sendEmail({ to: email, subject, html: html });
};

eventEmitter.on('sendConfirmEmail', async (data) => {
    await sendCode({ data });
});

eventEmitter.on('forgot-password', async (data) => {
    await sendCode({ data, subject: emailSubject.resetPassword });
});
