export default function Footer() {
  return (
    <footer className="relative bottom-0 w-full h-40 mt-10 bg-gray-200 dark:bg-neutral-800">
      <div className="max-w-screen-lg p-5 m-auto text-xs sm:text-sm">
        <p className="whitespace-pre-line">
          제공하는 정보는 투자에 대한 조언이 아닙니다.
          <br />
          투자에 대한 책임은 전적으로 본인에게 있습니다.
        </p>
        <div className="mt-5">
          문의
          <a
            className="ml-2 font-bold"
            target="_blank"
            rel="noreferrer"
            href="http://t.me/kimp_site"
          >
            http://t.me/kimp_site
          </a>
        </div>
      </div>
    </footer>
  );
}
