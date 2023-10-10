const formJS = FormJS()

const nameInput = document.querySelector('#name')
const nameError = document.querySelector('#name + span')
const emailInput = document.querySelector('#email')
const emailError = document.querySelector('#email + span')
const cpfInput = document.querySelector('#cpf')
const cpfError = document.querySelector('#cpf + span')

const verifyName = formJS()
    .notEmpty()
    .rangeLength(5, 32)
    .setErrorHandler(createError(nameError, {
        notEmpty: 'Name can\'t be empty',
        rangeLength: 'Invalid length'
    }))

nameInput.oninput = () => {
    if (verifyName(nameInput.value)) {
        nameInput.classList.remove('error')
        return
    }

    nameInput.classList.add('error')
}

const verifyEmail = formJS()
    .notEmpty()
    .rangeLength(5, 64)
    .containsAll('@', '.')
    .sufix('gmail.com', 'hotmail.com')
    .setErrorHandler(createError(emailError, {
        notEmpty: 'Email can\'t be empty',
        rangeLength: 'Invalid length',
        containsAll: 'Invalid email',
        sufix: 'Invalid email'
    }))

emailInput.oninput = () => {
    if (verifyEmail(emailInput.value)) {
        emailInput.classList.remove('error')
        return
    }

    emailInput.classList.add('error')
}

const verifyCPF = formJS()
    .notEmpty()
    .format('nnn.nnn.nnn-nn')
    .validCPF()
    .setErrorHandler(createError(cpfError, {
        notEmpty: 'CPF can\'t be empty',
        format: 'Invalid CPF format',
        validCPF: 'Invalid CPF'
    }))

cpfInput.oninput = () => {
    if (verifyCPF(cpfInput.value)) {
        cpfInput.classList.remove('error')
        return
    }

    cpfInput.classList.add('error')
}

function createError(span, messages) {
    return (ruleName, ruleParams, value) => {
        span.innerText = messages[ruleName]
    }
}