const formJS = FormJS()

const nameInput = document.querySelector('#name')
const nameError = document.querySelector('#name + span')

const emailInput = document.querySelector('#email')
const emailError = document.querySelector('#email + span')

const cpfInput = document.querySelector('#cpf')
const cpfError = document.querySelector('#cpf + span')

const verifyName = formJS()
    .notEmpty().err(error(nameError, 'Name can\'t be empty'))
    .len(5, 32).err(error(nameError, 'Invalid length'))

nameInput.oninput = () => {
    if (verifyName(nameInput.value)) {
        nameInput.classList.remove('error')
        return
    }

    nameInput.classList.add('error')
}

const verifyEmail = formJS()
    .notEmpty().err(error(emailError, 'Email can\'t be empty'))
    .len(5, 64).err(error(emailError, 'Invalid email length'))
    .containsAll('@', '.').err(error(emailError, 'Invalid email format'))
    .sufix('gmail.com', 'hotmail.com').err(error(emailError, 'Invalid email format'))

emailInput.oninput = () => {
    if (verifyEmail(emailInput.value)) {
        emailInput.classList.remove('error')
        return
    }

    emailInput.classList.add('error')
}

const verifyCPF = formJS()
    .notEmpty().err(error(cpfError, 'CPF can\'t be empty'))
    .format('nnn.nnn.nnn-nn').err(error(cpfError, 'CPF must be formated nnn.nnn.nnn-nn'))
    .validCPF().err(error(cpfError, 'Invalid CPF'))

cpfInput.oninput = () => {
    if (verifyCPF(cpfInput.value)) {
        cpfInput.classList.remove('error')
        return
    }

    cpfInput.classList.add('error')
}

function error(errorSpan, errorMessage) {
    return () => {
        errorSpan.innerText = "Error: " + errorMessage
    }
}