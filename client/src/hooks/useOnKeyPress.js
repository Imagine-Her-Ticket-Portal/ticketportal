import { useEffect, useRef } from "react";

export const useOnKeyPress = (callback, targetKey) => {

    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    })

    useEffect(() => {

        const keyPressHandler = (event) => {
            if (event.key === targetKey) {
                event.preventDefault();
                //callback(); ? Simply calling callback doesn't work, gives error -> Login.jsx:78 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'preventDefault')
                callbackRef.current(event);
                //console.log("Key Pressed")
            }
        }

        document.addEventListener('keydown', keyPressHandler);
        return () => {
            document.removeEventListener('keydown', keyPressHandler);
        }
    }, [callbackRef.current, targetKey])
}

//Callback is the function we want to execute when the targetKey is pressed