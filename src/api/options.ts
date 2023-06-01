import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { auth } from "@/firebase/firebase";

const db = getFirestore();

// 사용자 설정을 데이터베이스에 저장하는 함수
export const saveUserSettings = async (settings: any) => {
  // 사용자가 로그인한 경우에만
  if (auth.currentUser) {
    await updateDoc(
      doc(collection(db, "settings"), auth.currentUser.uid),
      settings
    );
  }
};

// 데이터베이스에서 사용자 설정을 로드하는 함수
export const loadUserSettings = async () => {
  let settings = null;

  // 사용자가 로그인한 경우에만
  if (auth.currentUser) {
    const settingsDoc = await getDoc(
      doc(collection(db, "settings"), auth.currentUser.uid)
    );
    if (settingsDoc.exists()) {
      settings = settingsDoc.data();
    }
  }

  return settings;
};
