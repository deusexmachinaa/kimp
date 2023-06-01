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
  callback: (messages: Message[]) => void
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
    callback(messages);
  });
};

export const loadMoreMessages = async (lastVisible: Message | null) => {
  const messagesRef = collection(db, "messages");
  let messagesQuery;

  if (lastVisible) {
    messagesQuery = query(
      messagesRef,
      orderBy("createdAt", "asc"),
      startAfter(lastVisible.createdAt),
      limit(30)
    );
  } else {
    messagesQuery = query(messagesRef, orderBy("createdAt", "asc"), limit(30));
  }

  const snapshot = await getDocs(messagesQuery);
  const newLastVisible = snapshot.docs[snapshot.docs.length - 1];
  const moreMessages = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      text: data.text,
      uid: data.uid,
      displayName: data.displayName,
      createdAt: data.createdAt.toDate(),
    } as Message;
  });

  return {
    moreMessages,
    newLastVisible: moreMessages[moreMessages.length - 1],
  };
};
