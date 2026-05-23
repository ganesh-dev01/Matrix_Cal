import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Fonts — Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* SEO */}
        <meta name="description" content="MatrixCalc — A powerful, beautiful matrix calculator. Generate matrices and perform addition, subtraction, and multiplication with ease." />
        <meta name="theme-color" content="#080818" />
        <meta property="og:title" content="MatrixCalc — Matrix Calculator" />
        <meta property="og:description" content="Generate and compute matrices with a beautiful, responsive UI." />
        <meta property="og:type" content="website" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
