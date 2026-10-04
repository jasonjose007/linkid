import { renderHook, act } from "@testing-library/react";
import useDebounce from "./useDebounce";

describe("useDebounce", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("does not call fn immediately", () => {
        const fn = jest.fn();
        const { result } = renderHook(() => useDebounce(fn, 300));
        act(() => { result.current(); });
        expect(fn).not.toHaveBeenCalled();
    });

    it("calls fn after the wait period", () => {
        const fn = jest.fn();
        const { result } = renderHook(() => useDebounce(fn, 300));
        act(() => { result.current(); });
        act(() => { jest.advanceTimersByTime(300); });
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("resets timer on rapid successive calls", () => {
        const fn = jest.fn();
        const { result } = renderHook(() => useDebounce(fn, 300));
        act(() => {
            result.current();
            jest.advanceTimersByTime(100);
            result.current();
            jest.advanceTimersByTime(100);
            result.current();
        });
        act(() => { jest.advanceTimersByTime(300); });
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("passes arguments to the debounced function", () => {
        const fn = jest.fn();
        const { result } = renderHook(() => useDebounce<[string, number]>(fn, 100));
        act(() => { result.current("hello", 42); });
        act(() => { jest.advanceTimersByTime(100); });
        expect(fn).toHaveBeenCalledWith("hello", 42);
    });

    it("uses default wait of 300ms when not specified", () => {
        const fn = jest.fn();
        const { result } = renderHook(() => useDebounce(fn));
        act(() => { result.current(); });
        act(() => { jest.advanceTimersByTime(299); });
        expect(fn).not.toHaveBeenCalled();
        act(() => { jest.advanceTimersByTime(1); });
        expect(fn).toHaveBeenCalledTimes(1);
    });
});
