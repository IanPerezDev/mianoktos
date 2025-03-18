const { API_SENDGRID } = require("../../../../config/auth");
const { executeTransaction, executeQuery } = require("../../../../config/db");
const otpGenerator = require('otp-generator');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(API_SENDGRID);

const router = require("express").Router()

//se crea el otp, se guarda en la base junto con el correo y se manda al correo
router.post('/send-otp-pass', async (req, res) => {
    try {
        const { email } = req.body;
        // Generar un OTP de 6 dígitos
        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        console.log(otp);
        const query = "INSERT INTO otp_storage (email, otp) VALUES (?,?);";
        let params = [email, otp];
        const { error } = await executeQuery(query, params);
        if (error) {
            throw new Error('Error al almacenar el OTP');
        }

        await sendOTPByEmail(email, otp);

        res.json({ success: true, message: 'OTP generado y enviado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
})

router.get('/verify-otp', async (req, res) => {
    try {
        const {email, code} = req.query;
        const query = "SELECT * FROM otp_storage WHERE email = ? AND otp = ?;";
        let params = [email, code];
        console.log("hola");
        console.log(email);
        console.log(code);
        const response = await executeQuery(query, params);
        if(response.length < 1){
            console.log('Codigo incorrecto');
            throw new Error('Codigo incorrecto');
        }
        res.json({ success: true, message: 'Se verifico correctamente el codigo' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
})

const sendOTPByEmail = async (email, otp) => {
    try {
        const msg = {
            to: email, // Correo electrónico del destinatario
            from: 'juan.calderon@noktos.com', // Correo electrónico del remitente (debe estar verificado en SendGrid)
            subject: 'Tu código de verificación para ingresar a MIA', // Asunto del correo
            text: `Tu código de verificación es: ${otp}`, // Versión en texto plano
            html: `<strong>Tu código de verificación es: ${otp}</strong>`, // Versión en HTML
        };

        // Enviar el correo electrónico
        await sgMail.send(msg);

        console.log('Correo electrónico enviado correctamente');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);

        if (error.response) {
            console.error('Detalles del error:', error.response.body);
        }

        throw new Error('Error al enviar el OTP por correo electrónico');
    }
};

module.exports = router;