export default function MoveButtons(){
    return(
        <div className="absolute t-0 flex items-center justify-center flex-col h-full w-full">
            <div 
                className="h-[50px] w-[150px] bg-secondary rounded-2xl flex items-center justify-center mb-5 text-lg border ">
            Fast upload
            </div>
            <div className="h-[50px] w-[150px] bg-secondary rounded-2xl flex items-center justify-center mb-5 text-lg border">
            Smoth Playback
            </div>
            <div className="h-[50px] w-[150px] bg-secondary rounded-2xl flex items-center justify-center mb-5 text-lg border">
            Total Freedom
            </div>
            <div className="h-[50px] w-[150px] bg-secondary rounded-2xl flex items-center justify-center text-lg border">
            File Access
            </div>
        </div>
    )
}