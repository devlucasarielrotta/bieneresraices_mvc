import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const {email,nombre,token} = datos;

    await transport.sendMail({
        from: 'BienesRaices.com',
        to:   email,
        subject: 'Confirma tu Cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en bienesRaices.com</p>

            <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/api/v1/auth/confirmar/${token}">Confirmar Cuenta</a></p>

            <p>Si tu no creaste esta cuenta, por favor ignora este email</p>
        `
    })
}

const emailOlvidePassword = async (datos) => {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const {email,nombre,token} = datos;

    await transport.sendMail({
        from: 'BienesRaices.com',
        to:   email,
        subject: 'Reestablece tu password en BienesRaices.com',
        text: 'Reestablece tu password en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, has solicitado reestablecer tu password en bienesRaices.com</p>

            <p>Sigue el siguiente enlace para generar un password nuevo:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/api/v1/auth/olvide-password/${token}">Reestablecer Password</a></p>

            <p>Si tu no solicitaste el cambio de password, por favor ignora este email</p>
        `
    })
}

export { emailRegistro, emailOlvidePassword }