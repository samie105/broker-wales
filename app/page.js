import Script from "next/script";
import Home from "../components/main/Home";
export default function HomePage() {
  return (
    <>
      <Script
        src="//code.tidio.co/ustptruqq2il3oays0nqc4ri8a8aior7.js"
        strategy="afterInteractive"
        async
      ></Script>
      <Home />
    </>
  );
}
