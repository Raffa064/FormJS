function FormJS() {
    const DEFAULT_ERROR_HANDLER = (ruleName, ruleParams, value) => {
        console.log('FormJS ERROR: ' + ruleName + ' "' + value + '"')
    }
    
    const formJS = (errorHandler=DEFAULT_ERROR_HANDLER) => {
        const ruleList = []

        const verify = (value) => {
            for (const ruleIndex in ruleList) {
                const [ ruleName, ruleParams, rule ] = ruleList[ruleIndex]
                const valid = rule(value)

                if (!valid) {
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

        createRule('notEmpty', ([], value) => {
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

        createRule('number', ([], value) => {
            return !isNaN(value)
        })

        createRule('range', ([min, max], value) => {
            return value >= min && value <= max
        })

        createRule('validCPF', ([ignoreSeparators = false], value) => {
            if (!ignoreSeparators) {
                if (value.length != 14) { //nnn.nnn.nnn-nn
                    return false
                }

                const indexes = [[3, "."], [7, "."], [11, "-"]]
                for (let i = 0; i < indexes.length; i++) { // nnn.nnn.nnn-nn
                    const [index, separator] = indexes[i]
                    const char = value.charAt(index)

                    if (char != separator) {
                        return false
                    }
                }
            }

            var cpfNumbers = ""

            for (let i = 0; i < value.length; i++) {
                const char = value.charAt(i)

                if (isNaN(char)) {
                    continue
                }

                cpfNumbers += char
            }

            var sum = 0
            for (let i = 0; i < 11; i++) { // nnn.nnn.nnn-nn
                sum += parseInt(cpfNumbers.charAt(i))
            }

            const stringSum = sum.toString()
            const firstChar = stringSum.charAt(0)

            for (let i = 0; i < stringSum.length; i++) {
                const char = stringSum.charAt(i)
                if (char !== firstChar) {
                    return false
                }
            }

            return true
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