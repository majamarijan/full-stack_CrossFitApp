// answer from https://stackoverflow.com/questions/38542736/understanding-calculations-in-js-using-bitwise-and-or-and-hex-numbers
// r & 0x3 nullifies everything except for two latter bits (since 3 is binary 11). So, r & 0x3 == 00cd.

// | 0x8 sets the first bit (since 8 is binary 1000). So, r & 0x3 | 0x8 == 10cd.

// As a result, the whole expression r & 0x3 | 0x8 takes two least significant bits of r and appends them to binary 10. Before this operation we could have any number from 0x0 to 0xf, but after it only four variants are possible: 0x8 (binary 1000), 0x9 (binary 1001), 0xa (binary 1010) or 0xb (binary 1011).


// replace method(first arg is regex and second arg is function that get x || y as parametar and replace with the binarys)
export default function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g , function(c) {
    var rnd = Math.random()*16 |0, v = c === 'x' ? rnd : (rnd&0x3|0x8);
    return v.toString(16);
  })
}

