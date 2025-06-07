import { FaTachometerAlt, FaSwimmingPool, FaWallet, FaCog } from "react-icons/fa";

export default function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-border p-4 md:hidden">
      <div className="flex justify-around">
        <button className="flex flex-col items-center space-y-1 text-bitcoin">
          <FaTachometerAlt />
          <span className="text-xs">Dashboard</span>
        </button>
        <button className="flex flex-col items-center space-y-1 text-muted">
          <FaSwimmingPool />
          <span className="text-xs">Pools</span>
        </button>
        <button className="flex flex-col items-center space-y-1 text-muted">
          <FaWallet />
          <span className="text-xs">Wallet</span>
        </button>
        <button className="flex flex-col items-center space-y-1 text-muted">
          <FaCog />
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </div>
  );
}
