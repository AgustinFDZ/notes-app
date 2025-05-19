import * as nodemailer from 'nodemailer';
import { envs } from 'src/config/app/envs';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: envs.emailUser,
        pass: envs.emailPass
    }
});