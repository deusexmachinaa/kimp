# KIMP (Kimchi Premium Monitoring Program)

KIMP is a web application designed to monitor the Kimchi Premium in real-time. The term "Kimchi Premium" refers to the gap in cryptocurrency prices on South Korean exchanges compared to foreign exchanges. You can check out the live application [here](https://kimp-omega.vercel.app).

## Technology Stack
This project is built using the following technologies:

- **Next.js**: A JavaScript framework that enables functionalities such as server-side rendering and generating static websites for React based web applications.

- **TypeScript**: A statically typed superset of JavaScript that adds optional types to the language. TypeScript is designed for the development of large applications and transcompiles to JavaScript.

- **Firebase**: A platform developed by Google for creating mobile and web applications. It was originally an independent company founded in 2011. In 2014, Google acquired the platform and it is now their flagship offering for app development.

- **WebSockets**: A communication protocol that provides full-duplex communication between the client and server over a single, long-lived connection. This is used to enable real-time updates in the application.

- **Vercel**: A cloud platform for static sites and Serverless Functions that fits perfectly with Next.js projects.

## Getting Started
To get a local copy up and running, follow these steps:
(I mainly used PNPM)

1. Clone the repository:
```
git clone https://github.com/deusexmachinaa/kimp.git
```

2. Install NPM packages:
```
pnpm install
```

3. Run the development server:
```
pnpm dev
```

Then open http://localhost:3000 with your browser to see the result. You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses `next/font` to automatically optimize and load Inter, a custom Google Font.


## Deployment
This application is deployed using the Vercel Platform. Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contact
For any questions or feedback, please reach out to me at [gjfzml@gmail.com].


----

김프 프로젝트는 Next.js를 기반으로 하며, TypeScript로 작성되었습니다.

이 프로젝트는 실시간 정보를 표시하기 위해 Firebase를 활용하고 있습니다.


현재는 업비트krw 와 바이낸스의 정보만 지원합니다.:

restapi 로 초기 데이터를 받아오고, 웹소켓을 통해 실시간으로 정보를 갱신합니다.


채팅 및 유저별 기능 구현을 위해 Firebase 기능들이 이용되었습니다:

Firebase의 Firestore 데이터베이스를 사용하여 메시지를 저장하고 가져옵니다.

Firebase의 Auth 서비스를 사용하여 사용자 인증을 처리합니다. (anon)

메시지를 보내고 받을 때 Firestore의 쿼리 기능을 이용합니다.

또한, 이 프로젝트에서는 특정 URL에서 닉네임을 가져오는 기능도 제공합니다. (랜덤 닉네임 생성)

이 프로젝트는 Vercel 플랫폼에서 호스팅됩니다.
