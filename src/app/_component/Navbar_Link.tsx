import Link from "next/link"
interface LinkProps {
  link_name: string,
  link: string
}

export default function Navbar_Link({ link_name, link }: LinkProps) {
  return (
    <Link
      href={link}
      className="font-medium flex items-center transition-colors hover:underline"
      prefetch={false}
    >
      {link_name}
    </Link>
  )
}