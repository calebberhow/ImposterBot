const scramble = require('./message.js').scramble
const lettersToNum = require('./message.js').lettersToNum


test("scramble()", ()=>{
    word = 'hello'
    scrambled_word = scramble(word)
    expect(scrambled_word.length == word.length).toBe(true)
    expect(scrambled_word == word).toBe(false)
});

test("lettersToNum()", () =>{
    phrase = 'one two three four five six seven eight nine zero'
    res = lettersToNum(phrase)
    expect(res).toBe('1234567890')

    phrase = 'zero zero zero three nine zero'
    res = lettersToNum(phrase)
    expect(res).toBe('000390')
});
