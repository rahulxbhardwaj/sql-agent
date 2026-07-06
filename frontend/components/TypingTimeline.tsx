'use client';

import { motion } from "framer-motion";

interface Props {
    steps: string[];
}

export default function ThinkingTimeline({
    steps,
}: Props) {

    return (

        <div className="space-y-3">

            {steps.map((step, index) => {

                const isCurrent = index === steps.length - 1;

                return (

                    <motion.div
                        key={index}
                        initial={{
                            opacity: 0,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: .3,
                        }}
                        className="flex items-center gap-3"
                    >

                        {isCurrent ? (

                            <motion.div
                                animate={{
                                    opacity: [0.3, 1, 0.3],
                                    scale: [1, 1.25, 1],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: .9,
                                }}
                                className="h-3 w-3 rounded-full bg-violet-500"
                            />

                        ) : (

                            <div
                                className="
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center
                                rounded-full
                                bg-green-500
                                text-xs
                                text-white
                                "
                            >
                                ✓
                            </div>

                        )}

                        <p
                            className={
                                isCurrent
                                    ? "font-medium text-slate-700"
                                    : "text-slate-500"
                            }
                        >
                            {step}
                        </p>

                    </motion.div>

                );

            })}

        </div>

    );

}