import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="flex h-16 justify-center pb-10">
      <div className="flex justify-center items-center  w-fit gap-x-12 text-white/70">
        <div className=" flex items-center gap-x-3">
          <Image
            src="/sample-logo-light.svg"
            alt="Midnight Auctions"
            width={22}
            height={22}
          />
          <h1 className=" text-sm font-[family-name:var(--font-eb-garamond)]">
            MIDNIGHT AUCTIONS
          </h1>
        </div>
        <div className="flex items-center gap-x-2">
          <span>This is a prototype by</span>
          <Link href="https://www.eddalabs.io">
            <Image
              src="/edda-logo.svg"
              alt="Edda Labs"
              width={50}
              height={50}
            />
          </Link>
          <span>, powered by</span>
          <Link href="https://meshjs.dev/">
            <Image
              src="/mesh-sdk-logo.svg"
              alt="Mesh.js"
              width={100}
              height={100}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
