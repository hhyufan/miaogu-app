import {Flex, Box, Text, Image, Input} from "@chakra-ui/react";
import styled from "styled-components";
import {useEffect, useRef, useState} from "react";
import {InputGroup} from "@/components/ui/input-group.jsx";
import {IoIosSend} from "react-icons/io";
import MarkdownRenderer from "@/components/MarkdownRenderer.jsx";
import {getChatMsg, sendChatMessage} from "@/api/api.js";
import chat4Avatar from "@/assets/head_portrait2.png";
import {toast} from "@/plugins/toast.js";
const Container = styled.div`
    background-color: #F1F5FB;
    user-select: none;
    position: relative; /* 设置容器为相对定位 */
    height: 100vh; /* 设置容器高度为视口高度 */
`;



const ChatLayout = () => {
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);
    useEffect(() => {
        // 模拟 API 请求
        getChatMsg("1003", {}).then(
            (res) => {
                setMessages(res.data)
            }
        );

    }, []);
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
    const handleSend = async () => {
        if (!inputValue.trim()) return;
        // 添加用户消息（带唯一 id）
        const newMessage = {
            time: formatTime(new Date()),
            content: inputValue,
            role: "user"
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue("");

        // 添加 AI 的初始消息（带唯一 id）
        const aiTempId = Date.now() + 1;
        const aiResponse = {
            id: aiTempId,
            time: formatTime(new Date()),
            content: "", // 初始为空内容
            role: "assistant",
            username: "AI"
        };
        setMessages(prev => [...prev, aiResponse]);

        let charIndex = 0;
        await sendChatMessage(newMessage, "1003")
            .then(response => {
                if (response.code === 200) {
                    const responseText = response.data;
                    const typingInterval = setInterval(() => {
                        if (charIndex < responseText.length) {
                            setMessages(prev => prev.map(msg => {
                                if (msg.id === aiTempId) {
                                    return {
                                        ...msg,
                                        content: responseText.slice(0, charIndex + 1)
                                    };
                                }
                                return msg;
                            }));
                            charIndex++;
                        } else {
                            clearInterval(typingInterval);
                        }
                    }, 50); // 调整每个字符的显示速度
                } else {
                    toast.error("发送消息失败！", { error: response['msg'] });
                }


            })

    };

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            await handleSend();
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
                    maxW="100vw"
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
                        <Flex justify={msg.role === "assistant" || msg.role === "AI" ? "flex-start" : "flex-end"} key={index}
                              marginBottom="5"> {/* 设置每行之间的间距 */}
                            {msg.role === "assistant" || msg.role === "AI" ? (<Image
                                src= {chat4Avatar}
                                w="31px"
                                h="31px"
                            />) : ""}
                            <Box
                                ml={3}

                            >
                                <Box
                                    maxWidth="85vw"
                                    px={4}
                                    py={3}
                                    bg={msg.role === "assistant" || msg.role === "AI" ?
                                        "#ffffff" :
                                        "#d786f7"
                                    }
                                    borderRadius={msg.role === "assistant" || msg.role === "AI" ?
                                        "0 12px 12px 12px " :
                                        "12px 0 12px 12px "
                                    }

                                >
                                    <MarkdownRenderer
                                        fontSize="12px"
                                        content={msg.content} />
                                </Box>
                                {msg.role === "assistant" || msg.role === "AI" ? (<Text mt={1} fontSize="10px" color="gray">
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
