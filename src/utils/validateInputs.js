/*** ===================== VALIDATE INPUT S===================== */
const validateEmail = (email) => {
    if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        return true;
    };
    return false;
}
const validateContact = (contact) => {
    if (contact.match(/^\d{10}$/)) {
        return true;
    };
    return false;
}
const validatePassword = (password) => {
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>/?])(?!.*\s)/g)) {
        return true;
    };
    return false;
}

export const validateInputs = (email, password) => {
    if (!email || !password) {
        return { status: false, message: "fields must not be empty!" };
    }
    // check email format:
    if (!validateEmail(email)) {
        return { status: false, message: "Email is invalid" };
    }
    // check password length:
    if (password.length < 8) {
        return { status: false, message: "password should be atleast 8 chars" };
    }
    // check password format:
    if (!validatePassword(password)) {
        return { status: false, message: "Password must be at least one uppercase letter, one lowercase letter, one digit, and one special character" };
    }
    return { status: true, message: "success!" };
}