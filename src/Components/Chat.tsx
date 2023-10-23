import React, { useRef, useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { BiArrowBack } from "react-icons/bi";
import { LiaEditSolid } from "react-icons/lia";
import { ImAttachment } from "react-icons/im";
import { VscSend } from "react-icons/vsc";
import { BiLoaderAlt } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";

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
	const [pageNo, setPageNo] = useState(0);
	const [isLoadiing, setIsLoading] = useState(false);
	const [autoScroll, setAutoScroll] = useState(true);
	const chatContainerRef = useRef<HTMLDivElement | null>(null);

	const handleClick = () => {
		props.setShowChat(false);
	};
	const renderMessagesWithDate = () => {
		let prevDate = "";
		console.log(prevDate);

		return props.chatData?.chats.map((chat) => {
			const formattedDate = new Date(chat.time).toLocaleDateString();
			if (prevDate === "") {
				prevDate = formattedDate;
			}
			if (formattedDate !== prevDate) {
				const temp = prevDate;
				prevDate = formattedDate;
				return (
					<div key={chat.id}>
						{<DateComponent date={temp} />}
						<Message chat={chat} />
					</div>
				);
			}
		});
	};
	const Loader = () => {
		if (isLoadiing)
			return (
				<div className="text-2xl flex justify-center ">
					<BiLoaderAlt className="transition animate-spin" />
				</div>
			);
		else return <></>;
	};

	const handleScroll = () => {
		if (chatContainerRef.current) {
			//console.log(chatContainerRef.current.scrollTop);
			const isAtBottom =
				chatContainerRef.current.clientHeight -
					chatContainerRef.current.scrollHeight ===
				Math.round(chatContainerRef.current.scrollTop);

			if (isAtBottom) {
				setAutoScroll(false);
			} else {
				setAutoScroll(true);
			}

			if (autoScroll && isAtBottom) {
				getMoreChatData();
			}
		}
	};

	const getMoreChatData = async () => {
		try {
			setIsLoading(true);
			const chat: AxiosResponse<ChatData> = await axios.get(
				`https://qa.corider.in/assignment/chat?page=${pageNo + 1}`
			);
			if (chat.data.status === "success") {
				setPageNo(pageNo + 1);
				if (props.chatData)
					props.chatData.chats = [...chat.data.chats, ...props.chatData.chats];
				setIsLoading(false);
			}
		} catch (error) {
			console.error("Error fetching more chat data:", error);
		}
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
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
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
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
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
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
								stroke="#141E0D"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
								stroke="#141E0D"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				</div>
			</div>
			<div
				ref={chatContainerRef}
				onScroll={handleScroll}
				className="bg-[#FAF9F4] flex-1 flex flex-col-reverse overflow-y-auto"
			>
				<div className=" p-4">{renderMessagesWithDate()}</div>

				<div className=" p-4">
					{props.chatData?.chats &&
						props.chatData?.chats.map((chat) => <Message chat={chat} />)}
				</div>
				<div className="bg-[#FAF9F4] p-4">{Loader()}</div>
			</div>
			<div className="flex items-center justify-center bg-[#FAF9F4] z-10 shadow-top p-4 h-20">
				<div className="flex items-center h-[42px] justify-between w-full pr-4 bg-[white] rounded-[8px]">
					<input
						type="text"
						className="w-full pl-4 rounded-[8px] h-[42px] outline-none"
						placeholder="Enter your text"
					/>
					<div className="flex items-center justify-between">
						<svg
							className="mr-4"
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M17.6271 9.08291L10.1141 16.5959C8.40554 18.3045 5.63544 18.3045 3.9269 16.5959C2.21835 14.8874 2.21835 12.1173 3.9269 10.4087L11.4399 2.89573C12.5789 1.7567 14.4257 1.7567 15.5647 2.89573C16.7037 4.03476 16.7037 5.88149 15.5647 7.02052L8.34631 14.2389C7.7768 14.8084 6.85343 14.8084 6.28392 14.2389C5.7144 13.6694 5.7144 12.746 6.28392 12.1765L12.6184 5.84201"
								stroke="#141E0D"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>

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
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
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
					className={`h-auto p-[8px] w-[287px]  bg-white  shadow-custom rounded-b-[12px] rounded-r-[12px]`}
				>
					{props.chat?.message}
				</div>
			</div>
		);
	} else {
		return (
			<div className="h-auto flex justify-end p-2">
				<div
					className={`h-auto p-[8px] w-[287px]  bg-[#1C63D5] text-white shadow-custom rounded-t-[12px] rounded-l-[12px]`}
				>
					{props.chat?.message}
				</div>
			</div>
		);
	}
};
const DateComponent = ({ date }: { date: string }) => (
	<div className="text-center text-gray-500 py-2">{date}</div>
);
