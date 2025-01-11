import { Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
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
