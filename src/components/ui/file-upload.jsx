"use client";

import { ButtonProps, RecipeProps } from "@chakra-ui/react";
import {
    Button,
    FileUpload as ChakraFileUpload,
    Icon,
    IconButton,
    Span,
    Text,
    useFileUploadContext,
    useRecipe,
} from "@chakra-ui/react";
import * as React from "react";
import { LuFile, LuUpload, LuX } from "react-icons/lu";

export const FileUploadRoot = React.forwardRef(function FileUploadRoot(props, ref) {
    const { children, inputProps, ...rest } = props;
    return (
        <ChakraFileUpload.Root {...rest}>
            <ChakraFileUpload.HiddenInput ref={ref} {...inputProps} />
            {children}
        </ChakraFileUpload.Root>
    );
});

export const FileUploadDropzone = React.forwardRef(function FileUploadDropzone(props, ref) {
    const { children, label, description, ...rest } = props;
    return (
        <ChakraFileUpload.Dropzone ref={ref} {...rest}>
            <Icon fontSize="xl" color="fg.muted">
                <LuUpload />
            </Icon>
            <ChakraFileUpload.DropzoneContent>
                <div>{label}</div>
                {description && <Text color="fg.muted">{description}</Text>}
            </ChakraFileUpload.DropzoneContent>
            {children}
        </ChakraFileUpload.Dropzone>
    );
});

// Other components omitted for brevity
