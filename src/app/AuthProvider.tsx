"use client";
import React, { useEffect, useState, createContext } from "react";
import {
  User,
  onAuthStateChanged,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import getNickname from "@/api/getNickname";

interface AuthContextType {
  currentUser: User | null;
}

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    signInAnonymously(auth)
      .then((credential) => {
        if (credential.user && !credential.user.displayName) {
          // 외부 API에서 닉네임 가져오기
          getNickname()
            .then((randomNickname) => {
              // Firebase 사용자 프로필에 랜덤 닉네임 설정
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

    return onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setPending(false);
    });
  }, []);

  if (pending) {
    return <>Loading...</>;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
