"use client";
import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Sheeet from "./sheeet";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Link from "next/link";
import axios from "axios";
import { useUserData } from "../../contexts/userrContext";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { useTheme } from "../../contexts/themeContext";
import { ScrollArea } from "../ui/scroll-area";

export default function Nav() {
  const router = useRouter();
  const { isDarkMode, baseColor, toggleTheme } = useTheme();
  const { coinPrices, setCoinPrices } = useUserData();
  const [loading, isloading] = useState(false);
  const { details, email, setDetails } = useUserData();
  const deposits = [
    {
      coinName: "Bitcoin",
      short: "Bitcoin",
      image: "/assets/bitcoin.webp",
      address: "0xiohxhihfojdokhijkhnofwefodsdhfodhod",
    },
    {
      coinName: "Ethereum",
      short: "Ethereum",
      image: "/assets/ethereum.webp",
      address: "0xiohxhihfojhijkhnowefodsdhfodhod",
    },
    {
      coinName: "Tether USDT",
      short: "Tether",
      image: "/assets/Tether.webp",
      address: "0Xxiohxhihfookhijkhnofwefodsdhfodhod",
    },
  ];
  const handleReadNotif = async () => {
    if (!details.isReadNotifications) {
      try {
        // Send a POST request to mark notifications as read
        const response = await axios.post(`/notifs/readNotifs/api`, { email });

        if (response.status === 200) {
          // Notifications marked as read successfully
          // Now, you can update the user's details to set isReadNotifications to true
          setDetails((prevDetails) => ({
            ...prevDetails,
            isReadNotifications: true,
          }));
        } else {
          // Handle any errors or display an error message to the user
          console.error("Failed to mark notifications as read:", response.data);
        }
      } catch (error) {
        // Handle network errors or other unexpected errors
        console.error("Error marking notifications as read:", error);
      }
    }
  };
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (details.notifications && details.notifications.length > 0) {
      setNotifications(details.notifications);
    }
  }, [details]);

  // ...

  const formatRelativeTime = (dateString) => {
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Calculate the relative time to now
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Map over notifications and format the date as relative time for each
  const formattedNotifications = notifications
    ? notifications.map((notification) => ({
        ...notification,
        date: formatRelativeTime(notification.date), // Format as relative time
      }))
    : [];
  const sortedNotifications = formattedNotifications.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // Compare dates in descending order (newest first)
  });

  const handleNotificationClick = (id) => {
    isloading(true);
    // Send a DELETE request to the backend API to delete the notification
    axios
      .delete(`/notifs/deleteNotifs/api/${id}/${email}`)
      .then((response) => {
        if (response.status === 200) {
          const updatedNotifications = notifications.filter(
            (notification) => notification.id !== id
          );
          setNotifications(updatedNotifications);
          isloading(false);
        } else {
          // Handle any errors or display an error message to the user
          console.error("Failed to delete notification:", response.data);
          isloading(false);
        }
      })
      .catch((error) => {
        // Handle network errors or other unexpected errors
        console.error("Error deleting notification:", error);
        isloading(false);
      });
  };
  useEffect(() => {
    const fetchCoinPrices = async () => {
      try {
        // Create an array of coin symbols for API request
        const coinSymbols = deposits.map((coin) => coin.short.toLowerCase());

        // API request to fetch coin prices
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinSymbols.join(
            ","
          )}&vs_currencies=usd`
        );

        // Update coinPrices state with fetched prices
        setCoinPrices(response.data);
      } catch (error) {
        console.error("Error fetching coin prices:", error);
      }
    };

    fetchCoinPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    // Remove the "token" cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to the logout page or any other desired action
    router.replace("/auth"); // Replace "/logout" with your actual logout route
  };

  return (
    <>
      <div
        className={`nav-container flex justify-between ${
          isDarkMode
            ? `${baseColor} text-white border border-white/5`
            : "text-slate-900 border-b bg-white"
        } duration-300  items-center py-3 px-5 transition-colors  `}
      >
        <div className="burger md:hidden cursor-pointer">
          <Sheet className="p-0">
            <SheetTrigger>
              <div className="burger-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </SheetTrigger>
            <SheetContent
              side="left"
              className={`px-4 ${
                isDarkMode ? `${baseColor} text-gray-200 border-0` : ""
              }`}
            >
              <Sheeet />
            </SheetContent>
          </Sheet>
        </div>
        <div className="title hidden md:flex">
          <h2 className="font-bold">
            <svg
              width="191"
              height="60"
              viewBox="0 0 191 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* <path
                d="M125 35L99.3943 45.6787C97.271 46.5596 95.4879 47 94.0451 47C92.4117 47 91.2271 46.4396 90.4911 45.3188C90.0293 44.5989 89.8932 43.6856 90.0828 42.5791C90.2733 41.4726 90.7769 40.2927 91.5936 39.0395C92.2742 38.0254 93.3908 36.6922 94.9434 35.04C94.4161 35.852 94.0298 36.744 93.8001 37.6797C93.3918 39.3861 93.7593 40.6393 94.9026 41.4392C95.4471 41.8125 96.1957 41.9992 97.1485 41.9992C97.9097 41.9992 98.7672 41.8792 99.721 41.6392L125 35Z"
                fill="#0052FF"
              /> */}
              <path
                d="M0.0227273 43V19.7273H4.94318V29.3295H14.9318V19.7273H19.8409V43H14.9318V33.3864H4.94318V43H0.0227273ZM23.8977 43V19.7273H39.3068V23.7841H28.8182V29.3295H38.2841V33.3864H28.8182V43H23.8977Z"
                fill={` ${isDarkMode ? "white" : "#111"}`}
              />
              <path
                d="M65.0227 19.7273H71.0909L77.5 35.3636H77.7727L84.1818 19.7273H90.25V43H85.4773V27.8523H85.2841L79.2614 42.8864H76.0114L69.9886 27.7955H69.7955V43H65.0227V19.7273ZM99.1903 43.3295C98.0767 43.3295 97.0843 43.1364 96.2131 42.75C95.3419 42.3561 94.6525 41.7765 94.1449 41.0114C93.6449 40.2386 93.3949 39.2765 93.3949 38.125C93.3949 37.1553 93.5729 36.3409 93.929 35.6818C94.285 35.0227 94.7699 34.4924 95.3835 34.0909C95.9972 33.6894 96.6941 33.3864 97.4744 33.1818C98.2623 32.9773 99.0881 32.8333 99.9517 32.75C100.967 32.6439 101.785 32.5455 102.406 32.4545C103.027 32.3561 103.478 32.2121 103.759 32.0227C104.039 31.8333 104.179 31.553 104.179 31.1818V31.1136C104.179 30.3939 103.952 29.8371 103.497 29.4432C103.05 29.0492 102.414 28.8523 101.588 28.8523C100.717 28.8523 100.024 29.0455 99.5085 29.4318C98.9934 29.8106 98.6525 30.2879 98.4858 30.8636L94.0085 30.5C94.2358 29.4394 94.6828 28.5227 95.3494 27.75C96.0161 26.9697 96.8759 26.3712 97.929 25.9545C98.9896 25.5303 100.217 25.3182 101.611 25.3182C102.58 25.3182 103.509 25.4318 104.395 25.6591C105.289 25.8864 106.08 26.2386 106.77 26.7159C107.467 27.1932 108.016 27.8068 108.418 28.5568C108.819 29.2992 109.02 30.1894 109.02 31.2273V43H104.429V40.5795H104.293C104.012 41.125 103.637 41.6061 103.168 42.0227C102.698 42.4318 102.134 42.7538 101.474 42.9886C100.815 43.2159 100.054 43.3295 99.1903 43.3295ZM100.577 39.9886C101.289 39.9886 101.918 39.8485 102.463 39.5682C103.009 39.2803 103.437 38.8939 103.747 38.4091C104.058 37.9242 104.213 37.375 104.213 36.7614V34.9091C104.062 35.0076 103.853 35.0985 103.588 35.1818C103.33 35.2576 103.039 35.3295 102.713 35.3977C102.387 35.4583 102.062 35.5152 101.736 35.5682C101.41 35.6136 101.115 35.6553 100.849 35.6932C100.281 35.7765 99.785 35.9091 99.3608 36.0909C98.9366 36.2727 98.607 36.5189 98.3722 36.8295C98.1373 37.1326 98.0199 37.5114 98.0199 37.9659C98.0199 38.625 98.2585 39.1288 98.7358 39.4773C99.2206 39.8182 99.8343 39.9886 100.577 39.9886ZM112.776 43V25.5455H117.469V28.5909H117.651C117.969 27.5076 118.503 26.6894 119.253 26.1364C120.003 25.5758 120.866 25.2955 121.844 25.2955C122.086 25.2955 122.348 25.3106 122.628 25.3409C122.908 25.3712 123.154 25.4129 123.366 25.4659V29.7614C123.139 29.6932 122.825 29.6326 122.423 29.5795C122.022 29.5265 121.654 29.5 121.321 29.5C120.609 29.5 119.973 29.6553 119.412 29.9659C118.859 30.2689 118.42 30.6932 118.094 31.2386C117.776 31.7841 117.616 32.4129 117.616 33.125V43H112.776ZM130.256 37.9773L130.267 32.1705H130.972L136.562 25.5455H142.119L134.608 34.3182H133.46L130.256 37.9773ZM125.869 43V19.7273H130.71V43H125.869ZM136.778 43L131.642 35.3977L134.869 31.9773L142.449 43H136.778ZM151.73 43.3409C149.935 43.3409 148.389 42.9773 147.094 42.25C145.806 41.5152 144.813 40.4773 144.116 39.1364C143.42 37.7879 143.071 36.1932 143.071 34.3523C143.071 32.5568 143.42 30.9811 144.116 29.625C144.813 28.2689 145.795 27.2121 147.06 26.4545C148.332 25.697 149.825 25.3182 151.537 25.3182C152.688 25.3182 153.76 25.5038 154.753 25.875C155.753 26.2386 156.624 26.7879 157.366 27.5227C158.116 28.2576 158.7 29.1818 159.116 30.2955C159.533 31.4015 159.741 32.697 159.741 34.1818V35.5114H145.003V32.5114H155.185C155.185 31.8144 155.033 31.197 154.73 30.6591C154.427 30.1212 154.007 29.7008 153.469 29.3977C152.938 29.0871 152.321 28.9318 151.616 28.9318C150.882 28.9318 150.23 29.1023 149.662 29.4432C149.101 29.7765 148.662 30.2273 148.344 30.7955C148.026 31.3561 147.863 31.9811 147.855 32.6705V35.5227C147.855 36.3864 148.014 37.1326 148.332 37.7614C148.658 38.3902 149.116 38.875 149.707 39.2159C150.298 39.5568 150.999 39.7273 151.81 39.7273C152.348 39.7273 152.84 39.6515 153.287 39.5C153.734 39.3485 154.116 39.1212 154.435 38.8182C154.753 38.5152 154.995 38.1439 155.162 37.7045L159.639 38C159.412 39.0758 158.946 40.0152 158.241 40.8182C157.545 41.6136 156.643 42.2348 155.537 42.6818C154.438 43.1212 153.17 43.3409 151.73 43.3409ZM172.185 25.5455V29.1818H161.673V25.5455H172.185ZM164.06 21.3636H168.901V37.6364C168.901 38.0833 168.969 38.4318 169.105 38.6818C169.241 38.9242 169.431 39.0947 169.673 39.1932C169.923 39.2917 170.211 39.3409 170.537 39.3409C170.764 39.3409 170.991 39.322 171.219 39.2841C171.446 39.2386 171.62 39.2045 171.741 39.1818L172.503 42.7841C172.26 42.8598 171.92 42.947 171.48 43.0455C171.041 43.1515 170.507 43.2159 169.878 43.2386C168.711 43.2841 167.688 43.1288 166.81 42.7727C165.938 42.4167 165.26 41.8636 164.776 41.1136C164.291 40.3636 164.052 39.4167 164.06 38.2727V21.3636ZM189.642 30.5227L185.21 30.7955C185.134 30.4167 184.972 30.0758 184.722 29.7727C184.472 29.4621 184.142 29.2159 183.733 29.0341C183.331 28.8447 182.85 28.75 182.29 28.75C181.54 28.75 180.907 28.9091 180.392 29.2273C179.877 29.5379 179.619 29.9545 179.619 30.4773C179.619 30.8939 179.786 31.2462 180.119 31.5341C180.453 31.822 181.025 32.053 181.835 32.2273L184.994 32.8636C186.691 33.2121 187.956 33.7727 188.79 34.5455C189.623 35.3182 190.04 36.3333 190.04 37.5909C190.04 38.7348 189.703 39.7386 189.028 40.6023C188.362 41.4659 187.445 42.1402 186.278 42.625C185.119 43.1023 183.782 43.3409 182.267 43.3409C179.956 43.3409 178.116 42.8598 176.744 41.8977C175.381 40.928 174.581 39.6098 174.347 37.9432L179.108 37.6932C179.252 38.3977 179.6 38.9356 180.153 39.3068C180.706 39.6705 181.415 39.8523 182.278 39.8523C183.127 39.8523 183.809 39.6894 184.324 39.3636C184.847 39.0303 185.112 38.6023 185.119 38.0795C185.112 37.6402 184.926 37.2803 184.562 37C184.199 36.7121 183.638 36.4924 182.881 36.3409L179.858 35.7386C178.153 35.3977 176.884 34.8068 176.051 33.9659C175.225 33.125 174.812 32.053 174.812 30.75C174.812 29.6288 175.116 28.6629 175.722 27.8523C176.335 27.0417 177.195 26.4167 178.301 25.9773C179.415 25.5379 180.718 25.3182 182.21 25.3182C184.415 25.3182 186.15 25.7841 187.415 26.7159C188.688 27.6477 189.43 28.9167 189.642 30.5227Z"
                fill={` ${isDarkMode ? "white" : "#111"}`}
              />
              <path
                d="M71.1679 45.7089C70.8984 46.1804 70.455 46.7436 69.8375 47.3984C69.2724 48.0832 68.6287 48.723 67.9064 49.318C67.1954 49.9541 66.4469 50.5341 65.6611 51.0579C64.9276 51.6117 64.2989 51.9821 63.775 52.1692C63.2398 52.3151 62.7103 52.2384 62.1865 51.939C61.6626 51.6396 60.9722 50.8107 60.1153 49.4522C59.2697 48.1349 58.1622 46.1815 56.7927 43.5919C55.4532 40.9498 53.6796 37.3648 51.4721 32.8367C49.7879 35.9051 48.246 38.8463 46.8463 41.6603C45.4466 44.4743 44.2901 47.0451 43.3769 49.3726C42.4637 51.7002 41.7918 53.6965 41.3614 55.3617C40.9309 57.027 40.8167 58.23 41.0188 58.971C40.5136 59.0645 39.9485 59.0196 39.3236 58.8362C38.7398 58.6415 38.1804 58.374 37.6453 58.0334C37.1102 57.6928 36.6256 57.2943 36.1916 56.8377C35.7987 56.3699 35.5349 55.889 35.4002 55.3951C35.4002 54.9086 35.535 54.1864 35.8045 53.2284C36.074 52.2704 36.4501 51.2171 36.9329 50.0683C37.9472 47.6247 39.5359 44.6929 41.699 41.2727C43.8921 37.8002 46.6091 33.8973 49.8501 29.5641C43.5491 16.9977 37.9494 11.3823 33.0509 12.718C33.2194 11.3895 33.7153 10.1266 34.5386 8.92917C35.4031 7.72052 36.4248 6.84492 37.6036 6.30239C38.962 5.932 40.1239 5.8142 41.0894 5.94897C42.0436 6.04258 43.0614 6.69377 44.1428 7.90254C45.2242 9.11131 46.502 11.0405 47.9762 13.69C49.4392 16.2983 51.3737 19.9058 53.7796 24.5125C54.7452 22.7014 55.6434 20.8865 56.4743 19.0679C57.3351 17.1969 58.1098 15.4157 58.7984 13.7243C59.4871 12.0329 60.0803 10.4781 60.5781 9.05986C61.0759 7.64163 61.4333 6.43856 61.6504 5.45066C61.89 4.54508 61.8975 3.68065 61.673 2.85737C61.471 2.11642 60.9809 1.2108 60.2026 0.140509C61.7331 0.563461 62.923 1.03504 63.7724 1.55525C64.6518 2.02306 65.5012 2.78651 66.3207 3.84558C66.5077 4.85596 66.489 5.92246 66.2644 7.04508C66.0809 8.15648 65.5831 9.57471 64.771 11.2998C63.9888 12.9725 62.8436 15.0979 61.3353 17.6761C59.8271 20.2544 57.8155 23.5005 55.3006 27.4146C57.0929 30.9061 58.7074 33.8269 60.1442 36.1771C61.5811 38.5272 62.915 40.4189 64.1461 41.8522C65.3659 43.2444 66.5465 44.2492 67.6878 44.8667C68.8179 45.4431 69.9779 45.7238 71.1679 45.7089Z"
                fill="#0052FF"
              />
            </svg>
          </h2>
        </div>{" "}
        {details === 0 ? (
          <div className="flex items-center gap-x-3">
            {" "}
            <Skeleton
              className={`md:w-52 md:h-10 rounded-md  ${
                isDarkMode ? "bg-[#333]" : "bg-gray-200/80"
              }  w-24 h-10`}
            />
            <Skeleton
              className={`md:w-52 md:h-10 md:rounded-sm  ${
                isDarkMode ? "bg-[#333]" : "bg-gray-200/80"
              } w-10 h-10 rounded-full`}
            />
            <Skeleton
              className={`md:w-10 md:h-10 rounded-full ${
                isDarkMode ? "bg-[#333]" : "bg-gray-200/80"
              } w-10 h-10`}
            />
          </div>
        ) : (
          <div className="nav-tools text-sm flex items-center">
            <Select defaultValue="Balance">
              <SelectTrigger
                className={`${isDarkMode ? "border border-[#222]" : "border"}`}
              >
                <SelectValue className="outline-none " />
              </SelectTrigger>
              <SelectContent
                className={`outline-none focus:outline-none ${
                  isDarkMode ? `${baseColor} text-white border-0` : ""
                }`}
              >
                <SelectItem value="Balance">
                  <div className="flex items-center py-2">
                    <div className="w-5 h-5 ">
                      {" "}
                      <Image
                        alt=""
                        src="/assets/dollar.png"
                        width={1000}
                        height={10000}
                      />
                    </div>
                    <div className="text-sm font-bold mx-2">
                      <code>{details.tradingBalance.toLocaleString()}</code>
                    </div>
                  </div>
                </SelectItem>
                {deposits.map((deps, index) => (
                  <div key={deps.coinName}>
                    <SelectItem key={deps.coinName} value={deps.coinName}>
                      <div className="flex items-center py-2">
                        <div className="image">
                          <Image
                            src={deps.image}
                            alt=""
                            width={20}
                            height={15}
                          />
                        </div>
                        <div className="price text-sm mx-2 font-bold">
                          {details !== 0 && details !== null ? (
                            <code>
                              {coinPrices[deps.short.toLowerCase()]
                                ? (
                                    details.tradingBalance /
                                    coinPrices[deps.short.toLowerCase()].usd
                                  ).toFixed(5)
                                : "0.00"}
                            </code>
                          ) : (
                            <span>calculating...</span>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  </div>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger onClick={handleReadNotif}>
                <div className="notif-cont  ml-3 relative">
                  <div
                    className={` flex font-bold ${
                      isDarkMode
                        ? `md:bg-[#0052FF10] text-[#0052FF]`
                        : "md:bg-[#0052FF10] text-[#0052FF]"
                    } rounded-full md:rounded-lg md:px-3 md:py-3`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="md:w-5 md:h-5 w-5 h-5 md:mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 8a6 6 0 1112 0c0 1.887.454 3.665 1.257 5.234a.75.75 0 01-.515 1.076 32.903 32.903 0 01-3.256.508 3.5 3.5 0 01-6.972 0 32.91 32.91 0 01-3.256-.508.75.75 0 01-.515-1.076A11.448 11.448 0 004 8zm6 7c-.655 0-1.305-.02-1.95-.057a2 2 0 003.9 0c-.645.038-1.295.057-1.95.057zM8.75 6a.75.75 0 000 1.5h1.043L8.14 9.814A.75.75 0 008.75 11h2.5a.75.75 0 000-1.5h-1.043l1.653-2.314A.75.75 0 0011.25 6h-2.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div
                      className={`hidden md:block  ${
                        isDarkMode ? "text-[#0052FF]" : "text-[#0052FF]"
                      }`}
                    >
                      Notifications
                    </div>
                  </div>

                  {!details.isReadNotifications && (
                    <div className="notifier-dot absolute md:-right-1 right-0  top-0">
                      <div className="dot bg-red-500 md:w-3 md:h-3 animate__rubberBand animate__animated animate__infinite rounded-full w-2 h-2"></div>
                    </div>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent
                className={`w-[350px] md:w-[400px] mx-3 pb-0 pt-4 px-1 relative overflow-hidden ${
                  isDarkMode ? "bg-[#222] border-white/5 text-gray-200" : ""
                }`}
              >
                <div className="tit px-3">
                  <div className="flex w-full justify-between items-center pb-4">
                    <div
                      className={`title-name font-bold ${
                        isDarkMode ? "text-white" : "text-black/90"
                      }`}
                    >
                      Notifications
                    </div>
                    <div className="titcount fleex">
                      <div className=" ">
                        <div
                          className={`py-1 px-2 rounded-full text-xs font-bold ${
                            isDarkMode ? "bg-[#333]" : "bg-black/5"
                          }`}
                        >
                          {notifications.length}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`line w-1/2 mx-auto mb-2 h-0.5  rounded-full ${
                      isDarkMode ? "bg-white/5" : "bg-black/5"
                    }`}
                  ></div>
                </div>
                <div className="cont ">
                  {notifications.length === 0 && (
                    <>
                      {" "}
                      <div className="message text-center text-sm py-4">
                        No notifications yet
                      </div>
                    </>
                  )}
                  {loading && (
                    <div
                      className={`loader-overlay absolute w-full h-full ${
                        isDarkMode ? "bg-black" : "bg-white"
                      } opacity-60 left-0 top-0 blur-2xl z-50`}
                    ></div>
                  )}
                  {notifications.length !== 0 && (
                    <>
                      <div>
                        <div className=" max-h-[300px] overflow-scroll overflow-x-hidden w-full px-3 py-3">
                          {sortedNotifications.reverse().map((notif, index) => (
                            <>
                              <div
                                className={`flex justify-between w-full items-start cursor-pointer transition-all`}
                                key={crypto.randomUUID()}
                              >
                                <div className="icon flex items-center flex-col">
                                  <div
                                    className={`${
                                      notif.method === "success"
                                        ? isDarkMode
                                          ? "bg-green-500/10 text-green-500"
                                          : "bg-green-500/20 text-green-500"
                                        : notif.method === "failure"
                                        ? isDarkMode
                                          ? "bg-red-500/10 text-red-500"
                                          : "bg-red-500/20 text-red-500"
                                        : notif.method === "pending"
                                        ? isDarkMode
                                          ? "bg-orange-500/10 text-orange-500"
                                          : "bg-orange-500/20 text-orange-500"
                                        : isDarkMode
                                        ? "bg-[#333] text-white"
                                        : "bg-[#33333320] text-white"
                                    } rounded-full p-3`}
                                  >
                                    {notif.type === "trade" ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : notif.type === "transaction" ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M13.2 2.24a.75.75 0 00.04 1.06l2.1 1.95H6.75a.75.75 0 000 1.5h8.59l-2.1 1.95a.75.75 0 101.02 1.1l3.5-3.25a.75.75 0 000-1.1l-3.5-3.25a.75.75 0 00-1.06.04zm-6.4 8a.75.75 0 00-1.06-.04l-3.5 3.25a.75.75 0 000 1.1l3.5 3.25a.75.75 0 101.02-1.1l-2.1-1.95h8.59a.75.75 0 000-1.5H4.66l2.1-1.95a.75.75 0 00.04-1.06z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : notif.type === "intro" ? (
                                      <>🤝</>
                                    ) : notif.type === "verification" ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-4 h-4 text-sm"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <div
                                    className={`linedwon   ${
                                      notif.method === "success"
                                        ? isDarkMode
                                          ? "bg-green-500/10 text-green-500"
                                          : "bg-green-500/20 text-green-500"
                                        : notif.method === "failure"
                                        ? isDarkMode
                                          ? "bg-red-500/10 text-red-500"
                                          : "bg-red-500/20 text-red-500"
                                        : notif.method === "pending"
                                        ? isDarkMode
                                          ? "bg-orange-500/10 text-orange-500"
                                          : "bg-orange-500/20 text-orange-500"
                                        : isDarkMode
                                        ? "bg-[#333] text-white"
                                        : "bg-[#33333320] text-white"
                                    } ${
                                      index !== notifications.length - 1
                                        ? "h-11 border border-dashed border-white/5"
                                        : ""
                                    }`}
                                    key={crypto.randomUUID()}
                                  ></div>
                                </div>
                                <div className="message w-full text-sm mx-2">
                                  <div
                                    className={`pb-1 pt-1 ${
                                      isDarkMode
                                        ? "text-white"
                                        : "text-black/90 font-bold"
                                    }`}
                                  >
                                    {" "}
                                    {notif.message}
                                  </div>
                                  <div
                                    className={`date text-xs capitalize ${
                                      isDarkMode ? "opacity-40" : "opacity-80"
                                    }`}
                                  >
                                    {notif.date}
                                  </div>
                                </div>
                                <div
                                  className="actiom pt-3 h-full /w-full"
                                  onClick={() =>
                                    handleNotificationClick(notif.id)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className={`w-4 h-4 ${
                                      isDarkMode
                                        ? "text-white/50 hover:text-white/80"
                                        : "text-black/30 hover:text-black/50"
                                    }`}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <button
              className={`theme-toggler  md:p-3  ${
                isDarkMode
                  ? "md:bg-[#0052FF20] text-[#0052FF] "
                  : "md:bg-[#0052FF10] text-[#0052FF]"
              } rounded-full mx-5 md:mx-2`}
              onClick={toggleTheme}
            >
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`w-5 h-5 
                          }`}
                >
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-5 h-5 
                          }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <Popover>
              <PopoverTrigger>
                <div
                  className={`flex font-bold text-[#0052FF] rounded-full md:p-3 ${
                    isDarkMode ? "md:bg-[#0052FF20]" : "md:bg-[#0052FF10]"
                  } md:mr-5 text-sm`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 "
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className={`w-[300px] mx-3  p-1   ${
                  isDarkMode ? "bg-[#111] text-white border border-white/5" : ""
                }`}
              >
                {/* <div className="header-title py-4 px-4 font-bold">
                  <h1 className="bgname text-lg">Menus</h1>
                </div> */}
                <div className="content1 grid grid-cols-3 gap-y-4 py-3 pt-5 gap-x-3 px-3">
                  <Link href="/dashboard/account" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/profile.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Profile</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/deposits" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/wallet.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />
                      <p className="pt-2">Deposit</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/withdrawals" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/withdraw.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />
                      <p className="pt-2">Withdraw</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/markets" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3 relative ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <div className="identifier absolute -top-1 -right-2">
                        <div className="px-2  font-normal bg-green-500 rounded-md text-white  text-[10px]">
                          Live
                        </div>
                      </div>
                      <Image
                        alt=""
                        src="/assets/increase.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Tradings</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/investments" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/money.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Subscription</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/verify" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  relative ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <div className="verification-identifier absolute -top-1 -right-2">
                        {details.isVerified ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-green-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-red-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <Image
                        alt=""
                        src="/assets/veraccount.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Verification</p>
                    </div>
                  </Link>
                </div>{" "}
                <div className="relative w-full flex items-center justify-center pt-4">
                  <div
                    className={` line h-0.5 w-1/2 mx-auto top-0 left-0 ${
                      isDarkMode ? "bg-white/5" : "bg-black/10"
                    } rounded-full`}
                  ></div>
                </div>
                <div
                  className={`logout flex items-center text-sm py-3 mb-4 mx-3 rounded-md text-red-600 mt-4 ${
                    isDarkMode
                      ? "bg-red-500/10 /border /border-red-600 font-bold"
                      : "bg-red-50"
                  } px-2 font-bold cursor-pointer`}
                  onClick={handleLogout}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5A.75.75 0 0110 2zM5.404 4.343a.75.75 0 010 1.06 6.5 6.5 0 109.192 0 .75.75 0 111.06-1.06 8 8 0 11-11.313 0 .75.75 0 011.06 0z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <p>Logout</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </>
  );
}
