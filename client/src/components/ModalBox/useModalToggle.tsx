import { useState } from "react";

export default function useModalToggle() {
    const [isOpen, setisOpen] = useState(false);

    const toggle = () => {
        setisOpen(!isOpen);
    };

    return {
        isOpen,
        toggle
    };
}
