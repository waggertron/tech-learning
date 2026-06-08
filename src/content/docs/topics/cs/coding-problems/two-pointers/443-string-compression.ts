function compress(chars: string[]): number {
    return 0;
}

const chars1 = ['a', 'a', 'b', 'b', 'c', 'c', 'c'];
const n1 = compress(chars1);
console.log(n1, chars1.slice(0, n1));  // 6 ['a','2','b','2','c','3']

const chars2 = ['a'];
console.log(compress(chars2));  // 1

const chars3 = Array.from('abbbbbbbbbbbbb');
const n3 = compress(chars3);
console.log(n3, chars3.slice(0, n3));  // 4 ['a','b','1','2']
