import React, { useRef } from 'react';
import Draggable from 'react-draggable';

export const StandardModalWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const nodeRef = useRef(null);
    return (
        <Draggable nodeRef={nodeRef} handle=".modal-handle">
            <div ref={nodeRef} className={`relative ${className}`} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </Draggable>
    );
};
