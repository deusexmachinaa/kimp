"use server";
export default async function getNickname() {
  const res = await fetch("https://nickname.hwanmoo.kr/?format=text&count=1", {
    next: { revalidate: 0 },
  });
  const nickname = await res.text();
  return nickname;
}
