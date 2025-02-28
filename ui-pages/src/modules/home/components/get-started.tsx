import Image from 'next/image';
import { Footer } from './footer';

export const GetStarted = () => {
  return (
    <div className="h-screen flex flex-col gap-y-12 text-white/80 text-[15px] pt-28">
      <h1 className="pl-28 text-5xl font-[family-name:var(--font-eb-garamond)]">Join an Auction in Two Steps</h1>
      <div className="relative flex flex-col items-center justify-center h-[75%] py-10 gap-y-7">
        <Image src="/cover.jpg" alt="Cover" layout="fill" objectFit="cover" objectPosition="center" className="z-0" priority />
        <div className="flex w-[1000px] h-full max-h-[500px] relative z-10">
          <div className="flex flex-col justify-between w-[55%] h-full">
            <div className="flex gap-x-4">
              <div className="py-2 text-3xl font-[family-name:var(--font-eb-garamond)]">1.</div>
              <div className="border-s px-4 py-2 space-y-4 w-[70%]">
                <h2 className="text-3xl font-[family-name:var(--font-eb-garamond)]">Verify Compliance Privately</h2>
                <div className="leading-[22px]">
                  <p>
                    Connect your wallet and submit your certificate hash. Zero-knowledge proofs ensure compliance, privacy, and
                    security.
                  </p>
                  <p>Your certificate hash is validated without collecting any private information.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-x-4">
              <div className="py-2 text-3xl font-[family-name:var(--font-eb-garamond)]">2.</div>
              <div className="border-s px-4 py-2 space-y-4 w-[75%]">
                <h2 className="text-3xl font-[family-name:var(--font-eb-garamond)]">Bid with ZK Privacy</h2>
                <div className="leading-[22px]">
                  <p>Once your certificate is verified, you can securely participate in auctions and place bids.</p>
                  <p>
                    Zero-knowledge proofs ensure your compliance without exposing any personal data, allowing for a fully private and fair
                    bidding process.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center h-full w-[45%]">
            <div className="px-4 py-2 space-y-4 border-s">
              <h2 className="text-3xl font-[family-name:var(--font-eb-garamond)]">Eligibility Requirements:</h2>
              <ul className="flex flex-col gap-y-5">
                {[
                  { label: 'Age Requirement:', value: 'Must be 18 years or older.' },
                  { label: 'AML Compliance:', value: 'Adherence to Anti-Money Laundering regulations.' },
                  { label: 'Proof of ownership:', value: 'Verification of certification provenance.' },
                  { label: 'Jurisdiction Compliance:', value: 'Must not reside in sanctioned countries.' },
                ].map((requirement, index) => (
                  <div className="flex gap-x-3" key={index}>
                    <div className="py-2">
                      <Image src="/check.svg" alt="check" width={12} height={12} />
                    </div>
                    <div className="flex flex-col">
                      <span>{requirement.label}</span>
                      <span>{requirement.value}</span>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* <Button className="w-[200px] rounded-[4px] font-normal bg-gradient-to-r from-[#D26608] to-[#D28C13] hover:from-[#E07318] hover:to-[#E29E35] transition-all">
          Register now
      </Button> */}
      </div>
      <Footer />
    </div>
  );
};
