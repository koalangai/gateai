import "react";
import React, {useEffect, useState} from "react";
import FormLabel from "@mui/joy/FormLabel";
import Select, {SelectStaticProps} from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import FormControl from "@mui/joy/FormControl";
import IconButton from "@mui/joy/IconButton";
import {CloseRounded} from "@mui/icons-material";

interface FilterProps {
    title: string;
    getItems: () => Promise<{ id: string, title: string }[]>;
    onSelected: (id: string | string[] | null) => void;
}

export default function Filter(props: FilterProps) {
    const [values, setValues] = useState<{ id: string, title: string }[]>([]);
    const [value, setValue] = useState<string | null>(null);
    const action: SelectStaticProps['action'] = React.useRef(null);

    useEffect(() => {
        const f = async () => {
            setValues(await props.getItems());
        };
        f();
    }, []);

    return <FormControl size="sm">
        <FormLabel>{props.title}</FormLabel>
        <Select
            action={action}
            value={value}
            onChange={(_, newValue) => {
                setValue(newValue);
                props.onSelected(newValue);
            }}
            size="sm"
            placeholder="All"
            {...(value && {
                // display the button and remove select indicator
                // when user has selected a value
                endDecorator: (
                    <IconButton
                        variant="plain"
                        color="neutral"
                        onMouseDown={(event) => {
                            // don't open the popup when clicking on this button
                            event.stopPropagation();
                        }}
                        onClick={() => {
                            setValue(null);
                            props.onSelected(null);
                            action.current?.focusVisible();
                        }}
                    >
                        <CloseRounded/>
                    </IconButton>
                ),
                indicator: null,
            })}>
            {
                values.map((item) => <Option key={item.id} value={item.id}>{item.title}</Option>)
            }
        </Select>
    </FormControl>;
}