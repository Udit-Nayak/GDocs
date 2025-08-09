import { useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const markers = Array.from({ length: 83 }, (_, i) => i);

export const Ruler = () => {
    const [leftMargin, setLeftMargin] = useState(56);
    const [rightMargin, setRightMargin] = useState(56);
    const [isDraggingLeft, setIsDraggingLeft] = useState(false);
    const [isDraggingRight, setIsDraggingRight] = useState(false);

    const rulerRef = useRef<HTMLDivElement>(null);
    
    const handleMouseDownLeft = () => {
        setIsDraggingLeft(true);    
    };
    
    const handleMouseDownRight = () => {
        setIsDraggingRight(true);
    };
    
    const handleMouseMove = (e: React.MouseEvent) => {
        if((isDraggingLeft || isDraggingRight) && rulerRef.current) {
            const container = rulerRef.current.querySelector("#ruler-container");
            if(container){
                const containerRect = container.getBoundingClientRect();
                const relativeX = e.clientX - containerRect.left;
                const rawPosition = Math.max(0, Math.min(816, relativeX));
                
                if(isDraggingLeft){
                    const maxLeftPosition = 816 - rightMargin - 100;
                    const newLeftPosition = Math.min(rawPosition, maxLeftPosition);
                    setLeftMargin(newLeftPosition);
                }
                else if(isDraggingRight){
                    const maxRightPosition = 816 - (leftMargin + 100);
                    const newRightPosition = Math.max(816 - rawPosition, 0);
                    const constrainedRightPosition = Math.min(newRightPosition, maxRightPosition);
                    setRightMargin(constrainedRightPosition);
                }
            }
        }
    }

    const handleMouseUp = () => {
        setIsDraggingLeft(false);
        setIsDraggingRight(false);
    };

    const handleDoubleClickLeft = () => {
        setLeftMargin(56);
    }

    const handleDoubleClickRight = () => {
        setRightMargin(56);
    }

    return (
        <div 
            ref={rulerRef} 
            onMouseMove={handleMouseMove} 
            onMouseUp={handleMouseUp} 
            onMouseLeave={handleMouseUp} 
            className="h-6 border-b border-gray-300 flex items-end relative select-none print:hidden"
        >
            <div
                id="ruler-container"
                className="max-w-[816px] mx-auto w-full h-full relative"
            >
                {/* Ruler markers */}
                <div className="absolute inset-x-0 bottom-0 h-full">
                    <div className="relative h-full w-[816px]">
                        {markers.map((marker) => {
                            const position = (marker * 816) / 82;

                            return (
                                <div
                                    key={marker}
                                    className="absolute bottom-0"
                                    style={{ left: `${position}px` }}
                                >
                                    {marker % 10 === 0 && (
                                        <>
                                            <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500" />
                                            <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                                                {marker / 10 + 1}
                                            </span>
                                        </>
                                    )}
                                    {marker % 5 === 0 && marker % 10 !== 0 && (
                                        <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500" />
                                    )}
                                    {marker % 5 !== 0 && (
                                        <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* Margin markers */}
                <Marker
                    position={leftMargin}
                    isLeft={true}
                    isDragging={isDraggingLeft}
                    onMouseDown={handleMouseDownLeft}
                    onDoubleClick={handleDoubleClickLeft}
                />
                <Marker
                    position={rightMargin}
                    isLeft={false}
                    isDragging={isDraggingRight}
                    onMouseDown={handleMouseDownRight}
                    onDoubleClick={handleDoubleClickRight}
                />
            </div>
        </div>
    );
};

interface MarkerProps {
    isLeft: boolean;
    isDragging: boolean;
    position: number;
    onMouseDown: () => void;
    onDoubleClick: () => void;
}

const Marker = ({
    position,
    isLeft,
    isDragging,
    onMouseDown,
    onDoubleClick,
}: MarkerProps) => {
    // Calculate the actual left position for both markers
    const leftPosition = isLeft ? position : (816 - position);
    
    return (
        <>
            {/* Marker triangle */}
            <div
                className="absolute top-0 cursor-ew-resize z-[5] group"
                style={{ 
                    left: `${leftPosition}px`,
                    transform: "translateX(-50%)",
                    width: "16px",
                    height: "100%"
                }}
                onMouseDown={onMouseDown}
                onDoubleClick={onDoubleClick}
            >
                <FaCaretDown 
                    className="absolute left-1/2 top-0 h-full fill-blue-500" 
                    style={{ transform: "translateX(-50%)" }}
                />
            </div>
            
            {/* Drag line */}
            {isDragging && (
                <div
                    className="absolute top-6 pointer-events-none z-[4]"
                    style={{
                        left: `${leftPosition}px`,
                        transform: "translateX(-50%)",
                        height: "100vh",
                        width: "1px",
                        backgroundColor: "#3b72f6",
                    }}
                />
            )}
        </>
    );
};