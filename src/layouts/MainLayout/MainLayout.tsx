import { ConnectButton } from '@rainbow-me/rainbowkit';
import SideNav from '../components/SideNav';
import { Outlet } from 'react-router-dom';
import { useAccount } from 'wagmi';

const MainLayout = () => {
    const { address } = useAccount();
    
  return (
    <main className="min-h-screen w-full flex overflow-auto">
    <div className="w-[280px] p-[25px] bg-black min-h-full fixed top-0 left-0 bottom-0">
        <SideNav />
    </div>
    <div className={`bg-white w-full text-black p-4 rounded min-w-[1200px] min-h-[200px] flex items-center flex-col justify-center`}>
      <div>
        <ConnectButton  showBalance={false}/>
      </div>
      <Outlet />
    </div>
</main>
  );
}

export default MainLayout;
