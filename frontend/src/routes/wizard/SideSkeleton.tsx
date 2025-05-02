import { Flex, Image } from "@edifice.io/react";
import clsx from "clsx";
import { IconCommunity } from "@edifice.io/react/icons/nav";


const SkeletonContainer = ( { size, fill = true } : { size: "small" | "medium" | "full", fill?: boolean }) => {
  const className = clsx("bg-white rounded p-8", fill && "flex-fill");
  const heights = {
    small: "100px",
    medium: "140px",
    full: "auto"
  }
  const style = {
    height: heights[size],
    maxWidth: 170
  }
  const styleTitle = {
    width: size === "full" ? 100 : "100%",
    height: "16px"
  }
  
  return <div className={className} style={style}>
    <div className="w100 bg-gray-300 rounded" style={styleTitle}></div>
  </div>
}

export const SideSkeleton = () => {
  const coverColor = "115deg, #E5F5FF 0.32%, #46AFE6 100%";

  return <Flex className="w-100 bg-gray-300" style={{ height: "700px" }} direction="column">
    <div className="w-100" style={{ height: "225px" }}>
      {coverColor ?
        <div className="w-100 h-100" style={{ background: `linear-gradient(${coverColor})` }} />
        :
        <Image
          className="object-fit-cover w-100 h-100"
          alt="type"
          src={'image.png'}
        />
      }
    </div>
    <header className="px-24 w-100" style={{ height: 48, marginTop: "-24px" }}>
      <Flex gap="16" className="bg-white rounded px-12 py-8 h-100" align="center">
        <IconCommunity />
        <span className="text-truncate h4" style={{ flex: 1 }}>Lorem ipsum dolor sit amet consectetur adipisicis! Lorem ipsum dolor sit amet consectetur adipisicis!</span>
      </Flex>
    </header>
    <Flex className="p-24 flex-grow-1 pt-16" gap="16">
      <Flex className="flex-fill" gap="16" direction="column">
        <SkeletonContainer size="small" fill={false} />
        <SkeletonContainer size="small" fill={false} />
      </Flex>
      <SkeletonContainer size="full" />
      <SkeletonContainer size="medium"/>
    </Flex>
  </Flex>
}

export default SideSkeleton;