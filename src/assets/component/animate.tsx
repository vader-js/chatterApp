import { PropsWithChildren } from "react"
import { AnimatePresence, motion} from "framer-motion"


// import React from 'react'
type AnimateProps ={
    name: "Animate"
}
export default function Animate({children }: PropsWithChildren<AnimateProps>) {
  return (
    <AnimatePresence>
    <motion.div
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{delay: 0.5, duration: 1}}
    exit={{opacity: 0}}>
    {children}
    </motion.div>
    </AnimatePresence>
  )
}
