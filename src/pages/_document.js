import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Yi Zhou</title>
        <meta
          name="description"
          content="Yi Zhou's personal website, made in Project IDX."
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-M89DENS5RE"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-M89DENS5RE');
            `,
          }}
        />
      </body>
    </Html>
  );
}
