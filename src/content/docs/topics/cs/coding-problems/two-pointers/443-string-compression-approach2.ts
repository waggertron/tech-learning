function compress(chars: string[]): number {
    let write = 0;
    let i = 0;
    while (i < chars.length) {
        const char = chars[i];
        let count = 0;
        while (i < chars.length && chars[i] === char) {
            count++;
            i++;
        }
        chars[write++] = char;
        if (count > 1) {
            for (const digit of String(count)) {
                chars[write++] = digit;
            }
        }
    }
    return write;
}

const chars1 = ['a', 'a', 'b', 'b', 'c', 'c', 'c'];
const n1 = compress(chars1);
console.log(n1, chars1.slice(0, n1));  // 6 ['a','2','b','2','c','3']
