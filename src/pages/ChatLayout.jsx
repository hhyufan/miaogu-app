import {
    Flex,
    Box,
    Text,
    Image,
    Input,
    Slider,
    IconButton, useSlider
} from "@chakra-ui/react";
import styled from "styled-components";
import {useEffect, useRef, useState} from "react";
import {InputGroup} from "@/components/ui/input-group.jsx";
import {IoIosSend} from "react-icons/io";
import MarkdownRenderer from "@/components/MarkdownRenderer.jsx";
import {clearChatMsg, getChatMsg, logout, rollbackChatMsg, sendChatMessage} from "@/api/api.js";
import chat3Avatar from "@/assets/head_portrait1.png";
import chat4Avatar from "@/assets/head_portrait2.png";
import DeepSeekAvatar from "@/assets/head_portrait3.jpg"
import {toast} from "@/plugins/toast.js";

import {LuAlignRight, LuChevronLeft, LuArchiveRestore, LuTrash2, LuBotMessageSquare, LuZap} from "react-icons/lu";
import {Cell, Dialog, Loading, Popover} from "react-vant";
import {formatLocaleTime, formatTime} from "@/util/dateUtil.js";
import {persistor, resetState, setCurrentModel, setSelectedColor} from "@/store/store.js";
import {useDispatch, useSelector} from "react-redux";
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
// "#9c81ed" - 默认选中颜色

const ChatLayout = () => {
    const [messages, setMessages] = useState([])
    const slider = useSlider({
        defaultValue: [0],
        thumbAlignment: "center",
    })
    const [visible, setVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch(); // 获取 dispatch 函数
    
    // 从Redux获取当前模型信息
    const currentModel = useSelector((state) => state['chatModel']);
    const selectedColor = useSelector((state) => state['chatModel']['selectedColor']);
    const refreshMsgs = () => {
        setLoading(false)
        getChatMsg(currentModel.id, {}).then(
            (res) => {
                setMessages(res.data)
            }
        );
    }
    const select = (option) => {
        if (currentModel.id !== option.id) {
            // 更新Redux中的模型信息
            dispatch(setCurrentModel({
                id: option.id,
                avatar: option.avatar,
                detail: option.detail
            }));
            
            refreshMsgs()
            const newSelectedColor = option.color === "#333333" ? '#9c81ed' : '#333333';
            dispatch(setSelectedColor(newSelectedColor));
            
            // 更新本地UI状态
            iconActions.forEach((action) => {
                action.color = action.text === option.text ? newSelectedColor : '#333333';
            });
        }
    };

// Method to rollback chat messages
    const rollbackChat = async () => {
        await Dialog.confirm({
            title: '回滚聊天记录',
            message: '确定要回滚到上次保存的聊天记录吗？此操作不可逆。',
        })
            .then(async () => {
                try {
                    const response = await rollbackChatMsg();
                    // console.log("???" +JSON.stringify(response))
                    if (response.code === 200) {
                        refreshMsgs()
                        await toast.success("成功恢复聊天记录！", { closable: true });
                    } else if (response.code === 404){
                        await toast.warning("无历史版本！", { closable: true });
                    } else {
                        await toast.error("回滚消息失败！");
                    }
                } catch (error) {
                    await toast.error("回滚过程中发生错误");
                    console.error("Rollback error:", error);
                }
            })
            .catch(async () => {
                await toast.warning("操作已取消", { closable: true });
            })
    };

// Method to clear chat messages
    const clearChat = async () => {
        await Dialog.confirm({
                title: '删除聊天记录',
                message: '您确定要删除所有聊天记录吗？此操作不可逆。',
        }).then(async () => {
            clearChatMsg()
                .then(async response => {
                    if (response.code === 204) {
                        refreshMsgs()
                        await toast.success("聊天记录已清空", {closable: true});
                    } else {
                        await toast.error("清空聊天记录失败！");
                    }
                })
                .catch(async error => {
                    await toast.error("清空聊天记录时发生错误！", error);
                });
        }).catch(async () => await toast.warning("操作已取消", {closable: true}))
    };

    const exit = async () => {
        await Dialog.confirm({
            title: '退出登录',
            message: '您确定要退出当前账号？',
        }).then(async () => {
            logout()
                .then(async response => {
                    if (response.code === 200) {
                        await toast.success("退出账号成功");
                        // 分发重置Action，清空内存中的状态
                        setTimeout(() => {
                            dispatch(resetState());
                            // 清除持久化存储，确保下次加载时初始状态生效
                            persistor.purge();
                            window.location.href = "/"
                        }, 1500);
                    }
                })
                .catch(async error => {
                    await toast.error("退出账号时发生错误！", error);
                });
        }).catch(async () => await toast.warning("操作已取消", {closable: true}))
    };

    useEffect(() => {
        // 初始化iconActions的颜色状态
        const currentModelId = currentModel.id;
        iconActions.forEach((action) => {
            action.color = action.id === currentModelId ? selectedColor : '#333333';
        });
        
        // 获取聊天消息
        getChatMsg(currentModel.id, {}).then(
            (res) => {
                setMessages(res.data)
            }
        );

    }, [currentModel.id, selectedColor]);
    // 时间格式化函数
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
        setLoading(true)
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
        await scrollToBottom();
        let charIndex = 0;
        await sendChatMessage(newMessage, currentModel.id)
            .then(response => {
                if (response.code === 200) {
                    scrollToBottom();
                    setLoading(false)
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
                    }, +slider.value); // 调整每个字符的显示速度
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
                    <IconButton onClick={exit} fontSize="24px" color="black" backgroundColor="#F8F9FA">
                        <LuChevronLeft/>
                    </IconButton>
                </Box>
                <Popover
                    style={{
                        zIndex: 10
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
                        <Cell value='清理记录' onClick={clearChat} icon={<LuTrash2 />}/>
                        <Cell value='还原记录' onClick={rollbackChat} icon={<LuArchiveRestore/>}/>
                        <Cell icon={<LuZap/>} value={
                            <Slider.RootProvider colorPalette="purple" value={slider} width="80px" pl="10px" pr="10px">
                                <Slider.Control >
                                    <Slider.Track>
                                        <Slider.Range />
                                    </Slider.Track>
                                    <Slider.Thumb index={0} style={{fontSize: '6px',  borderRadius: "30%", backgroundColor:"#b7a6ea"}}>
                                        <Slider.HiddenInput />
                                        {slider.value}ms
                                    </Slider.Thumb>
                                </Slider.Control>
                            </Slider.RootProvider>
                        }/>
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
                                    {
                                        (loading && (+index + 1 === messages.length)) ? (
                                            <Flex
                                                justify="center"
                                                align="center"
                                            >
                                                <Loading type="ball" />
                                            </Flex>
                                        ) : (
                                            <MarkdownRenderer
                                                fontSize="12px"
                                                content={msg.content}
                                            />
                                        )
                                    }
                                </Box>
                                {msg.role === "assistant" || msg.role === "AI" ? (<Text mt={1} fontSize="10px" color="gray">
                                    {currentModel.detail}&nbsp;&nbsp;&nbsp;{formatLocaleTime(msg.time)}
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
