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