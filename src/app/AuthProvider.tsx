"use client";
import React, { useEffect, useState, createContext } from "react";
import {
  User,
  onAuthStateChanged,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";
import {
  getDatabase,
  onValue,
  ref,
  set,
  serverTimestamp,
  onDisconnect,
  DatabaseReference,
} from "firebase/database";
import { auth } from "@/firebase/firebase";
import getNickname from "@/api/getNickname";

interface AuthContextType {
  currentUser: User | null;
  userCount: number | null;
  pending?: boolean;
}

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [pending, setPending] = useState(true);

  // Firebase Realtime Database 초기화
  const database = getDatabase();

  useEffect(() => {
    const userCountRef = ref(database, "status");
    onValue(userCountRef, (snapshot) => {
      let count = 0;
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.val().state === "online") {
          count++;
        }
      });
      setUserCount(count);
    });
  }, []);

  useEffect(() => {
    signInAnonymously(auth)
      .then((credential) => {
        if (credential.user && !credential.user.displayName) {
          (getNickname() ?? Promise.resolve("익명의 사용자"))
            .then((randomNickname) => {
              return updateProfile(credential.user, {
                displayName: randomNickname,
              });
            })
            .catch((error) => {
              console.error("Error updating user profile:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error during sign in:", error);
      });

    let userStatusDatabaseRef: DatabaseReference;
    const isOfflineForDatabase = {
      state: "offline",
      last_changed: serverTimestamp(),
    };

    const isOnlineForDatabase = {
      state: "online",
      last_changed: serverTimestamp(),
    };

    if (currentUser?.uid) {
      userStatusDatabaseRef = ref(database, "status/" + currentUser.uid);
      onValue(ref(database, ".info/connected"), (snapshot) => {
        if (snapshot.val() === false) {
          set(userStatusDatabaseRef, isOfflineForDatabase);
          return;
        }
        onDisconnect(userStatusDatabaseRef)
          .set(isOfflineForDatabase)
          .then(function () {
            set(userStatusDatabaseRef, isOnlineForDatabase);
          });
      });
    }

    return onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setPending(false);
    });
  }, [currentUser?.uid]);

  //   if (pending) {
  //     return <>Loading...</>;
  //   }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userCount,
        pending: pending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
