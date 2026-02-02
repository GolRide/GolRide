import Image from "next/image";
import Link from "next/link";

export function LogoButton() {
  return (
    <Link href="/" className="flex items-center gap-2 no-underline">
      <Image src="/logo.svg" alt="GolRide" width={120} height={30} priority />
    </Link>
  );
}
