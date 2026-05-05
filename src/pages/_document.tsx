import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>E-Nergy</title>
        <meta name="description" content="Your project description here" />
        <link rel="icon" href="/eNnergy Logo.png" />
        <link rel="apple-touch-icon" href="/eNnergy Logo.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
