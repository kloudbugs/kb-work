import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import WebsiteLayout from "./WebsiteLayout";

export default function MiningSubscription() {
  const plans = [
    {
      name: "Free Trial",
      price: "0",
      period: "24 hours",
      description: "Experience the platform before committing",
      features: [
        "0.5 TH/s Mining Power",
        "Full Dashboard Access",
        "Community Support",
        "Cash Out 25% of Earnings After Sharing",
        "2% Civil Rights Fund Contribution",
        "No Credit Card Required"
      ],
      popular: false,
      ctaText: "Try For Free",
      ctaHref: "/trial-signup"
    },
    {
      name: "Starter",
      price: "199",
      period: "monthly",
      description: "Perfect for beginners to blockchain mining",
      features: [
        "2 TH/s Mining Power",
        "24/7 Mining Operation",
        "Basic Mining Dashboard",
        "Email Support",
        "Monthly Bitcoin Payouts",
        "5% Civil Rights Fund Contribution"
      ],
      popular: false,
      ctaText: "Start Mining",
      ctaHref: "/login"
    },
    {
      name: "Professional",
      price: "399",
      period: "monthly",
      description: "For serious miners supporting civil rights",
      features: [
        "5 TH/s Mining Power",
        "24/7 Mining Operation",
        "Advanced Mining Dashboard",
        "Priority Support",
        "Weekly Bitcoin Payouts",
        "Mining Pool Selection",
        "Performance Analytics",
        "10% Civil Rights Fund Contribution"
      ],
      popular: true,
      ctaText: "Join the Movement",
      ctaHref: "/login"
    },
    {
      name: "Enterprise",
      price: "799",
      period: "monthly",
      description: "Maximum impact for justice and returns",
      features: [
        "12 TH/s Mining Power",
        "24/7 Mining Operation",
        "Advanced Mining Dashboard",
        "Priority Support",
        "Daily Bitcoin Payouts",
        "Mining Pool Selection",
        "Advanced Analytics & Reports",
        "Dedicated Account Manager",
        "API Access",
        "15% Civil Rights Fund Contribution"
      ],
      popular: false,
      ctaText: "Lead the Change",
      ctaHref: "/login"
    }
  ];

  return (
    <WebsiteLayout>
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-500" style={{ 
              textShadow: '0 0 20px rgba(148, 85, 255, 0.8)',
              fontFamily: "'Orbitron', sans-serif" 
            }}>
              MINING SUBSCRIPTION
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 mx-auto rounded-full opacity-60 animate-pulse mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the perfect mining plan that aligns with your values and start earning while supporting civil rights initiatives through our advanced blockchain technology.
            </p>
            <p className="text-md text-purple-400 mt-3 italic">
              Hashing Power with Purpose: HEAR THE VOICE, FUND THE CHANGE, AND Heal The Soul
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`bg-gray-900 border-gray-800 text-white relative h-full flex flex-col ${
                  plan.popular ? "border-blue-500 shadow-lg shadow-blue-500/20" : ""
                } ${
                  plan.name === "Free Trial" ? "border-green-400 shadow-lg shadow-green-400/20" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 text-center">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {plan.name === "Free Trial" && (
                  <div className="absolute -top-4 left-0 right-0 text-center">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Risk Free
                    </span>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300" style={{ textShadow: '0 0 10px rgba(148, 85, 255, 0.6)' }}>${plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.name === "Free Trial" && (
                    <div className="mt-4 text-xs text-green-400 italic text-center">
                      Experience the power of our platform and its mission before committing. Join our movement with no risk.
                    </div>
                  )}
                </CardContent>
                
                <CardFooter>
                  <Link href={plan.ctaHref} className="w-full">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                          : plan.name === "Free Trial"
                            ? "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                            : "bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700"
                      }`}
                    >
                      {plan.name === "Free Trial" ? plan.ctaText : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Pay with Bitcoin
                        </span>
                      )}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Investment Guarantee Section */}
          <div className="mt-16 mb-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-xl p-8 shadow-lg shadow-blue-900/10">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-600/80 flex items-center justify-center mr-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300" style={{ 
                  textShadow: '0 0 10px rgba(148, 85, 255, 0.6)',
                  fontFamily: "'Orbitron', sans-serif" 
                }}>OUR INVESTMENT GUARANTEE</h3>
              </div>
              
              <p className="text-gray-200 text-lg mb-4 text-center">
                Through our proprietary blockchain mining architecture, we guarantee that your subscription will generate a <span className="text-green-400 font-bold">seven times (7x) return</span> on your initial investment.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-gray-900/60 p-6 rounded-lg border border-blue-500/20">
                  <h4 className="text-xl font-semibold mb-3 text-blue-300">Investment Returns</h4>
                  <p className="text-gray-300">
                    Our advanced mining algorithms and proprietary hardware configurations deliver industry-leading efficiency, guaranteeing subscribers a 7x return on their investment. This is not just a promise, but a cornerstone of our business model designed for sustainable growth.
                  </p>
                </div>
                
                <div className="bg-gray-900/60 p-6 rounded-lg border border-purple-500/20">
                  <h4 className="text-xl font-semibold mb-3 text-purple-300">Civil Rights Impact</h4>
                  <p className="text-gray-300">
                    One-third of all proceeds directly fund the TERA Token civil rights initiative, dedicated to fighting for justice and accountability in our legal system. Your investment becomes a powerful tool for change, generating both financial returns and meaningful social impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-20 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
            
            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">How does blockchain mining work?</h3>
                <p className="text-gray-300">
                  Our mining platform allows you to earn rewards without having to buy, set up, and maintain hardware yourself. 
                  Instead, you purchase computing capacity from our advanced data centers and we handle all the hardware and maintenance while you earn rewards and support civil rights initiatives.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">When will I receive my Bitcoin payouts?</h3>
                <p className="text-gray-300">
                  Payouts are made according to your subscription plan - daily, weekly, or monthly. 
                  The Bitcoin is sent directly to the wallet address you provide in your account settings, with a portion allocated to supporting civil rights initiatives.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">Can I upgrade my mining plan later?</h3>
                <p className="text-gray-300">
                  Yes, you can upgrade your blockchain mining plan at any time from your account dashboard. 
                  The new rate will be prorated for the remainder of your billing cycle, and your contribution to social justice initiatives will scale accordingly.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">Is there a minimum contract period?</h3>
                <p className="text-gray-300">
                  No, all our blockchain mining plans are month-to-month with no long-term commitment required. 
                  You can cancel at any time from your account dashboard while knowing your participation has already made a positive impact.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">How does my mining activity support civil rights?</h3>
                <p className="text-gray-300">
                  A portion of all mining proceeds is directed to the TERA Fund (named after Tera Ann Harris), which supports legal initiatives focused on accountability in the criminal justice system. Your mining activity directly powers our ability to drive meaningful change.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-teal-300">How does the free trial work?</h3>
                <p className="text-gray-300">
                  Our 24-hour free trial gives you full access to our platform with actual mining power. To demonstrate real value, you'll be able to cash out 25% of your earnings after sharing our platform on social media. This helps spread our civil rights mission while letting you experience the complete payment process. No credit card is required, and you can upgrade to a paid plan at any time to unlock full earning potential.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">How does the 7x investment guarantee work?</h3>
                <p className="text-gray-300">
                  Our proprietary mining algorithms and advanced hardware infrastructure ensure exceptional efficiency. This allows us to guarantee that subscribers will receive a total return equal to seven times their initial investment over the course of their subscription. For example, a $199 subscription will generate approximately $1,393 in total mining rewards. This guarantee is built into our business model, reflecting our commitment to both financial returns and social impact through the one-third allocation to the TERA Token civil rights fund.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">Why do you only accept Bitcoin payments?</h3>
                <p className="text-gray-300">
                  As a platform dedicated to blockchain technology, we believe in practicing what we preach. By accepting only Bitcoin payments, we eliminate traditional payment processors and their associated fees, allowing us to maximize the resources allocated to both our mining operations and civil rights initiatives. This approach also provides an additional layer of security and privacy for our users, aligning with our commitment to technological innovation and financial autonomy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-500" style={{ 
            textShadow: '0 0 20px rgba(148, 85, 255, 0.8)',
            fontFamily: "'Orbitron', sans-serif" 
          }}>
            JOIN THE BLOCKCHAIN JUSTICE MOVEMENT
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 mx-auto rounded-full opacity-60 animate-pulse mb-6"></div>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of passionate supporters who are earning rewards while powering social change through our blockchain mining platform.
          </p>
          <p className="text-md text-purple-400 mt-3 italic mb-8">
            Hashing Power with Purpose: HEAR THE VOICE, FUND THE CHANGE, AND Heal The Soul
          </p>
          <div className="flex flex-col items-center space-y-4">
            <Link href="/bitcoin-invoice">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 px-8 py-6 text-lg font-bold shadow-lg shadow-orange-700/30">
                <span className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 8h6m-6 4h6m-6 4h6M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.057 5.092a8.962 8.962 0 0 1 2.852 2.851M5.09 14.057a8.962 8.962 0 0 0 2.852 2.851" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Pay with Bitcoin & Start Mining
                </span>
              </Button>
            </Link>
            
            {/* Admin Login Link */}
            <div className="mt-4">
              <Link href="/auth" className="text-gray-500 hover:text-blue-400 text-sm transition-colors duration-300 flex items-center">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Admin Configuration Access</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
}