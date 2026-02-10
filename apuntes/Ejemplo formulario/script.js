function validateForm() {
    let esValido = true;

    // Campos
    const nombre = document.getElementById("fullName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const dob = document.getElementById("dob");
    const terms = document.getElementById("terms");

    // Spans de error
    const nombreError = document.getElementById("fullNameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const dobError = document.getElementById("dobError");
    const termsError = document.getElementById("termsError");

    // Ocultar éxito al reintentar
    document.getElementById("successMessage").style.display = "none";

    // Limpiar errores y bordes
    document.querySelectorAll(".error").forEach(e => e.textContent = "");
    document.querySelectorAll("input").forEach(i => i.classList.remove("invalid"));

    // Nombre completo: obligatorio y mínimo 3
    const nombreLimpio = nombre.value.trim();
    if (nombreLimpio.length < 3) {
        nombreError.textContent = "El nombre debe tener al menos 3 caracteres.";
        nombre.classList.add("invalid");
        esValido = false;
    }

    // Email: obligatorio y formato correcto 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email.value.trim())) {
        emailError.textContent = "El correo electrónico no tiene un formato válido.";
        email.classList.add("invalid");
        esValido = false;
    }

    // Contraseña: mínimo 8, 1 mayúscula, 1 número
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password.value)) {
        passwordError.textContent =
            "La contraseña debe tener mínimo 8 caracteres, al menos 1 mayúscula y 1 número.";
        password.classList.add("invalid");
        esValido = false;
    }

    // Confirmar contraseña: debe coincidir 
    if (password.value !== confirmPassword.value) {
        confirmPasswordError.textContent = "Las contraseñas no coinciden.";
        confirmPassword.classList.add("invalid");
        esValido = false;
    }

    // Fecha de nacimiento: mayor de 18
    if (!dob.value) {
        dobError.textContent = "La fecha de nacimiento es obligatoria.";
        dob.classList.add("invalid");
        esValido = false;
    } else {
        const fechaNac = new Date(dob.value);
        const hoy = new Date();

        // Fecha exacta en la que cumple 18
        const cumple18 = new Date(
            fechaNac.getFullYear() + 18,
            fechaNac.getMonth(),
            fechaNac.getDate()
        );

        if (hoy < cumple18) {
            dobError.textContent = "Debes ser mayor de 18 años.";
            dob.classList.add("invalid");
            esValido = false;
        }
    }

    // Términos: obligatorio marcar 
    if (!terms.checked) {
        termsError.textContent = "Debes aceptar los términos y condiciones.";
        esValido = false;
    }

    // Si todo es correcto
    if (esValido) {
        document.getElementById("successMessage").style.display = "block";
     
    }
    return esValido;
}
