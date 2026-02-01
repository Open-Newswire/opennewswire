import Image from "next/image";
import logo from "./onw-logo.png";

export function Logo() {
  return (
    <div className="flex shrink-0 items-center gap-2 p-1">
      <Image
        src={logo}
        width={20}
        alt="Open Newswire Logo"
        style={{ marginLeft: "-2px" }}
      />
      <span className="text-lg font-bold tracking-tighter">Open Newswire</span>
    </div>
  );
}
