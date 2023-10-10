const input = document.querySelector('#input')
const span = document.querySelector('#span-error')
const editor = document.querySelector('#editor')

const cmEditor = CodeMirror.fromTextArea(editor, {
    lineNumbers: true,
    styleActiveLine: true,
    keyMap: 'sublime',
    mode: 'javascript',
    fixedGutter: false,
    tabSize: 4,
    theme: 'custom'
})

cmEditor.on('change', () => {
    const cm = document.querySelector('.CodeMirror')
    
    try {
        eval(cmEditor.getValue())
        input.oninput() // Force update
        
        cm.classList.remove('error')    
    } catch {
        console.log('Error')
        cm.classList.add('error')    
    }
})

cmEditor.setValue(cmEditor.getValue())  // Force update

/*const formJS = FormJS()


const verifyInput = formJS(onError)
    // .notEmpty()
    // .minLength(4)
    // .maxLength(60)
    // .rangeLength(4, 60)
    // .fixedLength(5, 10, 15)
    // .match(/\d+/g)
    // .number()
    // .range(10, 20)
    // .validCPF(true)
    // .format('nnn-dd-D', 'nnnddD')
    // .contains('Raffa')
    // .containsAll('Raffa', '064')
    // .prefix('pre', 'p')
    // .sufix('suf', 's')
    .createRule('link', ([], value) => value.startsWith('https://'))
    .link()
    
input.oninput = () => {
    if (verifyInput(input.value)) {
        span.innerText = ''
    }
}
    
function onError(rule, params, value) {
    const messages = {
        notEmpty: 'Input can\'t be empty',
        minLength: 'Too small',
        maxLength: 'Too big',
        rangeLength: 'Invalid length',
        fixedLength: 'Wrong length',
        match: 'Invalid format',
        number: 'Not a number',
        range: 'Not in range',
        validCPF: 'Is not a valid CPF',
        format: 'Invalid format',
        contains: 'Input don\'t contains nothing of '+JSON.stringify(params),
        containsAll: 'Input don\'t contains something',
        prefix: 'Invalid prefix',
        sufix: 'Invalid sufix',
        link: 'Invalid link'
    }
    
    span.innerText = messages[rule]
}
*/