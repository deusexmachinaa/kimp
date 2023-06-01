import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
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
    orderBy("createdAt", "asc")
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
