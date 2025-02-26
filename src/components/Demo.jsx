import { Text, Center, HStack } from "@chakra-ui/react"
import {useSelector} from "react-redux";

const Demo = () => {
    const username = useSelector(state => state.user.username);
    return (
        <Center flexDir="column" gap="8" minH="dvh">
            <HStack>
                <Text color="black"> Hello, {username}</Text>
            </HStack>
        </Center>
    )
}

export default Demo
