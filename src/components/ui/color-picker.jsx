
import {
    ColorPicker as ChakraColorPicker,
    IconButton,
    Portal,
    Stack,
} from "@chakra-ui/react";
import * as React from "react";
import { LuCheck, LuPipette } from "react-icons/lu";

export const ColorPickerTrigger = React.forwardRef(function ColorPickerTrigger(props, ref) {
    const { fitContent, ...rest } = props;
    return (
        <ChakraColorPicker.Trigger
            data-fit-content={fitContent || undefined}
            ref={ref}
            {...rest}
        >
            {props.children || <ChakraColorPicker.ValueSwatch />}
        </ChakraColorPicker.Trigger>
    );
});

export const ColorPickerInput = React.forwardRef(function ColorHexInput(props, ref) {
    return <ChakraColorPicker.ChannelInput channel="hex" ref={ref} {...props} />;
});

export const ColorPickerContent = React.forwardRef(function ColorPickerContent(props, ref) {
    const { portalled = true, portalRef, ...rest } = props;
    return (
        <Portal disabled={!portalled} container={portalRef}>
            <ChakraColorPicker.Positioner>
                <ChakraColorPicker.Content ref={ref} {...rest} />
            </ChakraColorPicker.Positioner>
        </Portal>
    );
});

export const ColorPickerInlineContent = React.forwardRef(function ColorPickerInlineContent(props, ref) {
    return (
        <ChakraColorPicker.Content
            animation="none"
            shadow="none"
            padding="0"
            ref={ref}
            {...props}
        />
    );
});

export const ColorPickerSliders = React.forwardRef(function ColorPickerSliders(props, ref) {
    return (
        <Stack gap="1" flex="1" px="1" ref={ref} {...props}>
            <ColorPickerChannelSlider channel="hue" />
            <ColorPickerChannelSlider channel="alpha" />
        </Stack>
    );
});

export const ColorPickerArea = React.forwardRef(function ColorPickerArea(props, ref) {
    return (
        <ChakraColorPicker.Area ref={ref} {...props}>
            <ChakraColorPicker.AreaBackground />
            <ChakraColorPicker.AreaThumb />
        </ChakraColorPicker.Area>
    );
});

export const ColorPickerEyeDropper = React.forwardRef(function ColorPickerEyeDropper(props, ref) {
    return (
        <ChakraColorPicker.EyeDropperTrigger asChild>
            <IconButton size="xs" variant="outline" ref={ref} {...props}>
                <LuPipette />
            </IconButton>
        </ChakraColorPicker.EyeDropperTrigger>
    );
});

export const ColorPickerChannelSlider = React.forwardRef(function ColorPickerSlider(props, ref) {
    return (
        <ChakraColorPicker.ChannelSlider ref={ref} {...props}>
            <ChakraColorPicker.TransparencyGrid size="0.6rem" />
            <ChakraColorPicker.ChannelSliderTrack />
            <ChakraColorPicker.ChannelSliderThumb />
        </ChakraColorPicker.ChannelSlider>
    );
});

export const ColorPickerSwatchTrigger = React.forwardRef(function ColorPickerSwatchTrigger(props, ref) {
    const { swatchSize, children, ...rest } = props;
    return (
        <ChakraColorPicker.SwatchTrigger
            ref={ref}
            style={{"--color": props.value }}
            {...rest}
        >
            {children || (
                <ChakraColorPicker.Swatch boxSize={swatchSize} value={props.value}>
                    <ChakraColorPicker.SwatchIndicator>
                        <LuCheck />
                    </ChakraColorPicker.SwatchIndicator>
                </ChakraColorPicker.Swatch>
            )}
        </ChakraColorPicker.SwatchTrigger>
    );
});

export const ColorPickerRoot = React.forwardRef(function ColorPickerRoot(props, ref) {
    return (
        <ChakraColorPicker.Root ref={ref} {...props}>
            {props.children}
            <ChakraColorPicker.HiddenInput tabIndex={-1} />
        </ChakraColorPicker.Root>
    );
});
