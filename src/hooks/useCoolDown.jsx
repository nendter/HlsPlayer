import {useRef} from "react";

export function useCoolDown(timeout, cb) {

    const timeoutRef = useRef(undefined);
    return () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            cb();
        }, timeout);
    }
}