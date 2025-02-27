import {Flex, Box, Text, Image, Input} from "@chakra-ui/react";
import styled from "styled-components";
import {useEffect, useRef, useState} from "react";
import {InputGroup} from "@/components/ui/input-group.jsx";
import {IoIosSend} from "react-icons/io";

const Container = styled.div`
    background-color: #F1F5FB;
    user-select: none;
    position: relative; /* 设置容器为相对定位 */
    height: 100vh; /* 设置容器高度为视口高度 */
`;
const MockMessage = [
    {
        "time": "2023-01-01 18:00:00",
        "content": "我们聊了什么!",
        "role": "user",
        "username": "newUser"
    },
    {
        "time": "2023-01-01 18:00:00",
        "content": "我们刚刚开始聊天，还没有具体的内容。你可以告诉我你想聊什么，或者有什么问题需要帮助吗？",
        "role": "assistant",
        "username": "newUser"
    },
    {
        "time": "2023-01-01 18:00:00",
        "content": "写一份关于锅包肉的导游介绍!",
        "role": "user",
        "username": "newUser"
    },
    {
        "time": "2023-01-01 18:00:00",
        "content": "标题:   锅包肉:   中国传统美食的魅力与故事导语:   锅包肉，一道源自中国东北的经典美食，以其独特的口感和丰富的文化内涵吸引了无数食客。今天，就让我们一起走进这道美食的世界，探寻它的历史渊源、制作方法以及背后的故事。\n" +
            "一、历史渊源:锅包肉的起源锅包肉起源于中国东北的黑龙江省，这里的饮食文化深受满族、蒙古族等少数民族的影响。据传，锅包肉最早可以追溯到清朝末年，由一位名叫郑兴文的满族厨师发明。当时，郑兴文为了迎合一位来自俄罗斯的宾客口味，特意将烹制方法进行改良，创造性地使用了“锅爆”的方式，从而诞生了这道具有国际风味的酸甜口感，传承至今，成为中华饮食文化瑰宝。\n",
        "role": "assistant",
        "username": "newUser"
    },
    {
        "time": "2023-01-01 18:00:00",
        "content": "1+1!",
        "role": "user",
        "username": "newUser"
    },
    {
        "time": "2023-01-01 18:00:00",
        "content": "1 + 1 等于 2。这是一个非常基础的数学问题，如果你有其他数学问题或任何其他问题，随时告诉我！",
        "role": "assistant",
        "username": "newUser"
    },
    {
        "time": "2023-01-01 18:00:00",
        "content": "1+1!",
        "role": "user",
        "username": "newUser"
    },
    {
        "time": "2023-01-01 18:00:00",
        "content": "1 + 1 等于 2。这是一个非常基础的数学问题，如果你有其他数学问题或任何其他问题，随时告诉我！",
        "role": "assistant",
        "username": "newUser"
    }]
const ChatLayout = () => {
    const [messages, setMessages] = useState(MockMessage)
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    // 时间格式化函数
    const formatTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    const scrollContainerRef = useRef(null); // 新增滚动容器 ref

    // 修改后的滚动函数
    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            // 使用 requestAnimationFrame 确保在渲染后执行
            requestAnimationFrame(() => {
                scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
            });
        }
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // 添加用户消息
        const newMessage = {
            time: formatTime(new Date()),
            content: inputValue,
            role: "user",
            username: "newUser"
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue("");

        // 这里可以添加AI回复的模拟逻辑
        // setTimeout(() => {
        //     const aiResponse = {
        //         time: formatTime(new Date()),
        //         content: "这是AI的回复",
        //         role: "assistant",
        //         username: "AI"
        //     };
        //     setMessages(prev => [...prev, aiResponse]);
        // }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <Container>
            <Flex padding="0 10px 0 10px" gap="3" direction="column" minH="0"> {/* 关键 minH 设置 */}
                <Box
                    ref={scrollContainerRef}
                    overflowY="auto"
                    flex="1"       // 填充剩余空间
                    maxH="calc(100vh - 90px)" // 设置最大高度（根据实际情况调整）
                    css={{
                        '&::-webkit-scrollbar': { display: 'none' },
                        '&': {
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none',
                        },
                    }}
                    pt="40px"
                    pb="20px" // 添加底部 padding 防止消息被输入框遮挡
                >
                    {messages.map((msg, index) => (
                        <Flex justify={msg.role === "assistant" ? "flex-start" : "flex-end"} key={index}
                              marginBottom="5"> {/* 设置每行之间的间距 */}
                            {msg.role === "assistant" ? (<Image
                                src="https://ide.code.fun/api/image?token=67c00782797f850011fa27a7&name=baeaa950f8457461f43a9c9ce6b28abb.png"
                                w="31px"
                                h="31px"
                            />) : ""}
                            <Box
                                ml={3}

                            >
                                <Box
                                    maxWidth="70vw"
                                    px={4}
                                    py={3}
                                    bg={msg.role === "assistant" ?
                                        "#fff" :
                                        "#d786f7"
                                    }
                                    borderRadius={msg.role === "assistant" ?
                                        "0 12px 12px 12px " :
                                        "12px 0 12px 12px "
                                    }

                                >
                                    <Text fontSize="12px" color={
                                        msg.role === "assistant" ?
                                            "black" :
                                            "white"
                                    }>
                                        {msg.content}
                                    </Text>
                                </Box>
                                {msg.role === "assistant" ? (<Text mt={1} fontSize="10px" color="gray">
                                    {msg.time}
                                </Text>) : ""}
                            </Box>
                        </Flex>
                    ))}
                    <div ref={messagesEndRef}/>
                </Box>
            </Flex>
            <Flex
                h="50px"
                bg="#fff"
                alignItems="center"  // 垂直方向居中
                bottom="0px"     // 直接修改定位距离
                position="sticky"   // 添加定位
                zIndex="1"          // 防止被消息列表覆盖
            >
                <InputGroup
                    margin="0 auto"
                    h="45px"
                    width="96%"        // 确保宽度填充
                    endElement={
                        <IoIosSend color="#d499f9" size="26px" onClick={handleSend}/>
                    }
                >
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        border="none"
                        bg="#D0A7F2"
                        borderRadius="12px"
                        placeholder="开始探索未知的问题吧 "
                        _placeholder={{
                            color: "#ab7af5",
                            fontSize: "13px"
                        }}
                    />

                </InputGroup>
            </Flex>
        </Container>
    )
}

export default ChatLayout;
