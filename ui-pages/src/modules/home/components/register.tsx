import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Footer } from "./footer";

export const Register = () => {
  return (
    <div className="h-screen flex flex-col gap-y-12 text-white/80 text-[15px] pt-28">
      <h1 className="pl-28 text-5xl font-[family-name:var(--font-eb-garamond)]">
        Get started in 2 steps
      </h1>
      <div className="relative bg-[url('/cover.jpg')] bg-cover bg-center bg-no-repeat flex flex-col  items-center justify-center  h-[75%] py-10 gap-y-7  ">
      {/* <div className="absolute z-10 inset-0 bg-black opacity-40"></div> */}
        <div className="flex w-[1000px] h-full max-h-[500px]">
          <div className="flex flex-col justify-between w-[55%] h-full">
            <div className="flex gap-x-4">
              <div className="py-2 text-3xl font-[family-name:var(--font-eb-garamond)]">
                1.
              </div>
              <div className="border-s px-4 py-2 space-y-4 w-[70%]">
                <h2 className="text-3xl font-[family-name:var(--font-eb-garamond)]">
                  Verify Compliance Privately
                </h2>
                <div className="leading-[22px]">
                  <p>
                    Connect your wallet and submit your certificate hash. Your compliance will be automatically
                    enforced through zero-knowledge proofs, ensuring privacy and
                    security.
                  </p>
                  <p>
                    We will validate your Certificate hash without collecting any
                    private information.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-x-4">
              <div className="py-2 text-3xl font-[family-name:var(--font-eb-garamond)]">
                2.
              </div>
              <div className="border-s px-4 py-2 space-y-4 w-[75%]">
                <h2 className="text-3xl font-[family-name:var(--font-eb-garamond)]">
                  Bid with ZK Privacy
                </h2>
                <div className="leading-[22px] ">
                  <p>
                    Once your certificate is verified, you can participate in
                    auctions.
                  </p>
                  {/* <p>
                    Before every bid, your compliance will be automatically
                    enforced through zero-knowledge proofs, ensuring privacy and
                    security.
                  </p> */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center h-full w-[45%]">
            <div className="px-4 py-2 space-y-4 border-s">
              <h2 className="text-3xl font-[family-name:var(--font-eb-garamond)]">
                Eligibility Requirements:
              </h2>
              <ul className="flex flex-col gap-y-6">
                <div className="flex gap-x-3">
                  <div className="py-2">
                    <Image src="check.svg" alt="check" width={12} height={12} />
                  </div>
                  <div className="flex flex-col">
                    <span>Age Requirement:</span>
                    <span>Must be 18 years or older.</span>
                  </div>
                </div>
                <div className="flex gap-x-3">
                  <div className="py-2">
                    <Image src="check.svg" alt="check" width={12} height={12} />
                  </div>
                  <div className="flex flex-col">
                    <span>AML Compliance:</span>
                    <span>Adherence to Anti-Money Laundering regulations.</span>
                  </div>
                </div>
                <div className="flex gap-x-3">
                  <div className="py-2">
                    <Image src="check.svg" alt="check" width={12} height={12} />
                  </div>
                  <div className="flex flex-col">
                    <span>Proof of ownership:</span>
                    <span>Verification of certification provenance.</span>
                  </div>
                </div>
                <div className="flex gap-x-3">
                  <div className="py-2">
                    <Image src="check.svg" alt="check" width={12} height={12} />
                  </div>
                  <div className="flex flex-col">
                    <span>Jurisdiction Compliance:</span>
                    <span>Must not reside in sanctioned countries.</span>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
        <Button className="w-[200px] rounded-[4px] font-normal bg-gradient-to-r from-[#D26608] to-[#D28C13] hover:from-[#E07318] hover:to-[#E29E35] transition-all">
            Register now
        </Button>
      </div>
      <Footer />
    </div>
  );
};
