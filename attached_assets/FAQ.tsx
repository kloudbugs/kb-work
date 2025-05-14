import { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
}

export function FAQ() {
  const faqs: FAQItem[] = [
    {
      question: "What is KLOUD BUGS?",
      answer: "KLOUD BUGS is a community-driven meme cryptocurrency inspired by coffee culture that combines the fun and virality of meme culture with actual utility in the crypto space. Unlike many meme tokens, KLOUD BUGS has a clear roadmap, active development, and features like staking, NFTs, and cross-chain compatibility."
    },
    {
      question: "How do I buy KLOUD BUGS tokens?",
      answer: (
        <>
          <p className="text-lightgray">
            You can buy KLOUD BUGS tokens on decentralized exchanges like Uniswap, PancakeSwap, or centralized exchanges where it's listed. The process generally involves:
          </p>
          <ol className="list-decimal ml-5 mt-2 space-y-1 text-lightgray">
            <li>Setting up a crypto wallet (like MetaMask)</li>
            <li>Adding ETH, BNB, or SOL to your wallet</li>
            <li>Connecting your wallet to the exchange</li>
            <li>Swapping your coins for KLOUD BUGS</li>
          </ol>
          <p className="text-lightgray mt-2">
            We have detailed guides for each platform in our documentation section.
          </p>
        </>
      )
    },
    {
      question: "Is KLOUD BUGS safe and audited?",
      answer: "Yes, KLOUD BUGS's smart contract has been audited by CertiK and Hacken, two of the leading blockchain security firms. Additionally, our liquidity is locked for 5 years to ensure stability and security for all holders. You can view our audit reports on our documentation page."
    },
    {
      question: "How does staking work with KLOUD BUGS?",
      answer: "KLOUD BUGS offers a staking platform where token holders can lock their tokens for varying periods (30, 60, 90, or 180 days) to earn additional rewards. The longer you stake, the higher your APY. Staking not only provides passive income but also helps stabilize the token price by reducing circulating supply."
    },
    {
      question: "How can I participate in the KLOUD BUGS community?",
      answer: (
        <>
          <p className="text-lightgray">
            There are many ways to get involved with KLOUD BUGS:
          </p>
          <ul className="list-disc ml-5 mt-2 space-y-1 text-lightgray">
            <li>Join our Telegram, Discord, and Twitter communities</li>
            <li>Participate in governance votes to influence project direction</li>
            <li>Contribute to community initiatives and earn rewards</li>
            <li>Create and share memes about KLOUD BUGS</li>
            <li>Help with translations or documentation if you have the skills</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white" id="faq">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 text-dark">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lightgray max-w-2xl mx-auto">
            Everything you need to know about KLOUD BUGS
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="mb-4 border border-gray-200 rounded-lg px-4">
                <AccordionTrigger className="text-left font-heading font-semibold py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-lightgray">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
