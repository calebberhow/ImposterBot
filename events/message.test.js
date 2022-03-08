const scramble = require('./message.js').scramble
const lettersToNum = require('./message.js').lettersToNum


test("scramble()", ()=>{
    phrase = 'hello'
    // Needs many tests to ensure all random edge cases are covered
    for (let i = 0; i < 500; i++) {
        scrambled_word = scramble(phrase)
        expect(scrambled_word.length).toBe(phrase.length)
        expect(scrambled_word).not.toBe(phrase)
    }
});

test("lettersToNum()", () =>{
    phrase = 'one two three four five six seven eight nine zero'
    res = lettersToNum(phrase)
    expect(res).toBe('1234567890')

    phrase = 'zero zero zero three nine zero'
    res = lettersToNum(phrase)
    expect(res).toBe('000390')
});
