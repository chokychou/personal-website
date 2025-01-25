import { Html, Head, Main, NextScript } from "next/document";
import { GoogleTagManager } from '@next/third-parties/google'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Yi Zhou's personal website, made in Project IDX."
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
      <GoogleTagManager gtmId="GTM-PCTSDD74" />
    </Html>
  );
}
