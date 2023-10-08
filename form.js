function FormJS() {
    const formJS = () => {
        const ruleList = []

        const verify = (value) => {

            for (const ruleName in ruleList) {
                const rule = ruleList[ruleName]
                const valid = rule(value)

                if (!valid) {
                    if (rule.err) rule.err(value)
                    return false
                }
            }

            return true
        }

        verify.err = (errorHandler) => {
            ruleList[ruleList.length - 1].err = errorHandler

            return verify
        }

        verify.notEmpty = () => {
            ruleList.push((value) => value.trim().length > 0)

            return verify
        }

        verify.minLength = (minLength) => {
            ruleList.push((value) => value.length >= minLength)

            return verify
        }

        verify.maxLength = (maxLength) => {
            ruleList.push((value) => value.length <= maxLength)

            return verify
        }

        verify.len = (minLength, maxLength) => {
            ruleList.push((value) => value.length >= minLength && value.length <= maxLength)
            
            return verify
        }

        verify.fixedLength = (...fixedLengths) => {
            ruleList.push((value) => {
                for (const length of fixedLengths) {
                    if (value.length == length) {
                        return true
                    }
                }

                return false
            })

            return verify
        }

        verify.match = (...regexPatterns) => {
            ruleList.push((value) => {
                for (const regex of regexPatterns) {
                    const match = value.match(regex)

                    if (match) {
                        return true
                    }
                }

                return false
            })

            return verify
        }

        verify.isNumber = () => {
            ruleList.push((value) => !isNaN(value))

            return verify
        }

        verify.range = (min, max) => { // range for number values
            ruleList.push((value) => value >= min && value <= max)

            return verify
        }

        verify.validCPF = (ignoreSeparators = true) => {
            ruleList.push((value) => {
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

            return verify
        }

        verify.format = (...formatStrings) => {
            /*
                format
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

            ruleList.push((value) => {
                for (const index in formatStrings) {
                    const formatStr = formatStrings[index]
                    const match = checkFormat(formatStr, value)

                    if (match) {
                        return true
                    }
                }

                return false
            })

            return verify
        }

        verify.contains = (...terms) => { // Contains almost one
            ruleList.push((value) => {
                for (const term of terms) {
                    if (value.includes(term)) {
                        return true
                    }
                }

                return false
            })

            return verify
        }

        verify.containsAll = (...terms) => { // Contains all
            ruleList.push((value) => {
                for (const term of terms) {
                    if (!value.includes(term)) {
                        return false
                    }
                }

                return true
            })

            return verify
        }

        verify.custom = (...rules) => {
            for (const rule of rules) {
                ruleList.push(rule)
            }

            return verify
        }

        verify.prefix = (...prefixes) => {
            ruleList.push((value) => {
                for (const prefix of prefixes) {
                    if (value.startsWith(prefix)) {
                        return true
                    }
                }

                return false
            })

            return verify
        }

        verify.sufix = (...sufixes) => {
            ruleList.push((value) => {
                for (const sufix of sufixes) {
                    if (value.endsWith(sufix)) {
                        return true
                    }
                }

                return false
            })

            return verify
        }

        return verify;
    }

    return formJS
}

// .isNumber()
// .range(10, 40)
// .notEmpty()
// .minLength(5)
// .maxLength(32)
// .length(5, 32)
// .fixedLength(5, 10)
// .match(/[a-z]+/g)
// .validCPF()
// .format('nnn.nnn-dd', 'nnnnnndd')
// .contains('a')
// .containsAll('@', '.')
// .custom(email).err(invalidEmail)
// .prefix('http://', 'https://')
// .sufix('@gmail.com', '@hotmail.com')