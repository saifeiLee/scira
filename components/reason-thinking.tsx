import React, { useState } from 'react';

interface ReasonThinkingProps {
    thinkingResult: string;
}

const ReasonThinking = ({ thinkingResult }: ReasonThinkingProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className='flex flex-col gap-2 border-b border-neutral-200 dark:border-neutral-800 p-4'>
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">思考过程</h3>
                <button className="text-neutral-500 dark:text-neutral-400">
                    {isCollapsed ? '展开 ▼' : '收起 ▲'}
                </button>
            </div>
            {!isCollapsed && (
                <p className="text-neutral-500 dark:text-neutral-400 text-sm whitespace-pre-wrap">
                    {thinkingResult}
                </p>
            )}
        </div>
    );
}

export default ReasonThinking;