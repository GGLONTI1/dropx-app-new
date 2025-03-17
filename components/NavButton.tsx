import Link from "next/link";
import { Button } from "./ui/button";

interface NavButtonProps {
  href?: string;
  icon: React.FC;
  onClick?: () => void;
  label: string;
  title?: string;
  className?: string;
}

export default function NavButton({
  href,
  icon: Icon,
  onClick,
  label,
  title,
}: NavButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      title={label}
      className="rounded-lg"
    >
      {href ? (
        <Link href={href} className="flex gap-2 items-center ">
          <Icon />
          {title}
        </Link>
      ) : (
        <div className="flex gap-2 items-center ">
          <Icon />
          {title}
        </div>
      )}
    </Button>
  );
}
