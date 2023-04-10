import {useEffect, useRef} from 'react';

/**
 * Executes a callback on component mount.
 * Same as useEffect(() => callback(), []), but with a check to prevent multiple calls.
 * @param callback - The callback to execute. Can return an on unmount function.
 */
export default function OnMount(callback: () => (void | (() => void))): void {
  const isCalled = useRef(false);

  useEffect(() => {
    if (isCalled.current) return;
    isCalled.current = true;
    return callback();
  }, []);
}