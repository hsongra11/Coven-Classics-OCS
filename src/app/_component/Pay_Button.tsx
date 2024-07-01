interface BtnProps {
  buttonText: string,
  isDisabled?: boolean,
  onClick?: () => void
}

export default function Pay_Button({ buttonText, onClick, isDisabled = false }: BtnProps) {

  return (
    <>
      <div
        className={`w-60 flex items-center justify-center cursor-pointer ${isDisabled ? 'cursor-not-allowed' : ''}`}
        onClick={isDisabled ? undefined : onClick}
      >
        <div className={`h-14 w-full rounded-full bg-gradient-to-r to-[#2E2E2E] via-[#2A2A2A] from-[#ECECEC] p-[1px] ${!isDisabled ? 'hover:bg-gradient-to-l' : ''}`}>
          <div className="flex h-full w-full rounded-full items-center justify-center bg-[#181818] px-6 lg:px-7">
            <h1 className="font-[Longevity] text-sm lg:text-2xl font-black text-white text-nowrap">{buttonText}</h1>
          </div>
        </div>
      </div>
    </>
  )
}