import React, { useRef, useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

import { BiLoaderAlt } from "react-icons/bi";
import InfiniteScroll from "react-infinite-scroll-component";

type ChatProps = {
	setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
	chatData: ChatData | null;
};

type MessageProps = {
	chat: Chat | null;
};

type Chat = {
	id: string;
	message: string;
	sender: {
		image: string;
		is_kyc_verified: boolean;
		self: boolean;
		user_id: string;
	};
	time: string;
};

type ChatData = {
	chats: Chat[];
	from: string;
	message: string;
	name: string;
	status: "success" | "failure";
	to: string;
};

export default function Chat(props: ChatProps) {
	const [isLoadiing, setIsLoading] = useState(false);
	const [viewAttachment, setViewAttachment] = useState(false);
	const [pageNo, setPageNo] = useState(0);
	const chatContainerRef = useRef<HTMLDivElement | null>(null);
	const [currScrollpos, setCurrScrollpos] = useState(0);
	const handleClick = () => {
		props.setShowChat(false);
	};
	const handleAttachment = () => {
		setViewAttachment(!viewAttachment);
	};
	// const handleScroll = () => {
	// 	if (chatContainerRef.current) {
	// 		if (chatContainerRef.current.scrollTop === 0) {
	// 			setIsLoading(true);
	// 			setPageNo(pageNo + 1);
	// 			getMoreChats();
	// 			chatContainerRef.current.scrollTop = currScrollpos;
	// 		} else setIsLoading(false);
	// 	}
	// };

	const getMoreChats = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(
				`https://qa.corider.in/assignment/chat?page=${pageNo + 1}`
			);
			setPageNo(pageNo + 1);
			//console.log("Fetching data");
			// console.log(props.chatData?.chats);
			if (response.data) {
				setIsLoading(false);
				if (props.chatData) {
					props.chatData.chats = [
						...props.chatData.chats,
						...response.data.chats,
					];
				}
			}
			// console.log(props.chatData?.chats);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		if (chatContainerRef.current)
			chatContainerRef.current.scrollTop =
				chatContainerRef.current?.scrollHeight;
	}, []);

	const Loader = () => {
		return (
			<div className="text-2xl h-5 flex justify-center ">
				<BiLoaderAlt className="transition animate-spin" />
			</div>
		);
		// else return <></>;
	};

	return (
		<div
			className="h-screen bg-[#FAF9F4] flex flex-col"
			style={{ fontFamily: "Mulish" }}
		>
			<div className=" h-[130px] border-b-[1px] pt-[20px] pb-[16px] pl-[16px] pr-[16px] border-[#E5E5E0]">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<span
							className="flex items-center h-[24px] w-[24px] text-[14px]  hover:cursor-pointer"
							onClick={handleClick}
						>
							<svg
								width="16"
								height="16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M15 8H1M1 8L8 15M1 8L8 1"
									stroke="#141E0D"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</span>
						<span className="text-[24px] ml-2 font-bold">
							{props.chatData?.name}
						</span>
					</div>
					<div className="text-3xl">
						<svg
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g clip-path="url(#clip0_1_889)">
								<path
									d="M9.16666 3.33332H5.66666C4.26653 3.33332 3.56647 3.33332 3.03169 3.6058C2.56128 3.84549 2.17883 4.22794 1.93915 4.69834C1.66666 5.23312 1.66666 5.93319 1.66666 7.33332V14.3333C1.66666 15.7335 1.66666 16.4335 1.93915 16.9683C2.17883 17.4387 2.56128 17.8212 3.03169 18.0608C3.56647 18.3333 4.26653 18.3333 5.66666 18.3333H12.6667C14.0668 18.3333 14.7669 18.3333 15.3016 18.0608C15.772 17.8212 16.1545 17.4387 16.3942 16.9683C16.6667 16.4335 16.6667 15.7335 16.6667 14.3333V10.8333M6.66664 13.3333H8.06209C8.46975 13.3333 8.67357 13.3333 8.86538 13.2873C9.03544 13.2464 9.19802 13.1791 9.34714 13.0877C9.51533 12.9847 9.65946 12.8405 9.94771 12.5523L17.9167 4.58332C18.607 3.89296 18.607 2.77368 17.9167 2.08332C17.2263 1.39296 16.107 1.39296 15.4167 2.08332L7.44769 10.0523C7.15944 10.3405 7.01531 10.4847 6.91224 10.6528C6.82086 10.802 6.75352 10.9645 6.71269 11.1346C6.66664 11.3264 6.66664 11.5302 6.66664 11.9379V13.3333Z"
									stroke="#141E0D"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</g>
							<defs>
								<clipPath id="clip0_1_889">
									<rect width="20" height="20" fill="white" />
								</clipPath>
							</defs>
						</svg>
					</div>
				</div>
				<div className=" mt-2 flex items-center justify-between">
					<div className="flex items-center">
						<img
							className="w-[3rem] mr-[16px] h-[3rem]border-[1px] rounded-[100%]"
							src="https://fastly.picsum.photos/id/819/160/160.jpg?hmac=duWXAb-022KT3VnXfDCSyr0sLwddRYoP7RMFnidof_g"
							alt=""
						/>
						<div className="flex flex-col">
							<div
								className="flex items-center"
								style={{ fontFamily: "Mulish" }}
							>
								<span
									className="text-[#606060] mr-1"
									style={{ fontWeight: 600 }}
								>
									From
								</span>
								<span className="text-[#141E0D] font-bold text-xl">
									{props.chatData?.from}
								</span>
							</div>
							<div className="flex items-center">
								<span className="text-[#606060] mr-1">To</span>
								<span className="text-[#141E0D] font-bold text-xl">
									{props.chatData?.to}
								</span>
							</div>
						</div>
					</div>
					<div className="text-3xl">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
								stroke="#141E0D"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
								stroke="#141E0D"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
								stroke="#141E0D"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				</div>
			</div>
			{isLoadiing && Loader()}
			{/* <div
				ref={chatContainerRef}
				onScroll={handleScroll}
				className="bg-[#FAF9F4] flex-1  overflow-y-auto"
			>
				<div className=" p-4">
					{props.chatData?.chats &&
						props.chatData?.chats.map((chat) => <Message chat={chat} />)}
				</div>
			</div> */}
			<div
				id="scrollableDiv"
				style={{
					overflow: "auto",
					display: "flex",
					flexDirection: "column-reverse",
				}}
				ref={chatContainerRef}
			>
				<InfiniteScroll
					dataLength={props.chatData?.chats.length || 0}
					next={getMoreChats}
					style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
					inverse={true}
					hasMore={true}
					loader={<></>}
					scrollableTarget="scrollableDiv"
				>
					{props.chatData?.chats &&
						props.chatData?.chats
							.reverse()
							.map((chat) => <Message chat={chat} />)}
				</InfiniteScroll>
			</div>

			<div className="flex items-center justify-center bg-[#FAF9F4] z-10 shadow-top p-4 h-20">
				<div className="flex items-center h-[42px] justify-between w-full pr-4 bg-[white] rounded-[8px]">
					<input
						type="text"
						className="w-full pl-4 rounded-[8px] h-[42px] outline-none"
						placeholder="Enter your text"
					/>
					{/* <Attachment /> */}
					<div className="flex items-center justify-between">
						<div className="flex items-center justify-center ">
							{viewAttachment && <Attachment />}
							<svg
								onClick={handleAttachment}
								className="mr-4 "
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M17.6271 9.08291L10.1141 16.5959C8.40554 18.3045 5.63544 18.3045 3.9269 16.5959C2.21835 14.8874 2.21835 12.1173 3.9269 10.4087L11.4399 2.89573C12.5789 1.7567 14.4257 1.7567 15.5647 2.89573C16.7037 4.03476 16.7037 5.88149 15.5647 7.02052L8.34631 14.2389C7.7768 14.8084 6.85343 14.8084 6.28392 14.2389C5.7144 13.6694 5.7144 12.746 6.28392 12.1765L12.6184 5.84201"
									stroke="#141E0D"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>

						<svg
							width="18"
							height="16"
							viewBox="0 0 18 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M7.75036 8.00002H3.16702M3.09648 8.24294L1.15071 14.0552C0.997847 14.5118 0.921417 14.7401 0.976267 14.8807C1.0239 15.0028 1.1262 15.0954 1.25244 15.1306C1.3978 15.1712 1.61736 15.0724 2.05647 14.8748L15.9827 8.60797C16.4113 8.4151 16.6256 8.31866 16.6918 8.1847C16.7494 8.06831 16.7494 7.93174 16.6918 7.81535C16.6256 7.68139 16.4113 7.58495 15.9827 7.39208L2.05161 1.12313C1.61383 0.926124 1.39493 0.827622 1.24971 0.868029C1.1236 0.903121 1.0213 0.995442 0.973507 1.11731C0.91847 1.25764 0.994084 1.48545 1.14531 1.94108L3.09702 7.8213C3.12299 7.89955 3.13598 7.93868 3.14111 7.9787C3.14565 8.01421 3.14561 8.05016 3.14097 8.08565C3.13574 8.12566 3.12265 8.16475 3.09648 8.24294Z"
								stroke="#141E0D"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
}

export const Message = (props: MessageProps) => {
	if (!props.chat?.sender.self) {
		return (
			<div className="h-auto flex p-2">
				<img
					className="h-[24px] w-[24px] rounded-full mr-2 "
					src={props.chat?.sender.image}
					alt="Profile"
				></img>
				<div
					className={`h-auto p-[8px] w-[287px] text-[14px] bg-white  shadow-custom rounded-b-[12px] rounded-r-[12px]`}
				>
					{props.chat?.message}
				</div>
			</div>
		);
	} else {
		return (
			<div className="h-auto flex justify-end p-2">
				<div
					className={`h-auto text-[14px] p-[8px] w-[287px]  bg-[#1C63D5] text-white shadow-custom rounded-t-[12px] rounded-l-[12px]`}
				>
					{props.chat?.message}
				</div>
			</div>
		);
	}
};

export const Attachment = () => {
	return (
		<>
			<div className=" absolute translate-y-[-45px] translate-x-[-7px] h-[44px] pt-[12px] pr-[16px] pb-[12px] pl-[16px] items-center w-[124px] border-1 border-[#008000] bg-[#008000] rounded-full flex justify-between">
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M1.66667 6.41814C1.66667 5.17468 2.67469 4.16666 3.91815 4.16666C4.56422 4.16666 5.13781 3.75324 5.34211 3.14032L5.41667 2.91666C5.45183 2.81118 5.46941 2.75844 5.48821 2.71166C5.72837 2.11426 6.29116 1.70863 6.93385 1.6697C6.98418 1.66666 7.03977 1.66666 7.15095 1.66666H12.8491C12.9602 1.66666 13.0158 1.66666 13.0662 1.6697C13.7088 1.70863 14.2716 2.11426 14.5118 2.71166C14.5306 2.75844 14.5482 2.81118 14.5833 2.91666L14.6579 3.14032C14.8622 3.75324 15.4358 4.16666 16.0819 4.16666C17.3253 4.16666 18.3333 5.17468 18.3333 6.41814V13.5C18.3333 14.9001 18.3333 15.6002 18.0608 16.135C17.8212 16.6054 17.4387 16.9878 16.9683 17.2275C16.4335 17.5 15.7335 17.5 14.3333 17.5H5.66667C4.26654 17.5 3.56647 17.5 3.03169 17.2275C2.56129 16.9878 2.17883 16.6054 1.93915 16.135C1.66667 15.6002 1.66667 14.9001 1.66667 13.5V6.41814Z"
						stroke="white"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M10 13.75C12.0711 13.75 13.75 12.0711 13.75 9.99999C13.75 7.92892 12.0711 6.24999 10 6.24999C7.92893 6.24999 6.25 7.92892 6.25 9.99999C6.25 12.0711 7.92893 13.75 10 13.75Z"
						stroke="white"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M18 6.42857L12.9091 10L18 13.5714V6.42857Z"
						stroke="white"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M11.4545 5H3.45455C2.65122 5 2 5.63959 2 6.42857V13.5714C2 14.3604 2.65122 15 3.45455 15H11.4545C12.2579 15 12.9091 14.3604 12.9091 13.5714V6.42857C12.9091 5.63959 12.2579 5 11.4545 5Z"
						stroke="white"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M16.6667 10.4167V5.66666C16.6667 4.26653 16.6667 3.56646 16.3942 3.03168C16.1545 2.56128 15.7721 2.17882 15.3016 1.93914C14.7669 1.66666 14.0668 1.66666 12.6667 1.66666H7.33334C5.9332 1.66666 5.23314 1.66666 4.69836 1.93914C4.22795 2.17882 3.8455 2.56128 3.60582 3.03168C3.33334 3.56646 3.33334 4.26653 3.33334 5.66666V14.3333C3.33334 15.7335 3.33334 16.4335 3.60582 16.9683C3.8455 17.4387 4.22795 17.8212 4.69836 18.0608C5.23314 18.3333 5.93317 18.3333 7.33322 18.3333H10.4167M11.6667 9.16666H6.66667M8.33334 12.5H6.66667M13.3333 5.83332H6.66667M12.5 15.8333L15 18.3333M15 18.3333L17.5 15.8333M15 18.3333V13.3333"
						stroke="white"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>

			<div className="w-[16px] h-[8px] border-1 rotate-45 translate-y-[-25px] translate-x-[12px] border-[#008000] bg-[#008000]"></div>
		</>
	);
};
