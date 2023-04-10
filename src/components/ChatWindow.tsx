/* eslint-disable */

import {type User} from "@prisma/client";
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useSpring, animated} from 'react-spring';
import {io} from 'socket.io-client';
import {useSession} from "@clerk/nextjs";
import OnMount from "~/utils/onMount";
import {api} from "~/utils/api";

const socket = io('http://localhost:3001');
export const ChatWindow = () => {
  const {session} = useSession();
  const [showMenu, setShowMenu] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ username: string, message: string }[]>([]);

  const {mutate: getUserById} = api.profile.getUserByIdOnEvent.useMutation();
  const [user, setUser] = useState<User & { followedBy: User[]; following: User[]; }>();

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const dropdownAnimation = useSpring({
    transform: showMenu ? 'translate3d(0, 0%, 0)' : 'translate3d(0, 85%, 0)',
    config: {mass: 1, tension: 200, friction: 25},
  });
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  OnMount(() => {
    socket.on('connect', () => {
    });
  });

  useEffect(() => {
    if (!!session?.user.id) {
      getUserById({id: session?.user.id}, {
        onSuccess: (data) => {
          setUser(data);
        }
      });
    }
  }, [session?.user.id, getUserById]);

  useEffect(() => {
    socket.on("message", (data) => {
      if (!!user && !!data) {
        setMessages([...messages, {username: data.username, message: data.message}]);
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }
      ;
    });
  }, [messages, user?.username]);

  const sendMessage = useCallback(() => {
    socket.emit('message', {username: user?.username, message});
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    setMessage("");
  }, [message, user?.username]);

  return (
    <div className="fixed bottom-0 right-16 w-96 h-[26rem] z-50 overflow-hidden">
      <animated.ul
        className="bg-gray-800 shadow-xl rounded-t-xl"
        style={{...dropdownAnimation}}
      >
        <button
          className="w-full font-bold text-xl p-2 text-left text-white"
          onClick={toggleMenu}
        >
          Chat
        </button>
        <div className="h-96 overflow-y-auto scrollbar-hide bg-gray-900 m-2 p-2">
          <input className={"bg-gray-800 w-full p-2 rounded mb-2"}
                 placeholder={"Type message"}
                 value={message}
                 onChange={(e) => e.target.value.length <= 280 && setMessage(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === "Enter") {
                     e.preventDefault();
                     sendMessage();
                   }
                 }}/>
          <div
            ref={containerRef}
            className="h-80 overflow-y-scroll p-2"
            style={{scrollBehavior: 'smooth', scrollbarWidth: 'none'}}
          >
            {messages.map((item, index) => (
              <div key={index} className="text-white mb-2">
                <span className="font-bold">@{item.username}: </span>
                <span>{item.message}</span>
              </div>
            ))}
          </div>
        </div>
      </animated.ul>
      <div className="h-9"/>
    </div>
  );
};
