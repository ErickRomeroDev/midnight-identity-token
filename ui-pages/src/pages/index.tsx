import Head from 'next/head';
import { Hero } from '@/modules/home/components/hero';
import { Register } from '@/modules/home/components/register';

const Page = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-[calc(100vh-70px)] font-[family-name:var(--font-ibm-plex-sans)]">
        <div className="h-full mt-[70px] overflow-y-scroll">
          <Hero />
          <Register />
        </div>
      </main>
    </>
  );
};

export default Page;
