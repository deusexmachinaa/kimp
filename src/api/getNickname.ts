"use server";
export default async function getNickname() {
  try {
    const res = await fetch("https://nickname.hwanmoo.kr/?format=text&count=1", {
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      // HTTP 에러 상태일 경우 기본 이름 반환
      throw new Error("Failed to fetch nickname");
    }

    const nickname = await res.text();
    return nickname;
  } catch (error) {
    // 에러 발생 시 기본 이름 반환
    return "익명";
  }
}
