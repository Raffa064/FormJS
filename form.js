function FormJS() {
    const DEFAULT_ERROR_HANDLER = (ruleName, ruleParams, value) => {
        console.log('FormJS ERROR: ' + ruleName + ' "' + value + '"')
    }
    
    const CPF_SEPARATORS = [[3, '.'], [7, '.'], [11, '-']] // nnn.nnn.nnn-nn

    const formJS = (errorHandler = DEFAULT_ERROR_HANDLER) => {
        const ruleList = []

        const verify = (value) => {
            for (const ruleIndex in ruleList) {
                const [ruleName, ruleParams, rule] = ruleList[ruleIndex]
                const accepted = rule(value)

                if (!accepted) {
                    errorHandler(ruleName, ruleParams, value)
                    return false
                }
            }

            return true
        }

        verify.setErrorHandler = (_errorHandler) => {
            errorHandler = _errorHandler

            return verify
        }

        const createRule = (name, func) => {
            verify[name] = (...params) => {
                ruleList.push([name, params, (value) => func(params, value)])

                return verify
            }

            return verify
        }

        verify.createRule = createRule

        createRule('notEmpty', (params, value) => {
            return value.trim().length > 0
        })

        createRule('minLength', ([minLength], value) => {
            return value.length >= minLength
        })

        createRule('maxLength', ([maxLength], value) => {
            return value.length <= maxLength
        })

        createRule('rangeLength', ([minLength, maxLength], value) => {
            return value.length >= minLength && value.length <= maxLength
        })

        createRule('fixedLength', (fixedLengths, value) => {
            for (const length of fixedLengths) {
                if (value.length == length) {
                    return true
                }
            }

            return false
        })

        createRule('match', (regexPatterns, value) => {
            for (const regex of regexPatterns) {
                const match = value.match(regex)

                if (match) {
                    return true
                }
            }

            return false
        })

        createRule('number', (params, value) => {
            return !isNaN(value)
        })

        createRule('range', ([min, max], value) => {
            return value >= min && value <= max
        })

        createRule('validCPF', ([checkSeparators], value) => {
            if (value.length < 11 || value.length > 14) { // Min/Max CPF length
                return false;
            }
            
            if (checkSeparators) {
                for (const [index, target] of CPF_SEPARATORS) {
                    if (value.charAt(index) != target) {
                        return false
                    }    
                }
            }
            
            var sum = 0;
            var count = 0;
            
            for (let i = 0; i < value.length; i++) {
                const char = value.charAt(i)
                
                if (!isNaN(char)) {
                    sum += parseInt(char);
                    count++;
                }
            }
            
            const { floor } = Math
            
            const ten = floor(sum / 10) // 15 = 1
            const ones = floor(sum % 10) // 15 = 5
            
            return ones == ten && count == 11
        })

        createRule('format', (formatStrings, value) => {
            /*
                Format:
                    # any
                    n number
                    d lowercase digit
                    D uppercase digit
                    w whole case digit
                    / literal char
            */

            const checkFormat = (formatStr, value) => {
                var offset = 0
                for (let i = 0; i < formatStr.length; i++) {
                    const char = value.charAt(i - offset)
                    const target = formatStr.charAt(i)

                    switch (target) {
                        case "#":
                            /* Accept any char */
                            break;
                        case "n":
                            if (isNaN(char)) return false
                            break;
                        case "d":
                            if (!char.match('[a-z]')) return false
                            break;
                        case "D":
                            if (!char.match('[A-Z]')) return false
                            break;
                        case "d":
                            if (!char.match('[a-z]')) return false
                            break;
                        case "/":
                            const nextTarget = formatStr.charAt(i + 1)

                            if (char !== nextTarget) return false

                            i++
                            offset++

                            break;
                        default:
                            console.log('Literal: ' + target)
                            if (char !== target) return false;
                            break;
                    }
                }
                return true
            }

            for (const formatStr of formatStrings) {
                const match = checkFormat(formatStr, value)

                if (match) {
                    return true
                }
            }

            return false
        })

        createRule('contains', (terms, value) => {
            for (const term of terms) {
                if (value.includes(term)) {
                    return true
                }
            }

            return false
        })

        createRule('containsAll', (terms, value) => {
            for (const term of terms) {
                if (!value.includes(term)) {
                    return false
                }
            }

            return true
        })

        createRule('prefix', (prefixes, value) => {
            for (const prefix of prefixes) {
                if (value.startsWith(prefix)) {
                    return true
                }
            }

            return false
        })

        createRule('sufix', (sufixes, value) => {
            for (const sufix of sufixes) {
                if (value.endsWith(sufix)) {
                    return true
                }
            }

            return false
        })

        return verify;
    }

    return formJS
}

try {
    FormJS_test()
} catch(err) {
    console.log(err)
    document.body.innerText = err;
}

function FormJS_test() {
    const formJS = FormJS()
    
    const validator = formJS()
        .validCPF(true)
        
    const dataset = [
        ['123.456.789-19', true],
        ['123.456.789-10', false],
        ['123.456.78910', false],
        ['12345678910', false],
        ['123.456.789.10', false],
    ]
    
    for (const test of dataset) {
        var [value, result] = test
        
        if (validator(value) != result) {
            throw new Error('FormJS Test Error for '+value)
        }
    }
}