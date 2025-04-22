import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
interface ReasonThinkingProps {
    thinkingResult: string;
}

const ReasonThinking = ({ thinkingResult }: ReasonThinkingProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-2 border-b border-neutral-200 dark:border-neutral-800 p-4"
            >
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
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
            </motion.div>
        </AnimatePresence>
    );
};

export default ReasonThinking;
