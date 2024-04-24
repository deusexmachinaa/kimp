import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  limit,
  startAfter,
  getDocs,
  QuerySnapshot,
} from "firebase/firestore";
import { auth } from "@/firebase/firebase";
import { Message } from "@/app/types";

const db = getFirestore();

export const sendMessage = async (messageText: string) => {
  // Ensure the user is logged in
  if (auth.currentUser) {
    await addDoc(collection(db, "messages"), {
      text: messageText,
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      createdAt: new Date(),
    });
  }
};

export const subscribeToMessages = (
  callback: (messages: Message[], lastVisible: Message | null) => void
) => {
  const messagesQuery = query(
    collection(db, "messages"),
    orderBy("createdAt", "desc"),
    limit(30)
  );

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      text: doc.data().text,
      uid: doc.data().uid,
      displayName: doc.data().displayName,
      createdAt: doc.data().createdAt.toDate(), // assuming createdAt is a Timestamp
    }));
    const lastVisible =
      messages.length > 0 ? messages[messages.length - 1] : null;
    callback(messages.reverse(), lastVisible);
  });
};

export const loadMoreMessages = async (lastVisible: Message | null) => {
  const messagesRef = collection(db, "messages");

  // 과거 메시지 로드: 마지막으로 보이는 메시지 이후에 있는 과거 메시지들을 불러옵니다.
  let messagesQuery = query(
    messagesRef,
    orderBy("createdAt", "desc"),
    limit(30)
  );

  if (lastVisible) {
    messagesQuery = query(
      messagesRef,
      orderBy("createdAt", "desc"),
      startAfter(lastVisible.createdAt),
      limit(30)
    );
  } else {
    return { moreMessages: [], newLastVisible: null };
  }

  const snapshot = await getDocs(messagesQuery);
  if (!snapshot.empty) {
    const newLastVisible = snapshot.docs[snapshot.docs.length - 1];
    const newLastVisibleMessage: Message = {
      // 새로운 `Message` 타입 객체 생성
      id: newLastVisible.id,
      text: newLastVisible.data().text,
      uid: newLastVisible.data().uid,
      displayName: newLastVisible.data().displayName,
      createdAt: newLastVisible.data().createdAt.toDate(),
    };
    const moreMessages = snapshot.docs.map((doc) => ({
      id: doc.id,
      text: doc.data().text,
      uid: doc.data().uid,
      displayName: doc.data().displayName,
      createdAt: doc.data().createdAt.toDate(),
    }));

    return {
      moreMessages: moreMessages.reverse(), // 배열을 뒤집어 과거에서 최신 순으로 메시지 표시
      newLastVisible: newLastVisibleMessage,
    };
  } else {
    return { moreMessages: [], newLastVisible: null };
  }
};
