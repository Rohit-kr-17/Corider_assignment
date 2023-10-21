import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Chat from "./Chat";

type ChatData = {
	chats: {
		id: string;
		message: string;
		sender: {
			image: string;
			is_kyc_verified: boolean;
			self: boolean;
			user_id: string;
		};
		time: string;
	}[];
	from: string;
	message: string;
	name: string;
	status: "success" | "failure";
	to: string;
};

export default function Home() {
	const [data, setData] = useState<ChatData | null>(null);
	const [showChat, setShowChat] = useState(false);

	useEffect(() => {
		const getChat = async () => {
			const chat: AxiosResponse<ChatData> = await axios.get(
				"https://qa.corider.in/assignment/chat?page=0"
			);
			console.log(chat.data);

			setData(chat.data);
		};
		getChat();
	}, []);

	const handleClick = () => {
		setShowChat(!showChat);
	};

	if (!showChat) {
		return (
			<div className="bg-gray-200 h-screen">
				<div className="flex w-screen h-[4rem] font-bold text-2xl items-center justify-center border-b-2 border-green-500 shadow-sm text-white bg-green-500 ">
					Messages
				</div>
				<div
					className="flex items-center p-4 border-2 w-screen bg-white hover:bg-gray-100 h-[5rem]"
					onClick={handleClick}
				>
					<img
						className="w-[4rem] h-[4rem] rounded-[100%]"
						src="https://fastly.picsum.photos/id/819/160/160.jpg?hmac=duWXAb-022KT3VnXfDCSyr0sLwddRYoP7RMFnidof_g"
						alt=""
					/>
					<div className="ml-5 justify-start font-sembold  font-bold text-xl">
						Chat 1
					</div>
				</div>
			</div>
		);
	} else {
		return <Chat setShowChat={setShowChat} chatData={data} />;
	}
}
