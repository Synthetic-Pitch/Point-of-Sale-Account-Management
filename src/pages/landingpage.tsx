const LandingPage = () => {
    return (
        <main className="flex min-h-screen items-center justify-center bg-white px-6 py-10 font-poppins">
            <div className="flex min-h-[410px] w-full max-w-[330px] flex-col justify-center rounded-tr-[22px] rounded-br-[14px] rounded-bl-[14px] bg-white px-7 py-10 shadow-[7px_7px_8px_rgba(0,0,0,0.24)]">
                <label className="mb-12 block">
                    <span className="mb-5 block text-[13px] font-medium tracking-normal text-black">
                        USERNAME
                    </span>
                    <input
                        className="h-8 w-full border-0 border-b border-[#bfc0c3] bg-transparent px-0 text-[17px] text-black outline-none transition-colors focus:border-[#ff7043]"
                    />
                </label>

                <label className="mb-8 block">
                    <span className="mb-5 block text-[13px] font-medium tracking-normal text-black">
                        PASSWORD
                    </span>
                    <input
                        type="password"
                        className="h-8 w-full border-0 border-b border-[#bfc0c3] bg-transparent px-0 text-[17px] text-black outline-none transition-colors focus:border-[#ff7043]"
                    />
                </label>

                <div className="mb-8 flex items-center justify-center gap-6">
                    <button
                        type="button"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#aeb0b5] text-[22px] font-bold leading-none text-white"
                        aria-label="Decrease branch"
                    >
                        -
                    </button>
                    <div className="min-w-[100px] text-center text-[23px] font-normal text-black">
                        branch1
                    </div>
                    <button
                        type="button"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#aeb0b5] text-[22px] font-bold leading-none text-white"
                        aria-label="Increase branch"
                    >
                        +
                    </button>
                </div>

                <div className="mx-auto text-[27px] font-extrabold tracking-normal text-[#ff7043]">
                    LOGIN
                </div>
            </div>
        </main>
    );
};

export default LandingPage;
