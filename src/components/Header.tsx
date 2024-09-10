"use client";
import { AuthContext } from "@/app/AuthProvider";
import { updateProfile } from "firebase/auth";
import { useTheme } from "next-themes";
import React, { useContext, useEffect, useState } from "react";
import { create } from "zustand";
import { SettingToggle } from "./SettingToggle";
import { loadUserSettings, saveUserSettings } from "@/api/options";
import { set } from "firebase/database";
import getNickname from "@/api/getNickname";

export type exchangeState = {
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
};
// Define your store
export const useExchangeStore = create<exchangeState>((set) => ({
  exchangeRate: 1343.8,
  setExchangeRate: (rate: number) => set({ exchangeRate: rate }),
}));

export type optionsState = {
  isMaximized: boolean;
  doRenewal: boolean;
  setIsMaximized: (isMaximized: boolean) => void;
  setDoRenewal: (doRenewal: boolean) => void;
};

export const useOptionsStore = create<optionsState>((set) => ({
  isMaximized: false,
  doRenewal: true,
  setIsMaximized: (isMaximized: boolean) => set({ isMaximized }),
  setDoRenewal: (doRenewal: boolean) => set({ doRenewal: doRenewal }),
}));

export type nickNameStore = {
  nickname: string;
  setNickname: (nickname: string) => void;
};

export const nickNameState = create<nickNameStore>((set) => ({
  nickname: "익명의 사용자",
  setNickname: (nickname: string) => set({ nickname }),
}));

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isRotating, setIsRotating] = useState(false);
  const authContext = useContext(AuthContext);
  const { currentUser, pending } = authContext!;
  const [optionsVisible, setOptionsVisible] = useState(false);

  const handleClick = () => {
    setIsRotating(true);
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleAnimationEnd = () => {
    setIsRotating(false);
  };
  const exchangeRate = useExchangeStore((state) => state.exchangeRate);
  const setExchangeRate = useExchangeStore((state) => state.setExchangeRate);
  const isMaximized = useOptionsStore((state) => state.isMaximized);
  const setIsMaximized = useOptionsStore((state) => state.setIsMaximized);
  const doRenewal = useOptionsStore((state) => state.doRenewal);
  const setDoRenewal = useOptionsStore((state) => state.setDoRenewal);
  const { nickname, setNickname } = nickNameState();

  useEffect(() => {
    setNickname(authContext?.currentUser?.displayName || "익명의 사용자");
  }, [authContext?.currentUser?.displayName, pending]);

  // useEffect(() => {
  //   try{
  //     fetch(
  //       "https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD"
  //     )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setExchangeRate(data[0].basePrice);
  //     });
  //   }
  //   catch (error) {
  //     console.error("Error fetching exchange rate:", error);
  //   }
  // }, []);

  useEffect(() => {
    // 로그인한 사용자의 설정을 불러옵니다.
    if (currentUser) {
      loadUserSettings().then((settings) => {
        if (settings) {
          setIsMaximized(settings.isMaximized); // 불러온 설정을 적용합니다.
          setDoRenewal(settings.doRenewal);
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    // 사용자의 설정이 변경될 때마다 설정을 저장합니다.
    if (currentUser) {
      saveUserSettings({ isMaximized }); // 현재 설정을 저장합니다.
      saveUserSettings({ doRenewal: doRenewal });
    }
  }, [isMaximized, doRenewal]);

  useEffect(() => {
    // 클릭이 발생했을 때 실행할 함수
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsVisible &&
        event.target &&
        (event.target as HTMLElement).closest("#talk-settings") === null &&
        (event.target as HTMLElement).closest("#gear-icon") === null
      ) {
        setOptionsVisible(false);
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener("mousedown", handleClickOutside);

    // cleanup function
    return () => {
      // 컴포넌트 unmount 시에 이벤트 리스너 제거
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsVisible]); // `optionsVisible` 상태가 변경될 때마다 이 훅을 재실행

  // 닉네임 업데이트 함수
  const updateNickname = async () => {
    // getNickname()으로 랜덤 닉네임을 생성합니다.
    const newNickname = getNickname();

    // 사용자에게 생성된 닉네임을 보여주고, 변경하길 원하는 경우 입력하게 합니다.
    const userChosenNickname = prompt(
      "변경할 닉네임을 입력해주세요",
      await newNickname
    );

    if (userChosenNickname) {
      try {
        await updateProfile(authContext?.currentUser!, {
          displayName: userChosenNickname,
        });
        setNickname(userChosenNickname);
      } catch (error) {
        console.error("Error updating nickname:", error);
      }
    }
  };

  //옵션
  const toggleOptions = () => {
    setOptionsVisible(!optionsVisible);
  };
  return (
    <header className="inset-x-0 w-full p-2 border-b dark:border-neutral-700 sticky top-0 z-50 opacity-95 bg-white/75 dark:bg-gray-800/75">
      <div className="w-full max-w-screen-lg m-auto text-xs flex items-center justify-between">
        <span>
          환율(USD/KRW) <b>{exchangeRate}</b>
        </span>
        <div className="flex">
          <span
            className="text-sm text-primary cursor-pointer underline whitespace-nowrap overflow-ellipsis overflow-x-hidden mx-3"
            title="닉네임 변경하려면 클릭하세요"
            onClick={updateNickname}
          >
            {nickname}
          </span>
          <button
            onClick={handleClick}
            onAnimationEnd={handleAnimationEnd}
            className={`text-xl w-5 h-5 justify-center flex items-center bubble hover:bg-gray-200 hover:dark:bg-neutral-700 rounded-full p-2 ${
              isRotating ? "animate-rotate" : ""
            }`}
          >
            {theme === "dark" ? (
              <i className="fa-solid fa-sun"></i>
            ) : (
              <i className="fa-solid fa-moon"></i>
            )}
          </button>
          <button
            id="gear-icon"
            className="text-xl ml-4 w-5 h-5 justify-center flex items-center bubble hover:bg-gray-200 hover:dark:bg-neutral-700 rounded-full p-2"
            onClick={() => {
              toggleOptions();
            }}
          >
            <i
              className={`fa-solid fa-gear ${
                optionsVisible ? "animate-bounce" : ""
              }`}
            ></i>
          </button>
          {optionsVisible && (
            <ul
              id="talk-settings"
              className="flex flex-col space-y-2 lg:space-y-1 py-2 w-64 border border-general bg-gray-50 dark:bg-gray-800 text-sm absolute top-14 lg:top-16 right-3 z-50 rounded shadow-lg transform opacity-100 scale-100"
            >
              <li
                className="text-base text-primary cursor-pointer underline whitespace-nowrap overflow-ellipsis overflow-x-hidden mx-3 text-center mb-4"
                title="닉네임 변경하려면 클릭하세요"
                onClick={() => {
                  updateNickname();
                }}
              >
                {nickname}
              </li>
              {/* 설정 항목들 */}
              <SettingToggle
                icon="fas fa-expand-alt"
                text="채팅창 크게"
                value={isMaximized}
                onToggle={() => setIsMaximized(!isMaximized)}
              />
              <SettingToggle
                icon="fa-solid fa-arrows-rotate"
                text="최신데이터를 맨위로"
                value={doRenewal}
                onToggle={() => setDoRenewal(!doRenewal)}
              />
              {/* 항목추가는 아래에 */}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
