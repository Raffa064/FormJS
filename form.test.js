const output = document.querySelector('ul')
const errors = []
const formJS = FormJS(() => {})

var testCounter = 0

try {
    runTest(errors, notEmptyTest)
    runTest(errors, minLengthTest)
    runTest(errors, maxLengthTest)
    runTest(errors, rangeLengthTest)
    runTest(errors, fixedLengthTest)
    runTest(errors, matchTest)
    runTest(errors, numberTest)
    runTest(errors, rangeTest)
    runTest(errors, () => validCPFTest(true), 'validCPF(true)')
    runTest(errors, () => validCPFTest(false), 'validCPF(false)')
    runTest(errors, formatTest)
    runTest(errors, containsTest)
    runTest(errors, containsAllTest)
    runTest(errors, prefixTest)
    runTest(errors, sufixTest)
    
    showErrors(errors)
} catch(err) {
    console.log(err)
    
    output.innerHTML = '<h2 style="color: red">[ An error occurred during tests ]<br>View console for more information.</h2>'
}

function showErrors(errors) {
    var html = ''
    
    for (const { test, input, targetResult, result } of errors) {
        const item = `<li><strong>Test:</strong> ${test}<br><strong>Input:</strong> ${input}<br><strong>Target Result:</strong> ${targetResult}<br><strong>Result:</strong> ${result}</li>`;
    
        html += item
    }
    
    if (errors.length === 0) {
        html = '<li><strong style="display: block; text-align: center;">No errors</strong></li>'
    }
    
    html += '<li><strong style="display: block; text-align: center;"> Result: ' + (testCounter - errors.length) + '/' + testCounter + '</strong></li>'
    
    output.innerHTML = html
}

function runTest(error, testFunction, customLabel) {
    const [validator, dataset] = testFunction()

    for (const data of dataset) {
        const [input, targetResult] = data
        const result = validator(input)

        if (result !== targetResult) {
            errors.push({
                test: customLabel || testFunction.name,
                input,
                targetResult,
                result
            })
        }
        
        testCounter++
    }

    return errors
}

function templateTest() {
    const validator = function() {
        return Math.random() < .5
    }

    const dataset = []

    for (let i = 0; i < 10; i++) {
        dataset.push(['lorem', Math.random() < .5])
    }

    return [validator, dataset]
}

function notEmptyTest() {
    const validator = formJS()
        .notEmpty()

    const dataset = []

    for (let i = 0; i < 10; i++) {
        const length = random(10)
        const input = randomString(length)
        var targetResult = length > 0

        dataset.push([input, targetResult])
    }

    return [validator, dataset]
}

function minLengthTest() {
    const min = random(10, 20)
    const validator = formJS()
        .minLength(min)

    const dataset = []

    for (let i = 0; i < 100; i++) {
        const length = random(0, min * 2)
        const input = randomString(length)
        var targetResult = length >= min

        dataset.push([input, targetResult])
    }

    return [validator, dataset]
}

function maxLengthTest() {
    const max = random(10, 20)
    const validator = formJS()
        .maxLength(max)

    const dataset = []

    for (let i = 0; i < 100; i++) {
        const length = random(0, max * 2)
        const input = randomString(length)
        var targetResult = length <= max

        dataset.push([input, targetResult])
    }

    return [validator, dataset]
}

function rangeLengthTest() {
    const min = random(5, 10)
    const max = random(11, 15)
    const validator = formJS()
        .rangeLength(min, max)

    const dataset = []

    for (let i = 0; i < 100; i++) {
        const length = random(0, max * 2)
        const input = randomString(length)
        var targetResult = length >= min && length <= max

        dataset.push([input, targetResult])
    }

    return [validator, dataset]
}

function fixedLengthTest() {
    const lengths = [random(10), random(10), random(10)]
    const validator = formJS()
        .fixedLength(...lengths)

    const dataset = []

    for (let i = 0; i < 100; i++) {
        const length = random(0, 20)
        const input = randomString(length)
        var targetResult = lengths.indexOf(length) != -1

        dataset.push([input, targetResult])
    }

    return [validator, dataset]
}

function matchTest() {
    const regex = /[A-z]+/
    const validator = formJS()
        .match(regex)

    const dataset = []

    for (let i = 0; i < 100; i++) {
        const length = random(0, 20)
        const input = randomString(length, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890')
        var targetResult = regex.test(input)

        dataset.push([input, targetResult])
    }

    return [validator, dataset]
}

function numberTest() {
    const validator = formJS()
        .number()

    const dataset = []

    for (let i = 0; i < 50; i++) {
        const input = (random(0, 1000) / random(0, 10)).toString()
        var targetResult = true

        dataset.push([input, targetResult])
    }

    for (let i = 0; i < 50; i++) {
        const input = randomString(length, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890')
        var targetResult = !isNaN(input)

        dataset.push([input, targetResult])
    }

    return [validator, dataset]
}

function rangeTest() {
    const min = random(10)
    const max = random(10, 20)
    const validator = formJS()
        .range(min, max)

    const dataset = []

    for (let i = 0; i < 100; i++) {
        const input = random(0, 100).toString()
        var targetResult = input >= min && input <= max

        dataset.push([input, targetResult])
    }

    return [validator, dataset]
}

function validCPFTest(checkSeparators) {
    const validator = formJS()
        .validCPF(checkSeparators)

    const dataset = []

    for (let i = 0; i < 50; i++) {
        const cpf = randomCPF(checkSeparators)
        dataset.push([cpf, true])
    }
    
    for (let i = 0; i < 50; i++) {
        const cpf = randomCPF()
        dataset.push([cpf, checkSeparators? false : true])
    }

    for (let i = 0; i < 50; i++) {
        const randString = randomString(random(5, 20))
        dataset.push([randString, false])
    }

    return [validator, dataset]
}

function formatTest() {
    const validator = formJS()
        .format('#ndDw/n')
        
    const LOWER_CASE_CHARS = 'abcdefghijklmnopqrstuvwxyz'
    const UPPER_CASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const NUMBERS_CHARS = '0123456789'
    const SPECIAL_CHARS = '#$%(){}/|'
    const ANY_CHAR = LOWER_CASE_CHARS + UPPER_CASE_CHARS + NUMBERS_CHARS + SPECIAL_CHARS
        
    const generatePattern = () => {
        const any = randomString(1, ANY_CHAR)
        const number = randomString(1, NUMBERS_CHARS)
        const lower = randomString(1, LOWER_CASE_CHARS)
        const upper = randomString(1, UPPER_CASE_CHARS)
        const whole = Math.random() < .5 ? lower : upper
        const n = 'n'
        
        return any + number + lower + upper + whole + n
    }    
        
    const dataset = []
    
    for (let i = 0; i < 50; i++) {
        const pattern = generatePattern()
        dataset.push([pattern, true])
    }
    
    for (let i = 0; i < 50; i++) {
        const randString = randomString(random(20))
        
        dataset.push([randString, false])
    }
    
    return [ validator, dataset ]
}

function containsTest() {
    const validator = formJS()
        .contains('test')
        
    const dataset = []
    
    for (let i = 0; i < 25; i++) {
        const string = randomString(10) + 'test'
        dataset.push([string, true])
    }
    
    for (let i = 0; i < 25; i++) {
        const string = 'test' + randomString(10)
        dataset.push([string, true])
    }
    
    for (let i = 0; i < 25; i++) {
        const string = randomString(5) + 'test' + randomString(5)
        dataset.push([string, true])
    }
    
    for (let i = 0; i < 50; i++) {
        const string = randomString(random(20))
        dataset.push([string, false])
    }
    
    return [ validator, dataset ]
}

function containsAllTest() {
    const validator = formJS()
        .containsAll('lorem', 'ipsum')

    const dataset = []

    for (let i = 0; i < 25; i++) {
        const string = 'lorem' + randomString(10) + 'ipsum'
        dataset.push([string, true])
    }

    for (let i = 0; i < 25; i++) {
        const string = 'lorem' + randomString(10)
        dataset.push([string, false])
    }

    for (let i = 0; i < 25; i++) {
        const string = 'ipsum' + randomString(5)
        dataset.push([string, false])
    }

    for (let i = 0; i < 50; i++) {
        const string = randomString(random(30))
        dataset.push([string, false])
    }

    return [validator, dataset]
}

function prefixTest() {
    const validator = formJS()
        .prefix('lorem')

    const dataset = []

    for (let i = 0; i < 50; i++) {
        const string = 'lorem' + randomString(10)
        dataset.push([string, true])
    }
    
    for (let i = 0; i < 50; i++) {
        const string = randomString(10) + 'lorem' + randomString(10)
        dataset.push([string, false])
    }
    
    for (let i = 0; i < 50; i++) {
        const string = randomString(10) + 'lorem'
        dataset.push([string, false])
    }

    for (let i = 0; i < 50; i++) {
        const string = randomString(10)
        dataset.push([string, false])
    }

    return [validator, dataset]
}

function sufixTest() {
    const validator = formJS()
        .sufix('lorem')

    const dataset = []
    
    for (let i = 0; i < 50; i++) {
        const string = 'lorem' + randomString(10)
        dataset.push([string, false])
    }
    
    for (let i = 0; i < 50; i++) {
        const string = randomString(10) + 'lorem' + randomString(10)
        dataset.push([string, false])
    }

    for (let i = 0; i < 50; i++) {
        const string = randomString(10) + 'lorem'
        dataset.push([string, true])
    }
    
    for (let i = 0; i < 50; i++) {
        const string = randomString(10)
        dataset.push([string, false])
    }

    return [validator, dataset]
}

function randomCPF(useSeparators) {
    var total = random(1, 9) * 11 // 11, 22, ... 99
    
    const numbers = []
    
    var sum = 0
    for (let i = 0; i < 11; i++) {
        var value = random(10)
        numbers.push(value)
        sum += value
    }
    
    var decrease = sum % 11
    
    while (decrease > 0) {
        var randomIndex = random(11)
        
        if (numbers[randomIndex] > 0) {
            numbers[randomIndex]--
            decrease--
        }
    }
    
    const cpf = numbers.reduce((prev, curr) => prev + curr, '')
    
    return useSeparators ? addCPFSeparators(cpf) : cpf
}

function addCPFSeparators(cpf) {
    return cpf.substring(0, 3) + '.' + cpf.substring(3, 6) + '.' + cpf.substring(6, 9) + '-' + cpf.substring(9, 11)
}

function randomString(length, chars) {
    var string = ''
    for (let i = 0; i < length; i++) string += randomChar(chars)

    return string
}

function randomChar(chars) {
    const CHARS = chars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    return CHARS.charAt(random(CHARS.length))
}

function random(a, b) {
    const { floor, min, max } = Math

    if (a !== undefined && b !== undefined) {
        return floor(min(a, b) + ((max(a, b) + 1) - min(a, b)) * Math.random())  // random number from a to b (inclusive/inclusive)
    }

    return floor(Math.random() * a)
}