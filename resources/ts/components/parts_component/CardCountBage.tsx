import { FC } from "react";

export const CardCountBage:FC<{value:any}> = ({value}) => {
    return(
        <>
            <span className="block w-fit h-fit bg-gray-600 text-white text-xs font-medium px-1.5 py-1.5 rounded-lg">
                {value}
            </span>
            <div className="flex w-20 h-hit py-1 items-center justify-center rounded-full bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z" />
                </svg>
                全カード : {value}枚
            </div>
        </>
    );
}
