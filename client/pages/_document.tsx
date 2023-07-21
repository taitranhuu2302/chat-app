import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href="/logo.svg" />
        </Head>
        <body
          id={'body'}
          className="bg-light dark:bg-via-100 text-light-1100 dark:text-night-1100">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
