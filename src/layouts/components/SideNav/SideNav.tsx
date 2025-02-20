import { Link } from 'react-router-dom';


const SideNav = () => {
    const listNav = [
        {
            name: 'Dashboard',
            to: '/',
        },
        {
            name: 'Tweets',
            to: '/tweets',
        },
        {
            name: 'TweetEthers',
            to: '/tweetEthers',
        },
    ];


    return (
        <div className="flex flex-col justify-between bg-black h-full">
            <div>
                <div>
                    {listNav.map((item, index) => (
                        <Link
                            key={index}
                            to={item.to}
                            className="group mb-[10px] flex items-center justify-start text-white hover:text-colorGreenText py-2 px-3"
                        >
                            <div className="text-current h-[100%] pt-[3px] font-semibold ml-3">{item.name}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SideNav;
