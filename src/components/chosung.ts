export default function getChosungs(word: string) {
  const cho = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  let chosungs = "";
  for (let i = 0; i < word.length; i++) {
    let char = word[i];
    let code = char.charCodeAt(0) - 44032;
    if (code > -1 && code < 11172) {
      chosungs += cho[Math.floor(code / 588)];
    } else {
      chosungs += char;
    }
  }
  return chosungs;
}
