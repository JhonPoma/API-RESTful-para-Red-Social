import validator from 'validator'

const validar = (params) => { // params viene de la peticion

    // Estos campos son requeridos en nuestro Modelo
    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 3, max: undefined }) &&
        validator.isAlpha(params.name, "es-ES")

    let nick = !validator.isEmpty(params.nick) &&
        validator.isLength(params.nick, { min: 2, max: undefined })

    let email = !validator.isEmpty(params.email) &&
        validator.isEmail(params.email)

    let password = !validator.isEmpty(params.password)


    // Este campo No es requerido en nuestro Modelo, podemos o no enviarlo
    if (params.surname) {
        let surname = !validator.isEmpty(params.surname) &&
            validator.isLength(params.surname, { min: 3, max: undefined }) &&
            validator.isAlpha(params.surname, "es-ES")

        if (!surname) {
            throw new Error("No se ha superado la validación del surname...");
        } else {
            console.log("Validación superada");
        }
    }
    // Este campo No es requerido en nuestro Modelo, podemos o no enviarlo
    if (params.bio) {
        let bio = !validator.isEmpty(params.bio) &&
            validator.isLength(params.bio, { min: undefined, max: 255 })

        if (!bio) {
            throw new Error("No se ha superado la validación del bio...");
        } else {
            console.log("Validación superada");
        }
    }

    // Validamos estos campos que son requerid
    if (!name|| !nick || !email || !password) {
        throw new Error("No se ha superado la validación del los campos requeridos...");
    } else {
        console.log("Validación superada");
    }

}

export {
    validar
}