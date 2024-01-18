function isNumber(char) {
    return !isNaN(char) && char !== ' ';
}

function extractPriceRanges(priceRangeStr) {
    let numberStr = "";
    let min;
    let max;

    for (let i = 0; i < priceRangeStr.length; i++) {
        let currentChar = priceRangeStr[i];

        if (isNumber(currentChar)) {
            numberStr += currentChar;
        }

        if (!isNumber(currentChar) || i === priceRangeStr.length - 1) {
            if (numberStr !== "") {
                if (min === undefined) {
                    min = parseInt(numberStr);
                    numberStr = "";
                } else if (max === undefined) {
                    max = parseInt(numberStr);
                    numberStr = "";
                }
            }
        }
    }

    return { min: min, max: max };
}

module.exports = extractPriceRanges;