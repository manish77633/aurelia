const text = "A [B](C) D [E](F) G";
const parts = text.split(/\[(.*?)\]\((.*?)\)/g);
console.log(parts);
