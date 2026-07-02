import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useLogin } from "../hooks/use_login";

gsap.registerPlugin(Flip);

const getInitialBranchNumber = () => {
    const storedBranch = localStorage.getItem("branch");
    const branchNumber = storedBranch?.match(/^branch([1-9]|10)$/)?.[1];

    return branchNumber ? Number(branchNumber) : 1;
};

const LandingPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [shouldShowDropdown, setShouldShowDropdown] = useState(false);
    const [branchNumber, setBranchNumber] = useState(getInitialBranchNumber);
    const formRef = useRef<HTMLElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const login = useLogin();
    const branch = `branch${branchNumber}`;

    useEffect(() => {
        localStorage.setItem("branch", branch);
    }, [branch]);

    const removeInputSpaces = (event: FormEvent<HTMLInputElement>) => {
        event.currentTarget.value = event.currentTarget.value.replace(/\s/g, "");
    };

    const decreaseBranch = () => {
        setBranchNumber((current) => Math.max(1, current - 1));
    };

    const increaseBranch = () => {
        setBranchNumber((current) => Math.min(10, current + 1));
    };

    const openDropdown = () => {
        if (!formRef.current) return;

        const layoutState = Flip.getState(formRef.current.children);

        flushSync(() => {
            setShouldShowDropdown(true);
            setIsOpen(true);
        });

        Flip.from(layoutState, {
            duration: 0.45,
            ease: "power3.out",
            absolute: false,
            stagger: 0.02,
        });

        if (dropdownRef.current) {
            gsap.fromTo(
                dropdownRef.current,
                {
                    autoAlpha: 0,
                    y: -12,
                    scaleY: 0.96,
                    transformOrigin: "top center",
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    scaleY: 1,
                    duration: 0.35,
                    ease: "power3.out",
                },
            );
        }
    };

    const closeDropdown = () => {
        if (!dropdownRef.current) return;

        const dropdown = dropdownRef.current;
        gsap.killTweensOf(dropdown);

        gsap.to(dropdown, {
            autoAlpha: 0,
            y: -10,
            scaleY: 0.96,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
                const form = formRef.current;
                const layoutState = form ? Flip.getState(form.children) : null;
                const expandedHeight = form?.offsetHeight ?? 0;

                if (form) {
                    gsap.set(form, {
                        height: expandedHeight,
                        overflow: "visible",
                    });
                }

                flushSync(() => {
                    setShouldShowDropdown(false);
                    setIsOpen(false);
                });

                if (layoutState && form) {
                    gsap.set(form, { height: "auto" });
                    const compactHeight = form.offsetHeight;
                    gsap.set(form, { height: expandedHeight });
                    gsap.killTweensOf(form);

                    Flip.from(layoutState, {
                        duration: 0.45,
                        ease: "power3.out",
                        absolute: false,
                        stagger: 0.02,
                    });

                    gsap.to(form, {
                        height: compactHeight,
                        duration: 0.6,
                        delay: 0.28,
                        ease: "power2.inOut",
                        clearProps: "height,overflow",
                    });
                }
            },
        });
    };

    const handleDropdownToggle = () => {
        if (isOpen) {
            closeDropdown();
            return;
        }

        openDropdown();
    };

    const handleLogin = () => {
        const username = (document.getElementById("login-username") as HTMLInputElement).value;
        const password = (document.getElementById("login-password") as HTMLInputElement).value;
        const uuid = (document.getElementById("uuid") as HTMLInputElement | null)?.value;

        login.mutate({
            username,
            password,
            branch,
            ...(uuid ? { uuid } : {}),
        });
    };
    
    return (
        <div className="h-dvh w-full flex items-center justify-center">
            <main ref={formRef} className="box-border flex flex-col w-full max-w-100 rounded-2xl px-8 py-16 gap-4 login-shadow font-poppins select-none">
                <button onClick={handleDropdownToggle} className="self-end border px-6 py-2 rounded-full  ">option</button>
                {/* Dropdown content */}
                {
                    shouldShowDropdown && (
                        <div ref={dropdownRef} className=" border-gray-300 rounded-lg p-4 flex flex-col">
                            <label htmlFor="uuid" className="select-none mt-8 text-[gray]">uuid</label>
                            <input
                                type="text"
                                id="uuid"
                                spellCheck={false}
                                autoCorrect="off"
                                autoCapitalize="none"
                                onInput={removeInputSpaces}
                                className="outline-0 border-b border-black px-2 py-2 cursor-pointer"
                            />
                        </div>
                    )
                }
                <label htmlFor="login-username" className="select-none mt-8 text-[gray]">username</label>
                <input
                    type="text"
                    id="login-username"
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="none"
                    onInput={removeInputSpaces}
                    className="outline-0 border-b border-black px-2 py-2 cursor-pointer"
                />
                
                <label htmlFor="login-password" className="select-none text-[gray]">password</label>
                <input
                    type="password"
                    id="login-password"
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="none"
                    onInput={removeInputSpaces}
                    className="outline-0 cursor-pointer border-b border-black px-2 py-2"
                />

                <label className="select-none text-[gray]">branch</label>
                <div className="flex items-center justify-between gap-4 border-b border-black px-2 py-2">
                    <button
                        type="button"
                        className="cursor-pointer rounded-full border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={branchNumber === 1}
                        onClick={decreaseBranch}
                    >
                        -
                    </button>
                    <span className="min-w-20 text-center">{branch}</span>
                    <button
                        type="button"
                        className="cursor-pointer rounded-full border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={branchNumber === 10}
                        onClick={increaseBranch}
                    >
                        +
                    </button>
                </div>

                <button
                    className="cursor-pointer pt-8 disabled:cursor-not-allowed disabled:opacity-60 font-bold"
                    disabled={login.isPending}
                    onClick={handleLogin}
                >
                    {login.isPending ? "logging in..." : "login"}
                </button>

                {login.isError && (
                    <p className="text-sm text-red-500">{login.error.message}</p>
                )}
            </main>
        </div>
    );
};

export default LandingPage;
