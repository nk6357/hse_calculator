const input=document.getElementById("inroot");
const accuracyInput=document.getElementById("accuracy");
const calculateButton=document.getElementById("Calculate");
const numericResult=document.getElementById("numeric-result");
const analyticResult=document.getElementById("analytic-result");
const complexResult=document.getElementById("complex-result");
//форматирование числа
function formatNumber(number, accuracy) {
    if (accuracy > 15) {
        return number.toFixed(accuracy); // строка для большой точности
    }
    return Number(number.toFixed(accuracy));
}
//аналитическая форма кв корня
function analyticSqrt(number) {
    if (number === 0) {
        return "0";
    }
    let outside=1;
    let inside=number;
//вынос полного квадрата
    for (let i=2; i*i<=inside; i++) {
        while (inside % (i*i)===0) {
            inside = inside/(i*i);
            outside = outside*i;
        }
    }
    if (inside===1) {
        return outside.toString();
    }
    if (outside===1) {
        return "√" + inside;
    }
    return outside +"√"+ inside;
}



// проверяем скобки
function checkBrackets(str) {
    let cnt = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '(') cnt++;
        if (str[i] === ')') cnt--;
        if (cnt < 0) return false;
    }
    return cnt === 0;
}

// проверка на странные символы
function hasInvalidCharacters(str) {
    const allowed = /^[0-9+\-*/()^.\ssincogtanlgPei]+$/;
    return !allowed.test(str);
}

// пустые скобки ()
function hasEmptyBrackets(str) {
    return /\(\s*\)/.test(str);
}

// проверяем правильность функций
function checkFunctionFormat(str) {
    const trig = /(sin|cos|tan|ctg)\^?\d*\([^)]*\)/g;
    const matches = str.match(trig);

    if (matches) {
        for (let m of matches) {
            const inside = m.match(/\(([^)]*)\)/);
            if (inside && inside[1].trim() === '') {
                return false;
            }
        }
    }

    const logs = /(ln|log\d+)\^?\d*\([^)]*\)/g;
    const logMatches = str.match(logs);

    if (logMatches) {
        for (let m of logMatches) {
            const inside = m.match(/\(([^)]*)\)/);
            if (inside && inside[1].trim() === '') {
                return false;
            }
        }
    }

    return true;
}

// операторы подряд
function hasInvalidOperators(str) {
    if (/[\+\*\/\^]{2,}/.test(str)) return true;
    if (/^[\+\*\/\^]/.test(str)) return true;
    if (/[\+\-\*\/\^]$/.test(str)) return true;
    return false;
}

// деление на 0
function checkDivisionByZero(str) {
    if (/\/\s*0(?!\d)/.test(str)) {
        return true;
    }
    return false;
}

// P -> pi
function replacePi(str) {
    return str.replace(/P/g, '(' + Math.PI.toString() + ')');
}

// градусы -> радианы
function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}

// считаем тригонометрию
function calculateTrig(func, angle, power) {
    const rad = degreesToRadians(angle);
    let res;

    if (func === 'sin') {
        res = Math.sin(rad);
    } else if (func === 'cos') {
        res = Math.cos(rad);
    } else if (func === 'tan') {
        res = Math.tan(rad);
    } else if (func === 'ctg') {
        res = 1 / Math.tan(rad);
    } else {
        return null;
    }

    if (power > 1) {
        res = Math.pow(res, power);
    }

    return res;
}

// считаем логарифмы
function calculateLog(base, val, power) {
    let res;

    if (val <= 0) {
        return null;
    }

    if (base === 'e') {
        res = Math.log(val);
    } else {
        res = Math.log(val) / Math.log(base);
    }

    if (power > 1) {
        res = Math.pow(res, power);
    }

    return res;
}

// есть ли буквы-переменные
function hasVariables(str) {
    const cleaned = str
        .replace(/sin|cos|tan|ctg|log|ln|P/g, '')
        .replace(/[0-9+\-*/()^.\s]/g, '');

    return cleaned.length > 0;
}

// вычисляем выражение
function evaluateExpression(str) {
    try {
        str = str.replace(/\^/g, '**');
        const res = eval(str);
        return res;
    } catch (e) {
        return null;
    }
}

// делим комплексные числа (2+3i)
function parseComplexNumber(str) {
    const pattern1 = /^([+-]?\d+\.?\d*)\s*([+-])\s*(\d+\.?\d*)i$/;
    const match = str.match(pattern1);

    if (match) {
        const re = parseFloat(match[1]);
        const im = parseFloat(match[2] + match[3]);
        return { real: re, imaginary: im };
    }

    const pattern2 = /^([+-]?\d+\.?\d*)i$/;
    const match2 = str.match(pattern2);

    if (match2) {
        return { real: 0, imaginary: parseFloat(match2[1]) };
    }

    return null;
}

// корень из комплексного числа
function complexSqrt(re, im) {
    const mod = Math.sqrt(re * re + im * im);
    const arg = Math.atan2(im, re);

    const sqrtMod = Math.sqrt(mod);
    const halfArg = arg / 2;

    const re1 = sqrtMod * Math.cos(halfArg);
    const im1 = sqrtMod * Math.sin(halfArg);

    const re2 = -re1;
    const im2 = -im1;

    return [
        { real: re1, imaginary: im1 },
        { real: re2, imaginary: im2 }
    ];
}

// форматируем комплексное число
function formatComplexNumber(re, im, acc) {
    re = formatNumber(re, acc);
    im = formatNumber(Math.abs(im), acc);

    if (re === 0 && im === 0) return "0";
    if (re === 0) return im + "i";
    if (im === 0) return re.toString();

    const sign = im >= 0 ? "+" : "-";
    return re + sign + im + "i";
}

// основная функция обработки
function processInput(val, acc) {
    val = val.trim();

    // проверки
    if (val === "") {
        return {
            type: 'error',
            numeric: "Ошибка: введите выражение",
            analytic: "",
            complex: ""
        };
    }

    if (hasInvalidCharacters(val)) {
        return {
            type: 'error',
            numeric: "Ошибка: недопустимые символы в выражении",
            analytic: "",
            complex: ""
        };
    }

    if (!checkBrackets(val)) {
        return {
            type: 'error',
            numeric: "Ошибка: неправильно расставлены скобки",
            analytic: "",
            complex: ""
        };
    }

    if (hasEmptyBrackets(val)) {
        return {
            type: 'error',
            numeric: "Ошибка: пустые скобки в выражении",
            analytic: "",
            complex: ""
        };
    }

    if (!checkFunctionFormat(val)) {
        return {
            type: 'error',
            numeric: "Ошибка: неправильный формат функции",
            analytic: "",
            complex: ""
        };
    }

    if (hasInvalidOperators(val)) {
        return {
            type: 'error',
            numeric: "Ошибка: неправильная последовательность операторов",
            analytic: "",
            complex: ""
        };
    }

    if (checkDivisionByZero(val)) {
        return {
            type: 'error',
            numeric: "Ошибка: деление на ноль",
            analytic: "",
            complex: ""
        };
    }

    const original = val;
    val = replacePi(val);

    // комплексные числа
    const complex = parseComplexNumber(val);
    if (complex !== null) {
        const roots = complexSqrt(complex.real, complex.imaginary);
        const r1 = formatComplexNumber(roots[0].real, roots[0].imaginary, acc);
        const r2 = formatComplexNumber(roots[1].real, roots[1].imaginary, acc);

        return {
            type: 'complex',
            numeric: r1 + " " + r2,
            analytic: "",
            complex: r1 + " " + r2
        };
    }

    // тригонометрия
    const trigPat = /(sin|cos|tan|ctg)(\^(\d+))?\(([^)]+)\)/g;
    let processed = val;

    processed = processed.replace(trigPat, function(match, func, powerPart, power, angle) {
        power = power ? parseInt(power) : 1;

        let angleVal;
        try {
            angleVal = evaluateExpression(angle.replace(/\^/g, '**'));
            if (angleVal === null || isNaN(angleVal) || !isFinite(angleVal)) {
                return match;
            }
        } catch (e) {
            return match;
        }

        const result = calculateTrig(func, angleVal, power);
        if (result === null || isNaN(result) || !isFinite(result)) {
            return match;
        }
        return result.toString();
    });

    // логарифмы
    const logPat = /ln(\^(\d+))?\(([^)]+)\)|log(\d+)(\^(\d+))?\(([^)]+)\)/g;

    processed = processed.replace(logPat, function(match, lnPow1, lnPow2, lnVal, base, logPow1, logPow2, logVal) {
        if (match.startsWith('ln')) {
            const pow = lnPow2 ? parseInt(lnPow2) : 1;
            const v = evaluateExpression(lnVal.replace(/\^/g, '**'));

            if (v === null || isNaN(v) || !isFinite(v)) {
                return match;
            }

            const result = calculateLog('e', v, pow);
            if (result === null || isNaN(result) || !isFinite(result)) {
                return match;
            }
            return result.toString();
        } else {
            const pow = logPow2 ? parseInt(logPow2) : 1;
            const v = evaluateExpression(logVal.replace(/\^/g, '**'));
            base = parseInt(base);

            if (v === null || isNaN(v) || !isFinite(v) || base <= 0 || base === 1) {
                return match;
            }

            const result = calculateLog(base, v, pow);
            if (result === null || isNaN(result) || !isFinite(result)) {
                return match;
            }
            return result.toString();
        }
    });

    // буквенные выражения
    if (hasVariables(processed)) {
        return {
            type: 'symbolic',
            numeric: "",
            analytic: "√(" + original + ")",
            complex: ""
        };
    }

    // вычисляем
    try {
        const num = evaluateExpression(processed);

        if (num === null || isNaN(num)) {
            return {
                type: 'error',
                numeric: "Ошибка: не удалось вычислить выражение",
                analytic: "",
                complex: ""
            };
        }

        if (!isFinite(num)) {
            return {
                type: 'error',
                numeric: "Ошибка: результат слишком большой (бесконечность)",
                analytic: "",
                complex: ""
            };
        }

        // корень
        if (num === 0) {
            return {
                type: 'number',
                numeric: "0",
                analytic: "0",
                complex: "0"
            };
        }

        if (num > 0) {
            const root = Math.sqrt(num);

            if (isNaN(root) || !isFinite(root)) {
                return {
                    type: 'error',
                    numeric: "Ошибка: не удалось вычислить корень",
                    analytic: "",
                    complex: ""
                };
            }

            const pos = formatNumber(root, acc);

            let analytic = "";
            if (Number.isInteger(num) && num < 1000000) {
                const a = analyticSqrt(num);
                analytic = a;
            }

            return {
                type: 'positive',
                numeric: pos,
                analytic: analytic,
                complex: ""
            };
        }

        if (num < 0) {
            const pos = Math.abs(num);
            const imgRoot = Math.sqrt(pos);
            const posImg = formatNumber(imgRoot, acc);
            const negImg = formatNumber(-imgRoot, acc);

            return {
                type: 'negative',
                numeric: "",
                analytic: "",
                complex: posImg + "i " + negImg + "i"
            };
        }

    } catch (e) {
        return {
            type: 'error',
            numeric: "Ошибка: не удалось обработать выражение",
            analytic: "",
            complex: ""
        };
    }
}

// обработчик кнопки
calculateButton.addEventListener("click", function () {
    const inputValue = input.value.trim();
    let accuracy = Number(accuracyInput.value);

    // Проверка на пустой ввод
    if (inputValue === "") {
        numericResult.textContent = "Введите выражение";
        analyticResult.textContent = "";
        complexResult.textContent = "";
        return;
    }

    // Проверка точности
    if (Number.isNaN(accuracy) || accuracy < 0) {
        accuracy = 0;
    }
    if (accuracy > 512) {
        accuracy = 512;
    }

    // Обрабатываем ввод
    const result = processInput(inputValue, accuracy);

    // Выводим результат
    numericResult.innerHTML = result.numeric;
    analyticResult.innerHTML = result.analytic;
    complexResult.innerHTML = result.complex;
});
