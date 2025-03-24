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
    const { email, code } = req.query;
    const query = "SELECT * FROM otp_storage WHERE email = ? AND otp = ?;";
    let params = [email, code];
    console.log("hola");
    console.log(email);
    console.log(code);
    const response = await executeQuery(query, params);
    if (response.length < 1) {
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
      html: `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">MIA - Verificación de Acceso</h1>
    </div>
    
    <div style="background: #f8fafc; padding: 40px 30px; border-radius: 0 0 10px 10px;">
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
            ¡Hola! Estamos procesando tu solicitud de acceso. Por favor utiliza el siguiente código de verificación:
        </p>
        
        <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 2px dashed #e2e8f0; text-align: center; margin: 0 auto 30px auto; display: inline-block;">
            <div style="font-size: 28px; font-weight: 700; color: #6366f1; letter-spacing: 3px;">
                ${otp}
            </div>
        </div>
        
        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 25px 0;">
            Este código es válido por 10 minutos. Por motivos de seguridad, no compartas este código con nadie.
        </p>
        
        <div style="border-top: 2px solid #e2e8f0; padding-top: 25px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 0;">
                Si no solicitaste este código, puedes ignorar este mensaje.<br>
                Equipo de Soporte MIA · 
                <a href="#" style="color: #6366f1; text-decoration: none;">ayuda@mia.com</a>
            </p>
        </div>
    </div>
</div>
`, // Versión en HTML
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