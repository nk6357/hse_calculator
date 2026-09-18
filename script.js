const input=document.getElementById("inroot");
const accuracyInput=document.getElementById("accuracy");
const calculateButton=document.getElementById("Calculate");
const numericResult=document.getElementById("numeric-result");
const analyticResult=document.getElementById("analytic-result");
const complexResult=document.getElementById("complex-result");
//форматирование числа
function formatNumber(number, accuracy) {
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
calculateButton.addEventListener("click", function () {
    const inputValue = input.value.trim();
    const number = Number(inputValue);
    let accuracy = Number(accuracyInput.value);
// проверка ввода
    if (inputValue=== "" || Number.isNaN(number)) {
        numericResult.textContent = "Введите число";
        analyticResult.textContent = "";
        complexResult.textContent = "";   
        return;
    }
    if (Number.isNaN(accuracy) || accuracy < 0) {
        accuracy=0;
    }
    if (accuracy>512) {
        accuracy=512;
    }
//мой милый нолик
    if (number===0) {
        numericResult.innerHTML = "0";
        analyticResult.innerHTML = "0";
        complexResult.innerHTML = "0";
        return;
    }
// с ноликом покончено
// положительная приятность
    if (number > 0) {
        const root = Math.sqrt(number);
        const positiveRoot=formatNumber(root, accuracy);
        const negativeRoot=formatNumber(-root, accuracy);
        numericResult.innerHTML=`${positiveRoot} ${negativeRoot}`;
        const analytic=analyticSqrt(number);
        analyticResult.innerHTML=`${analytic} -${analytic}`;
        return;
    }
//отрицательная приятность
    const positiveNumber=Math.abs(number);
    const imaginaryRoot=Math.sqrt(positiveNumber);
    const positiveImaginary=formatNumber(imaginaryRoot, accuracy);
    const negativeImaginary=formatNumber(-imaginaryRoot, accuracy);
    complexResult.innerHTML=`${positiveImaginary}i ${negativeImaginary}i`;
});