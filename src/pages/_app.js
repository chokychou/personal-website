import "@/styles/globals.css";
import { Head } from "next/document";

export default function App({ Component, pageProps }) {
  return
  <>
    <Head>
      <title>Yi Zhou</title>
      <meta
        name="description"
        content="Yi Zhou's personal website, made in Project IDX."
      />
    </Head>
    <Component {...pageProps} />;
  </>
}
