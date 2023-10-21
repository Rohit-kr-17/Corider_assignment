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
		console.log("adsfsa");
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
		<div className="h-screen flex flex-col">
			<div className="bg-gray-200 h-auto border-b-2 p-4 shadow-lg z-10">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<span
							className="text-2xl hover:cursor-pointer"
							onClick={handleClick}
						>
							<BiArrowBack />
						</span>
						<span className="text-[1.5rem] ml-2 font-bold">
							{props.chatData?.name}
						</span>
					</div>
					<div className="text-3xl">
						<LiaEditSolid />
					</div>
				</div>
				<div className="mt-2 flex items-center justify-between">
					<div className="flex items-center">
						<img
							className="w-[3rem] mr-2 h-[3rem] rounded-[100%]"
							src="https://fastly.picsum.photos/id/819/160/160.jpg?hmac=duWXAb-022KT3VnXfDCSyr0sLwddRYoP7RMFnidof_g"
							alt=""
						/>
						<div className="flex flex-col">
							<div className="flex items-center">
								<span className="text-gray-400 mr-1">From</span>
								<span className="font-bold text-xl">
									{props.chatData?.from}
								</span>
							</div>
							<div className="flex items-center">
								<span className="text-gray-400 mr-1">To</span>
								<span className="font-bold text-xl">{props.chatData?.to}</span>
							</div>
						</div>
					</div>
					<div className="text-3xl">
						<BsThreeDotsVertical />
					</div>
				</div>
			</div>
			<div
				ref={chatContainerRef}
				onScroll={handleScroll}
				className="flex-1 flex flex-col-reverse overflow-y-auto"
			>
				<div className="bg-white p-4">{renderMessagesWithDate()}</div>

				<div className="bg-white p-4">
					{props.chatData?.chats &&
						props.chatData?.chats.map((chat) => <Message chat={chat} />)}
				</div>
				<div className="bg-white p-4">{Loader()}</div>
			</div>
			<div className="flex items-center justify-center bg-gray-200 z-10 shadow-top p-4 h-20">
				<div className="flex items-center  justify-between w-full pr-4 bg-white rounded-lg h-[90%]">
					<input
						type="text"
						className="w-full pl-4 rounded-l-lg h-full hover:bg-gray-100 outline-none"
						placeholder="Enter your text"
					/>
					<div className="flex items-center justify-between">
						<ImAttachment className="text-xl hover:cursor-pointer mr-4" />
						<VscSend className="text-2xl hover:cursor-pointer" />
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
					className="h-5 w-5 rounded-full mr-2 "
					src={props.chat?.sender.image}
					alt="Profile"
				></img>
				<div
					className={`h-auto p-2 w-[80%] border-2 border-white shadow-md rounded-b-lg rounded-r-lg`}
				>
					{props.chat?.message}
				</div>
			</div>
		);
	} else {
		return (
			<div className="h-auto flex justify-end p-2">
				<div
					className={`h-auto bg-violet-500 border-violet-500 text-white p-2 w-[80%] border-2 shadow-md rounded-b-lg rounded-l-lg`}
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
