import { AspectRatio, Box, Flex, Image, Field, Input, Text, Button } from "@chakra-ui/react";
import image1Src from '@/assets/01.jpg';
import image2Src from '@/assets/02.jpg';
import styled from 'styled-components';
import {PasswordInput, PasswordStrengthMeter} from "@/components/ui/password-input.jsx";
import { useState } from 'react';
import {setReduxUsername} from "@/store/store.js";
import {useDispatch} from "react-redux";
import {toast} from "@/plugins/toast.js";
import {login} from "@/api/api.js";

const Container = styled.div`
    background-color: #fff;
    user-select: none;
    padding: 0 40px 0 40px;
    position: relative; /* 设置容器为相对定位 */
    height: 100vh; /* 设置容器高度为视口高度 */
`;

const StyledInput = styled(Input)`
    border: none;
    background-color: #fafafa;
    color: #3f3f46;

    &:hover {
        border: none;
    }

    &:focus {
        border: none;
    }
`;

const StyledPasswordInput = styled(PasswordInput)`
    border: none;
    background-color: #fafafa;
    color: #3f3f46;

    &:hover {
        border: none;
    }

    &:focus {
        border: none;
    }
`;

const FieldLabel = styled(Field.Label)`
    color: #71717a;
`

const LinkTip = styled(Text)`
    text-align: center;
    color: #71717a;
    font-size: 12px;
`

const AuthFrom = ({ onLogin }) => {
    const dispatch = useDispatch();
    const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and registration
    const [username, setUsername] = useState(''); // 本地状态管理 username
    const [email, setEmail] = useState(''); // State for email
    const [password, setPassword] = useState(''); // State for password
    const handleClick = async () => {
        dispatch(setReduxUsername(username));
        const fields = {"用户名": username, "密码": password };
        if (isRegistering) fields['邮箱'] = email

        const missingFields = Object.entries(fields)
            .filter(([, value]) => !value)
            .map(([key]) => key);

        const message = `${
            missingFields
                .slice(0, -1)
                .join('、')
        }${
            missingFields.length > 1 ? '和' : ''
        }${
            missingFields[missingFields.length - 1]
        }`;
        console.log(missingFields)
        if (missingFields.length !== 0) {
            await toast.warning(message + "不能为空！", { debounce: 2500, duration: 2000, closable: true});
            return;
        }

        await login(username, password)
        await toast.success("登录成功！");
        onLogin();
    };

    const toggleMode = () => {
        setIsRegistering(!isRegistering); // Toggle between login and registration
    };

    const imageSrc = isRegistering ? image1Src : image2Src; // Use image2Src for registration

    const strengthLv = (()=> {
        let strength = 1;
        // 长度检查
        if (password.length < 8) return strength;
        // 大写字母检查
        if (/[A-Z]/.test(password)) strength += 1;
        // 小写字母检查
        if (/[a-z]/.test(password)) strength += 1;
        // 数字检查
        if (/[0-9]/.test(password)) strength += 1;
        // 特殊字符检查
        if (/[\W_]/.test(password)) strength += 1;

        return strength;
    })();
    return (
        <Container>
            <Flex gap="3" direction="column">
                <Box>
                    <AspectRatio ratio={1}>
                        <Image src={imageSrc} alt="auth-image" objectFit="cover" />
                    </AspectRatio>
                </Box>
                <Box mt={isRegistering ? "0px" : "20px"} >
                    <Field.Root gap="10px">
                        {isRegistering ? (
                            <>
                                <FieldLabel> 用户名 </FieldLabel>
                                <StyledInput
                                    placeholder="用户名"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                    }}
                                />
                                <FieldLabel> 邮箱 </FieldLabel>
                                <StyledInput
                                    placeholder="hhyufan@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <FieldLabel> 密码 </FieldLabel>
                                <StyledPasswordInput
                                    placeholder="••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {password.length > 0 && <PasswordStrengthMeter minW="100%" value={strengthLv} />}
                            </>
                        ) : (
                            <>
                                <FieldLabel> 用户名 / 邮箱 </FieldLabel>
                                <StyledInput
                                    placeholder="hhyufan | hhyufan@gmail.com"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <FieldLabel> 密码 </FieldLabel>
                                <StyledPasswordInput
                                    placeholder="••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </>
                        )}
                    </Field.Root>
                </Box>
                <Box mt={isRegistering ? "0px" : "40px"}>
                    <LinkTip onClick={toggleMode}>
                        {isRegistering ? "已有账号？去登录" : "没有账号？去注册"}
                    </LinkTip>
                    <Button
                        onClick={handleClick}
                        mt="10px"
                        size="sm" // 设置按钮大小
                        rounded="lg"
                        color="#fff"
                        backgroundColor={isRegistering ? "#cd90f0" : "#ffb600"}// 设置背景颜色
                        width="100%" // 按钮宽度填满父容器
                    >
                        {isRegistering ? "注册" : "登录"}
                    </Button>
                </Box>
            </Flex>
        </Container>
    );
}

export default AuthFrom;
