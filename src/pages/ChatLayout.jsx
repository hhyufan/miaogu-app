import {
    Flex,
    Box,
    Text,
    Image,
    Input,
    IconButton
} from "@chakra-ui/react";
import styled from "styled-components";
import {useEffect, useRef, useState} from "react";
import {InputGroup} from "@/components/ui/input-group.jsx";
import {IoIosSend} from "react-icons/io";
import MarkdownRenderer from "@/components/MarkdownRenderer.jsx";
import {getChatMsg, sendChatMessage} from "@/api/api.js";
import chat3Avatar from "@/assets/head_portrait1.png";
import chat4Avatar from "@/assets/head_portrait2.png";
import DeepSeekAvatar from "@/assets/head_portrait3.jpg"
import {toast} from "@/plugins/toast.js";
import {LuAlignRight, LuChevronLeft, LuArchiveRestore, LuTrash2, LuBotMessageSquare} from "react-icons/lu";
import {Cell, Popover} from "react-vant";
const Container = styled.div`
    background-color: #F1F5FB;
    user-select: none;
    padding: 0 10px 0 10px;
    height: 100%; /* 设置容器高度为视口高度 */
`;
const iconActions = [
    {
        id: "1002",
        text: 'Chat 3.5',
        detail: 'gpt-3.5-turbo',
        avatar: chat3Avatar,
        icon: <img width="26" height="26" src="https://img.icons8.com/ios/50/chatgpt.png" alt="chatgpt"/>,
        color: '#333333'
    },
    {
        id: "1003",
        text: 'Chat 4',
        detail: 'gpt-4o-mini',
        avatar: chat4Avatar,
        icon: <img width="28" height="28" src="https://img.icons8.com/nolan/64/chatgpt.png"
                                  alt="chatgpt"/>,
        color: '#333333'
    },
    {
        id: "1004",
        text: 'DeepSeek',
        detail: 'deepseek-chat v3',
        avatar: DeepSeekAvatar,
        icon: <img width="23" height="23" src="https://img.icons8.com/color/48/deepseek.png" alt="deepseek"/>,
        color: '#333333'
    },
]
const currentModel = {
    id: "1002",
    avatar: chat3Avatar,
    detail: 'gpt-3.5-turbo'
}
// "#9c81ed"
const ChatLayout = () => {
    const [messages, setMessages] = useState([])
    const [visible, setVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);
    const select = (option) => {
        if (currentModel.id !== option.id) {
            currentModel.id = option.id;
            currentModel.avatar = option.avatar
            currentModel.detail = option.detail
            getChatMsg(currentModel.id, {}).then(
                (res) => {
                    setMessages(res.data)
                }
            );
            const selectedColor = option.color === "#333333" ? '#9c81ed' : '#333333';
            iconActions.forEach((action) => {
                action.color = action.text === option.text ? selectedColor : '#333333';
            });
        }
    };

    useEffect(() => {
        // 模拟 API 请求
        getChatMsg(currentModel.id, {}).then(
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
    const formatLocaleTime = (isoString) => {
        const date = new Date(isoString);
        date.setHours(date.getHours() - 8);
        // 获取年份、月份和日期
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
        const day = String(date.getDate()).padStart(2, '0');

        // 获取小时和分钟
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // 格式化为 yyyy/mm/dd hh:mm
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }
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
        if (!inputValue.trim()) {
            await toast.warning("消息不能为空！", {closable: true, duration: 2000, debounce: 2500})
            return;
        }
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
        await sendChatMessage(newMessage, currentModel.id)
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
            <Flex
                justify="space-between"
                align="center"
                backgroundColor="#F8F9FA"
                height="50px"
                width="100%"
                borderBottom= "0.05em solid #cfcfd3"
                position="fixed"
                top="0px"
                left="0"
                right="0"
                zIndex="2"
            >
                <Box>
                    <IconButton onClick={() => toast.warning("功能开发中~")} fontSize="24px" color="black" backgroundColor="#F8F9FA">
                        <LuChevronLeft/>
                    </IconButton>
                </Box>
                <Popover
                    style={{
                        zIndex: 10000
                    }}
                    onClosed={() => setVisible(false)}
                    placement="bottom-end"
                    reference={<IconButton
                        backgroundColor="#F8F9FA"
                        color="black"
                        aria-label="更多操作"
                    >
                        <LuAlignRight/>
                    </IconButton>}
                >
                    <Cell.Group card>
                        <Popover
                            onSelect={select}
                            visible={visible}
                            actions={iconActions}
                            placement="left-start"
                            reference={<Cell onClick={() => setVisible(!visible)} value='当前模型' icon={<LuBotMessageSquare/>}/>}
                        >
                        </Popover>
                        <Cell value='清理记录' onClick={() => toast.warning("功能开发中~")} icon={<LuTrash2 />}/>
                        <Cell value='还原记录' onClick={() => toast.warning("功能开发中~")} icon={<LuArchiveRestore/>}/>
                    </Cell.Group>
                </Popover>
            </Flex>

                <Box
                    maxH="calc(100% - 100px)"
                    ref={scrollContainerRef}
                    overflowY="auto"
                    overflowX="hidden"
                    boxSizing="border-box"
                    mt="50px"
                    mb="50px"
                    css={{
                        '&::-webkit-scrollbar': { display: 'none' },
                        '&': {
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none',
                        },
                    }}
                    pt="40px"
                >
                    {messages.map((msg, index) => (
                        <Flex justify={msg.role === "assistant" || msg.role === "AI" ? "flex-start" : "flex-end"} key={index}
                              marginBottom="5"> {/* 设置每行之间的间距 */}
                            {msg.role === "assistant" || msg.role === "AI" ? (<Image
                                src= {currentModel.avatar}
                                borderRadius="full"
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
                                    {currentModel.detail}&nbsp;&nbsp;{formatLocaleTime(msg.time)}
                                </Text>) : ""}
                            </Box>
                        </Flex>
                    ))}
                    <div ref={messagesEndRef}/>
                </Box>
                <Flex
                    h="50px"
                    left="0"
                    right="0"
                    bg="#fff"
                    alignItems="center"  // 垂直方向居中
                    bottom="0px"     // 直接修改定位距离
                    position="fixed"   // 添加定位
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
